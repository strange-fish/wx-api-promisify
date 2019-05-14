import * as ts from 'typescript'
import { promises as fs } from 'fs'

const fileName = 'test.d.ts'

function findInterface (node: ts.Node) {
  if (node.kind === ts.SyntaxKind.MethodSignature) {
    console.log(node)
  } else {
    ts.forEachChild(node, findInterface)
  }
}

async function parse () {
  const fileContent = await fs.readFile(fileName, 'utf-8')
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  )
  findInterface(sourceFile)
}

parse()
