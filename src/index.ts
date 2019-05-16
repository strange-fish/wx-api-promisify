import * as ts from "typescript"
import { resolve } from "path"
import { promises as fs } from "fs"

const rootFile = resolve(__dirname, "../wx/index.d.ts")

const targetFile = resolve(__dirname, "../wx/lib.wx.api.d.ts")

function genOutputFile(fileName: string, content: string) {
  fs.writeFile(resolve(__dirname, `../dist/${fileName}`), content).then(res => {
    console.log(`成功生成文件 ${fileName}`)
  })
}

const program = ts.createProgram([rootFile], {})
const sourceFile = program.getSourceFile(targetFile)
const checker = program.getTypeChecker()
const printer = ts.createPrinter()

const SUCCESS_METHOD_LIST = []
function editSuccessMethodNode(node: ts.MethodSignature) {
  function createPromiseRes(originalNode: ts.MethodSignature, resName: string) {
    const node = ts.updateMethodSignature(
      originalNode,
      undefined,
      originalNode.parameters,
      ts.createTypeReferenceNode(ts.createIdentifier("Promise"), [
        ts.createTypeReferenceNode(ts.createIdentifier(resName), undefined)
      ]),
      originalNode.name,
      undefined
    )
    return node
  }

  function getFirstParamType(method: ts.MethodSignature) {
    const firstParam = method.parameters && method.parameters[0]
    if (firstParam) {
      const res = checker.getTypeAtLocation(firstParam)
      // 成功回调的结果
      if (res && res.symbol) {
        const name = res.symbol.escapedName
        return String(name)
      }
    }
  }
  const methodNode = node as ts.MethodSignature
  // 查找参数数量为一
  if (methodNode.parameters.length === 1) {
    const firstParam = methodNode.parameters[0]
    // const symbol = checker.getSymbolAtLocation()
    const firstParamType = checker.getTypeAtLocation(firstParam.name)
    // 第一个参数的类型
    const properties = checker.getPropertiesOfType(firstParamType)
    // 该类型中的是否有成功回调
    const successProperty = properties.find(
      declaration => declaration.getName() === "success"
    )
    if (successProperty) {
      // 检查是否有重载
      if (successProperty.declarations.length === 1) {
        const declaration = successProperty.declarations[0]
        let name: string
        if (ts.isMethodSignature(declaration)) {
          name = getFirstParamType(declaration)
        } else {
          const methodType = checker.getTypeAtLocation(declaration)
          const nextDeclare = methodType.symbol.declarations[0]
          name = getFirstParamType(nextDeclare as any)
        }
        SUCCESS_METHOD_LIST.push(methodNode.name.getText())
        return createPromiseRes(methodNode, name)
      }
    }
  }
  return node
}

const transpileVoidToPromise: ts.TransformerFactory<ts.SourceFile> = function(
  context
) {
  const visit: ts.Visitor = function(node) {
    node = ts.visitEachChild(node, visit, context)

    const isWXInterface = node =>
      node && ts.isInterfaceDeclaration(node) && node.name.getText() === "WX"
    if (isWXInterface(node.parent)) {
      if (ts.isMethodSignature(node)) {
        node = editSuccessMethodNode(node)
      }
    }

    return node
  }
  return node => ts.visitNode(node, visit)
}

function generateDeclareFile() {
  const file = ts.transform(sourceFile, [transpileVoidToPromise])
  const content = printer.printFile(file.transformed[0])
  genOutputFile('wxp.api.d.ts', content)
}

function generateMethodListFile() {
  const content = JSON.stringify(SUCCESS_METHOD_LIST)
  genOutputFile('methodList.json', content)
}

generateDeclareFile()
generateMethodListFile()
