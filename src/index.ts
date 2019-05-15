import * as ts from 'typescript'
import { resolve } from 'path'
import { promises as fs } from 'fs'

const rootFile = resolve(__dirname, '../wx/index.d.ts')

const targetFile = resolve(__dirname, '../wx/lib.wx.api.d.ts')

const program = ts.createProgram([rootFile], {})
const sourceFile = program.getSourceFile(targetFile)
const checker = program.getTypeChecker()
const printer = ts.createPrinter()

getMethod(sourceFile)


function createPromiseRes (name: string) {
  return ts.createTypeReferenceNode(ts.createIdentifier('Promise'), [
    ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
  ])
}

function getFirstParamType (method: ts.MethodSignature) {
  const firstParam = method.parameters && method.parameters[0]
  if (firstParam) {
    const res = checker.getTypeAtLocation(firstParam)
    // 成功回调的结果
    if (res && res.symbol) {
      const name = res.symbol.escapedName
      console.log(name)
      return String(name)
    }
  }
}

function getMethod (node: ts.Node) {
  // 查找函数节点
  if (ts.isMethodSignature(node)) {
    const methodNode = node as ts.MethodSignature
    // 查找参数数量为一
    if (methodNode.parameters.length === 1) {
      const firstParam = methodNode.parameters[0]
      // const symbol = checker.getSymbolAtLocation()
      const type = checker.getTypeAtLocation(firstParam.name)
      // 第一个参数的类型
      const properties = checker.getPropertiesOfType(type)
      // 该类型中的是否有成功回调
      const successProperty = properties.find(declaration => declaration.getName() === 'success')
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
        }
      }
    }
  } else {
    ts.forEachChild(node, getMethod)
  }
}

const transpileVoidToPromise:  =  {

}
