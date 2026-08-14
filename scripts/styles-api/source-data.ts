import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { getPath } from '../utils/get-path'

const PACKAGES_DIR = getPath('packages/@mantine-vue')
const MDX_DATA_FILE = getPath('apps/mantine.dev/src/mdx/mdx-data.ts')
const SOURCE_EXTENSIONS = new Set(['.ts', '.vue', '.css'])

export interface SourceModifier {
  modifier: string
  selector: string
}

export interface ComponentSourceData {
  component: string
  files: string[]
  selectors: string[]
  selectorsAreComplete: boolean
  vars: string[]
  varsAreComplete: boolean
  modifiers: SourceModifier[]
}

let sourceFiles: string[] | undefined

function walk(directory: string, result: string[]) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      if (!['node_modules', '__tests__', 'lib', 'dist'].includes(entry.name)) {
        walk(entryPath, result)
      }
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      result.push(entryPath)
    }
  }
}

function getSourceFiles() {
  if (!sourceFiles) {
    sourceFiles = []
    walk(PACKAGES_DIR, sourceFiles)
  }

  return sourceFiles
}

function unique(values: Iterable<string>) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function readImportedCss(files: string[]) {
  const cssFiles = new Set<string>()

  for (const file of files.filter((item) => /\.(ts|vue)$/.test(item))) {
    const source = fs.readFileSync(file, 'utf8')

    for (const match of source.matchAll(/from\s+['"](.+?\.module\.css)['"]/g)) {
      const cssPath = path.resolve(path.dirname(file), match[1])

      if (fs.existsSync(cssPath)) {
        cssFiles.add(cssPath)
      }
    }
  }

  return [...cssFiles]
}

function extractTypeSelectors(component: string, files: string[]) {
  const selectors = new Set<string>()
  let found = false
  let complete = false

  for (const file of files.filter((item) => item.endsWith('.ts'))) {
    const source = fs.readFileSync(file, 'utf8')
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)

    sourceFile.forEachChild((node) => {
      if (ts.isTypeAliasDeclaration(node) && node.name.text === `${component}StylesNames`) {
        found = true

        const isLiteralUnion = (typeNode: ts.TypeNode): boolean => {
          if (ts.isLiteralTypeNode(typeNode)) {
            return ts.isStringLiteral(typeNode.literal)
          }

          if (ts.isUnionTypeNode(typeNode)) {
            return typeNode.types.every(isLiteralUnion)
          }

          return ts.isParenthesizedTypeNode(typeNode) && isLiteralUnion(typeNode.type)
        }

        complete ||= isLiteralUnion(node.type)

        const visit = (typeNode: ts.Node) => {
          if (ts.isLiteralTypeNode(typeNode) && ts.isStringLiteral(typeNode.literal)) {
            selectors.add(typeNode.literal.text)
          }

          typeNode.forEachChild(visit)
        }

        visit(node.type)
      }
    })
  }

  return { selectors: [...selectors], complete: found && complete && selectors.size > 0 }
}

function extractCssData(cssFiles: string[]) {
  const selectors = new Set<string>()
  const modifiers: SourceModifier[] = []

  for (const file of cssFiles) {
    const source = fs.readFileSync(file, 'utf8')

    for (const match of source.matchAll(/^\.([\w-]+)/gm)) {
      selectors.add(match[1])
    }

    for (const match of source.matchAll(/\.([\w-]+)[^{,\n]*\[data-([\w-]+)/g)) {
      modifiers.push({ selector: match[1], modifier: `data-${match[2]}` })
    }
  }

  return { selectors: [...selectors], modifiers }
}

export function getDocumentedStylesComponents() {
  const source = fs.readFileSync(MDX_DATA_FILE, 'utf8')
  const sourceFile = ts.createSourceFile(MDX_DATA_FILE, source, ts.ScriptTarget.Latest, true)
  const components: string[] = []

  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(sourceFile) === 'styles' &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const element of node.initializer.elements) {
        if (ts.isStringLiteral(element)) {
          components.push(element.text)
        }
      }
    }

    node.forEachChild(visit)
  }

  visit(sourceFile)
  return unique(components)
}

export function getComponentSourceData(component: string): ComponentSourceData {
  const allFiles = getSourceFiles()
  const typeName = `${component}StylesNames`
  const exactFiles = allFiles.filter((file) => {
    const extension = path.extname(file)
    const baseName = path.basename(file, extension).replace(/\.types$/, '')
    return baseName === component
  })
  const typeFiles = allFiles.filter(
    (file) => file.endsWith('.ts') && fs.readFileSync(file, 'utf8').includes(typeName),
  )
  const files = unique([...exactFiles, ...typeFiles])
  const text = exactFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
  const typeSelectors = extractTypeSelectors(component, files)
  const cssData = extractCssData(readImportedCss(exactFiles))
  const getStylesSelectors = [...text.matchAll(/(?:\.|\b)getStyles\(\s*['"]([\w-]+)['"]/g)].map(
    (match) => match[1],
  )
  const vars = [...text.matchAll(/['"](--[\w-]+)['"]\s*:/g)].map((match) => match[1])
  const sourceAttributes = new Set(
    [...text.matchAll(/\bdata-([\w-]+)/g)].map((match) => `data-${match[1]}`),
  )
  const selectors = unique(
    typeSelectors.complete
      ? typeSelectors.selectors
      : [...getStylesSelectors, ...cssData.selectors],
  )
  const selectorSet = new Set(selectors)
  const modifiers = cssData.modifiers.filter(
    (item) => sourceAttributes.has(item.modifier) && selectorSet.has(item.selector),
  )

  return {
    component,
    files,
    selectors,
    selectorsAreComplete: typeSelectors.complete,
    vars: unique(vars),
    varsAreComplete: text.includes('createVarsResolver'),
    modifiers: modifiers.filter(
      (item, index, array) =>
        array.findIndex(
          (candidate) =>
            candidate.modifier === item.modifier && candidate.selector === item.selector,
        ) === index,
    ),
  }
}
