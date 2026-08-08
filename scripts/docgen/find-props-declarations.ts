import fs from 'node:fs'
import ts from 'typescript'

export interface PropsDeclaration {
  /** Component name, e.g. `Button` (the `*Props` suffix is stripped) */
  componentName: string
  /** Name of the interface / type alias, e.g. `ButtonProps` */
  interfaceName: string
  /** File the declaration lives in */
  fileName: string
}

const PROPS_SUFFIX = 'Props'

/**
 * `<Component>OwnProps` is the subset of props a Component
 * declares at runtime. `<Component>Props` which extends it together with
 * `BoxProps` is the public type, so documenting both would produce a bogus
 * `<Component>Own` entry alongside the real one.
 */
const OWN_PROPS_SUFFIX = 'OwnProps'

const SLOTS_SUFFIX = 'Slots'

/**
 * Ranks two declarations of the same component so the most canonical one wins:
 * `Button/Button.ts` beats `Button/index.ts`, and a shallower path beats a
 * deeper one.
 */
function scoreDeclaration(componentName: string, filePath: string) {
  const basename = filePath
    .split('/')
    .pop()!
    .replace(/(?:\.types)?\.vue?$/, '')
  let score = 0

  if (basename === componentName) {
    score += 1000
  }

  if (basename === 'index') {
    score -= 500
  }

  return score - filePath.split('/').length
}

/**
 * Finds every exported interface / type alias whose name ends with `suffix`
 * using a plain AST scan.
 *
 * This deliberately does not create a `ts.Program`: parsing a file on its own is
 * orders of magnitude cheaper than type checking it, and knowing up front which
 * files matter lets the expensive checker phase run over small batches instead
 * of the whole monorepo at once.
 */
function findSuffixedDeclarations(
  files: string[],
  suffix: string,
  isIgnored: (name: string) => boolean,
): PropsDeclaration[] {
  const best = new Map<string, { score: number; declaration: PropsDeclaration }>()

  for (const fileName of files) {
    const sourceFile = ts.createSourceFile(
      fileName,
      fs.readFileSync(fileName, 'utf8'),
      ts.ScriptTarget.ESNext,
      /* setParentNodes */ false,
      fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    )

    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) {
        return
      }

      const interfaceName = node.name.text

      if (!interfaceName.endsWith(suffix) || interfaceName === suffix) {
        return
      }

      if (isIgnored(interfaceName)) {
        return
      }

      const isExported = node.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )

      if (!isExported) {
        return
      }

      const componentName = interfaceName.slice(0, -suffix.length)
      const score = scoreDeclaration(componentName, fileName)
      const existing = best.get(componentName)

      if (!existing || score > existing.score) {
        best.set(componentName, {
          score,
          declaration: { componentName, interfaceName, fileName },
        })
      }
    })
  }

  return [...best.values()]
    .map((entry) => entry.declaration)
    .sort((a, b) => a.componentName.localeCompare(b.componentName))
}

/** Finds every exported `*Props` interface / type alias. */
export function findPropsDeclarations(
  files: string[],
  excludeComponents: string[] = [],
): PropsDeclaration[] {
  const excluded = new Set(excludeComponents)

  return findSuffixedDeclarations(
    files,
    PROPS_SUFFIX,
    (name) => name.endsWith(OWN_PROPS_SUFFIX) || excluded.has(name),
  )
}

/**
 * Finds every exported `*Slots` interface / type alias, e.g. `BadgeSlots`.
 * Mirrors `findPropsDeclarations`: a component's slots type usually lives next
 * to its props type, but is looked up independently so the two can also live
 * in different files.
 */
export function findSlotsDeclarations(
  files: string[],
  excludeComponents: string[] = [],
): PropsDeclaration[] {
  const excluded = new Set(excludeComponents)

  return findSuffixedDeclarations(files, SLOTS_SUFFIX, (name) => excluded.has(name))
}

/** Groups declarations into batches of at most `size` distinct files. */
export function chunkByFile(declarations: PropsDeclaration[], size: number): PropsDeclaration[][] {
  const byFile = new Map<string, PropsDeclaration[]>()

  for (const declaration of declarations) {
    const existing = byFile.get(declaration.fileName)
    if (existing) {
      existing.push(declaration)
    } else {
      byFile.set(declaration.fileName, [declaration])
    }
  }

  const chunks: PropsDeclaration[][] = []
  let current: PropsDeclaration[] = []
  let filesInChunk = 0

  for (const group of byFile.values()) {
    current.push(...group)
    filesInChunk += 1

    if (filesInChunk >= size) {
      chunks.push(current)
      current = []
      filesInChunk = 0
    }
  }

  if (current.length > 0) {
    chunks.push(current)
  }

  return chunks
}
