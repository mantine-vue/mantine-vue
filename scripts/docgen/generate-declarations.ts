/* oxlint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import {
  chunkByFile,
  findPropsDeclarations,
  findSlotsDeclarations,
  type PropsDeclaration,
} from './find-props-declarations'
import { getSourceFiles } from './get-source-files'
import type { DocgenData, DocgenProp, DocgenSlot, GenerateDeclarationsOptions } from './types'

function readCompilerOptions(tsConfigPath: string): ts.CompilerOptions {
  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile)

  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsConfigPath),
  )

  return {
    ...parsed.options,
    noEmit: true,
    declaration: false,
    declarationMap: false,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
  }
}

function isWithinPaths(filePath: string, roots: string[]) {
  const normalized = filePath.split(path.sep).join('/')
  return roots.some((root) => normalized.startsWith(root))
}

/**
 * Turns an absolute source path into a repository-relative one so that
 * `docgen.json` never contains machine-specific paths.
 */
function toRepositoryPath(filePath: string) {
  const normalized = filePath.split(path.sep).join('/')
  const index = normalized.lastIndexOf('/packages/')
  return index === -1 ? normalized : normalized.slice(index + 1)
}

/**
 * Strips the trailing `| undefined` that TypeScript adds to every optional
 * property. Optionality is already communicated by the `required` flag, and
 * React Mantine does not render it either.
 */
function stripUndefined(type: string) {
  return type
    .replace(/\s*\|\s*undefined$/, '')
    .replace(/^undefined\s*\|\s*/, '')
    .trim()
}

/**
 * Removes the `import("/abs/path/to/csstype/index").` qualifiers TypeScript
 * emits for types that are not imported into the current file. They are
 * machine-specific absolute paths, so they must never reach docgen.json.
 */
function stripImportPaths(type: string) {
  return type.replace(/import\("[^"]*"\)\./g, '')
}

/**
 * Collapses the expanded form of a responsive style prop back into its alias.
 * `X | Partial<Record<MantineBreakpoint, X | undefined>>` is exactly what
 * `StyleProp<X>` means, and the short form is what the docs should show.
 */
function collapseStyleProp(type: string) {
  const match = type.match(/^(.+) \| Partial<Record<MantineBreakpoint, \1(?: \| undefined)?>>$/)

  return match ? `StyleProp<${match[1]}>` : type
}

function cleanType(type: string, typesReplacement: Record<string, string>) {
  const stripped = collapseStyleProp(stripUndefined(stripImportPaths(type)))
  return typesReplacement[stripped] ?? typesReplacement[type] ?? stripped
}

/**
 * Builds the description string. The plain doc comment is the body, and
 * meaningful JSDoc tags (everything except `@default`, which is surfaced
 * separately as `defaultValue`) are appended so the docs UI can detect them –
 * `@deprecated` in particular is rendered with a strikethrough.
 */
function getDescription(symbol: ts.Symbol, checker: ts.TypeChecker) {
  const comment = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()

  const tags = symbol
    .getJsDocTags(checker)
    .filter((tag) => tag.name !== 'default')
    .map((tag) => {
      const text = ts.displayPartsToString(tag.text ?? []).trim()
      return text ? `@${tag.name} ${text}` : `@${tag.name}`
    })

  return [comment, ...tags].filter(Boolean).join('\n').trim()
}

function getDefaultValue(symbol: ts.Symbol, checker: ts.TypeChecker) {
  const tag = symbol.getJsDocTags(checker).find((item) => item.name === 'default')

  if (!tag) {
    return null
  }

  return ts.displayPartsToString(tag.text ?? []).trim() || null
}

interface CollectPropsOptions {
  type: ts.Type
  checker: ts.TypeChecker
  includePaths: string[]
  excludeProps: Set<string>
  typesReplacement: Record<string, string>
}

function collectProps({
  type,
  checker,
  includePaths,
  excludeProps,
  typesReplacement,
}: CollectPropsOptions): Record<string, DocgenProp> {
  const props: Record<string, DocgenProp> = {}

  for (const symbol of checker.getPropertiesOfType(type)) {
    const name = symbol.getName()

    if (excludeProps.has(name) || name.startsWith('__')) {
      continue
    }

    const declaration = symbol.declarations?.[0]

    if (!declaration) {
      continue
    }

    // Skip props inherited from outside the monorepo (Vue's own component
    // options, DOM attribute maps, third party types)
    if (!isWithinPaths(declaration.getSourceFile().fileName, includePaths)) {
      continue
    }

    const propType = checker.getTypeOfSymbolAtLocation(symbol, declaration)
    const typeName = checker.typeToString(
      propType,
      declaration,
      // `UseAliasDefinedOutsideCurrentScope` keeps readable aliases such as
      // `StyleProp<MantineSpacing>` instead of expanding them into their full
      // structural form.
      ts.TypeFormatFlags.NoTruncation |
        ts.TypeFormatFlags.InTypeAlias |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    )

    props[name] = {
      name,
      type: { name: cleanType(typeName, typesReplacement) },
      required: !(symbol.flags & ts.SymbolFlags.Optional),
      description: getDescription(symbol, checker),
      defaultValue: getDefaultValue(symbol, checker),
      declaredIn: toRepositoryPath(declaration.getSourceFile().fileName),
    }
  }

  return Object.keys(props)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, DocgenProp>>((acc, key) => {
      acc[key] = props[key]
      return acc
    }, {})
}

interface CollectSlotsOptions {
  type: ts.Type
  checker: ts.TypeChecker
  includePaths: string[]
  typesReplacement: Record<string, string>
}

function collectSlots({
  type,
  checker,
  includePaths,
  typesReplacement,
}: CollectSlotsOptions): Record<string, DocgenSlot> {
  const slots: Record<string, DocgenSlot> = {}

  for (const symbol of checker.getPropertiesOfType(type)) {
    const name = symbol.getName()

    if (name.startsWith('__')) {
      continue
    }

    const declaration = symbol.declarations?.[0]

    if (!declaration) {
      continue
    }

    if (!isWithinPaths(declaration.getSourceFile().fileName, includePaths)) {
      continue
    }

    const slotType = checker.getTypeOfSymbolAtLocation(symbol, declaration)
    const typeName = checker.typeToString(
      slotType,
      declaration,
      ts.TypeFormatFlags.NoTruncation |
        ts.TypeFormatFlags.InTypeAlias |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    )

    slots[name] = {
      name,
      type: { name: cleanType(typeName, typesReplacement) },
      required: !(symbol.flags & ts.SymbolFlags.Optional),
      description: getDescription(symbol, checker),
      declaredIn: toRepositoryPath(declaration.getSourceFile().fileName),
    }
  }

  return Object.keys(slots)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, DocgenSlot>>((acc, key) => {
      acc[key] = slots[key]
      return acc
    }, {})
}

interface AnalyseChunkOptions {
  declarations: PropsDeclaration[]
  slotsByComponent: Map<string, PropsDeclaration>
  compilerOptions: ts.CompilerOptions
  includePaths: string[]
  excludeProps: Set<string>
  typesReplacement: Record<string, string>
}

/** Resolves the exported symbol a `PropsDeclaration` (or slots equivalent) points at. */
function resolveDeclaredSymbol(
  program: ts.Program,
  checker: ts.TypeChecker,
  declaration: PropsDeclaration,
): ts.Symbol | undefined {
  const sourceFile = program.getSourceFile(declaration.fileName)

  if (!sourceFile) {
    return undefined
  }

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  const exported = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : []
  return exported.find((item) => item.getName() === declaration.interfaceName)
}

/**
 * Type checks one chunk of declarations.
 *
 * Every chunk gets a fresh `ts.Program`, and therefore a fresh type checker.
 * That matters: resolving a props interface materialises large structural types
 * that the checker caches for its lifetime, so a single program covering the
 * whole monorepo grows past several GB and gets OOM-killed. Recreating the
 * program per chunk trades a little CPU for a bounded memory ceiling.
 */
function analyseChunk({
  declarations,
  slotsByComponent,
  compilerOptions,
  includePaths,
  excludeProps,
  typesReplacement,
}: AnalyseChunkOptions): DocgenData {
  // A component's `*Slots` interface does not always live in the same file as
  // its `*Props` interface (see `WeekViewSlots`, declared next to the
  // component itself rather than in the shared `component-props.ts`), so its
  // file needs to be a root too or the checker never parses it.
  const slotsDeclarations = declarations
    .map((declaration) => slotsByComponent.get(declaration.componentName))
    .filter((declaration): declaration is PropsDeclaration => Boolean(declaration))

  const rootNames = [
    ...new Set([...declarations, ...slotsDeclarations].map((declaration) => declaration.fileName)),
  ]
  const program = ts.createProgram(rootNames, compilerOptions)
  const checker = program.getTypeChecker()

  const data: DocgenData = {}

  for (const declaration of declarations) {
    const symbol = resolveDeclaredSymbol(program, checker, declaration)

    if (!symbol) {
      continue
    }

    const type = checker.getDeclaredTypeOfSymbol(symbol)
    const props = collectProps({
      type,
      checker,
      includePaths,
      excludeProps,
      typesReplacement,
    })

    if (Object.keys(props).length === 0) {
      continue
    }

    const slotsDeclaration = slotsByComponent.get(declaration.componentName)
    const slotsSymbol = slotsDeclaration
      ? resolveDeclaredSymbol(program, checker, slotsDeclaration)
      : undefined
    const slots = slotsSymbol
      ? collectSlots({
          type: checker.getDeclaredTypeOfSymbol(slotsSymbol),
          checker,
          includePaths,
          typesReplacement,
        })
      : undefined

    data[declaration.componentName] = {
      displayName: declaration.componentName,
      description: getDescription(symbol, checker),
      props,
      ...(slots && Object.keys(slots).length > 0 ? { slots } : {}),
      declaredIn: toRepositoryPath(declaration.fileName),
    }
  }

  return data
}

export function generateDeclarations(options: GenerateDeclarationsOptions): DocgenData {
  const {
    tsConfigPath,
    outputPath,
    sourcePaths,
    includePaths,
    packages,
    components,
    excludeProps = [],
    excludeComponents = [],
    excludeFiles = [],
    typesReplacement = {},
    chunkSize = 15,
  } = options

  const compilerOptions = readCompilerOptions(tsConfigPath)
  const selectedPaths = packages?.length
    ? sourcePaths.filter((sourcePath) => packages.some((name) => sourcePath.includes(`/${name}/`)))
    : sourcePaths

  if (selectedPaths.length === 0) {
    throw new Error(`Docgen: no source paths matched ${packages?.join(', ')}`)
  }

  const files = getSourceFiles(selectedPaths).filter(
    (file) => !excludeFiles.some((excluded) => file.endsWith(excluded)),
  )
  const allDeclarations = findPropsDeclarations(files, excludeComponents)
  const declarations = components?.length
    ? allDeclarations.filter((declaration) => components.includes(declaration.componentName))
    : allDeclarations
  const slotsByComponent = new Map(
    findSlotsDeclarations(files).map((declaration) => [declaration.componentName, declaration]),
  )
  const chunks = chunkByFile(declarations, chunkSize)

  console.log(
    `Docgen: found ${declarations.length} components in ${files.length} files (${chunks.length} chunks)`,
  )

  const outputFile = path.join(outputPath, 'docgen.json')

  // When only some packages are regenerated, keep the entries of the packages
  // that were not analysed in this run.
  const isPartialRun = Boolean(packages?.length || components?.length)
  const data: DocgenData =
    isPartialRun && fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile, 'utf8')) : {}

  const writeOutput = () => {
    const sorted = Object.keys(data)
      .sort((a, b) => a.localeCompare(b))
      .reduce<DocgenData>((acc, key) => {
        acc[key] = data[key]
        return acc
      }, {})

    fs.mkdirSync(outputPath, { recursive: true })
    fs.writeFileSync(outputFile, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')
    return sorted
  }

  chunks.forEach((chunk, index) => {
    Object.assign(
      data,
      analyseChunk({
        declarations: chunk,
        slotsByComponent,
        compilerOptions,
        includePaths,
        excludeProps: new Set(excludeProps),
        typesReplacement,
      }),
    )

    console.log(`Docgen: chunk ${index + 1}/${chunks.length} done (${chunk.length} components)`)

    writeOutput()

    global.gc?.()
  })

  const sorted = writeOutput()

  console.log(`Docgen: wrote ${Object.keys(sorted).length} components to ${outputFile}`)

  return sorted
}
