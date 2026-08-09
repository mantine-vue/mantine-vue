/* oxlint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { getPath } from '../utils/get-path'

/**
 * Cross-checks `packages/@docs/styles-api` against the components it documents.
 *
 * Styles API data is hand-authored, so it drifts silently when a component gains
 * a selector or a CSS variable. This script catches that drift:
 *
 * - **selectors** – every `getStyles('<name>')` call must be documented, and
 *   every documented selector must exist in the component
 * - **CSS variables** every variable produced by `createVarsResolver` must be
 *   documented, and vice versa
 *
 * Data attributes are reported for information only: sibling components often
 * share one `*.module.css` file, so attributes cannot be attributed to a single
 * component reliably.
 *
 * Run with `yarn styles-api:validate`.
 */

const DATA_DIR = getPath('packages/@docs/styles-api/src/data')
const PACKAGES_DIR = getPath('packages/@mantine-vue')

interface DocumentedComponent {
  component: string
  file: string
  selectors: string[]
  vars: string[]
}

function readDocumentedComponents(): DocumentedComponent[] {
  const result: DocumentedComponent[] = []

  for (const fileName of fs.readdirSync(DATA_DIR).sort()) {
    if (!fileName.endsWith('.styles-api.ts')) {
      continue
    }

    const source = fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8')
    const blocks = source.matchAll(/export const (\w+)StylesApi[^=]*=\s*\{([\s\S]*?)\n\}/g)

    for (const block of blocks) {
      const [, component, body] = block
      const selectorsBlock = body.match(/selectors:\s*\{([\s\S]*?)\n {2}\}/)

      result.push({
        component,
        file: fileName,
        selectors: selectorsBlock
          ? [...selectorsBlock[1].matchAll(/^\s+(\w+):/gm)].map((m) => m[1])
          : [],
        vars: [...body.matchAll(/'(--[\w-]+)':/g)].map((m) => m[1]),
      })
    }
  }

  return result
}

/**
 * Finds the sources of `<Component>` anywhere under `packages/@mantine-vue`.
 *
 * Components keep a thin `<Component>.ts`
 * entry point while `getStyles()` calls and the vars resolver live in
 * `<Component>.vue`, so both files are collected and scanned together.
 */
function findComponentSources(component: string): string[] {
  const stack = [PACKAGES_DIR]
  const found: string[] = []

  while (stack.length > 0) {
    const directory = stack.pop()!

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.posix.join(directory, entry.name)

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '__tests__') {
          stack.push(entryPath)
        }
      } else if (entry.name === `${component}.ts` || entry.name === `${component}.vue`) {
        found.push(entryPath)
      }
    }
  }

  return found
}

const errors: string[] = []
const warnings: string[] = []
const documented = readDocumentedComponents()

for (const entry of documented) {
  const sourcePaths = findComponentSources(entry.component)

  if (sourcePaths.length === 0) {
    warnings.push(`${entry.component}: no ${entry.component}.ts/.vue found – skipped`)
    continue
  }

  const source = sourcePaths.map((sourcePath) => fs.readFileSync(sourcePath, 'utf8')).join('\n')

  const actualSelectors = new Set([...source.matchAll(/getStyles\('(\w+)'/g)].map((m) => m[1]))
  const actualVars = new Set([...source.matchAll(/'(--[\w-]+)':/g)].map((m) => m[1]))

  const documentedSelectors = new Set(entry.selectors)
  const documentedVars = new Set(entry.vars)

  const compare = (label: string, actual: Set<string>, docs: Set<string>) => {
    const undocumented = [...actual].filter((item) => !docs.has(item))
    const stale = [...docs].filter((item) => !actual.has(item))

    if (undocumented.length > 0) {
      errors.push(
        `${entry.component} (${entry.file}): undocumented ${label}: ${undocumented.join(', ')}`,
      )
    }

    if (stale.length > 0) {
      errors.push(
        `${entry.component} (${entry.file}): documented ${label} not found in source: ${stale.join(', ')}`,
      )
    }
  }

  compare('selectors', actualSelectors, documentedSelectors)
  compare('CSS variables', actualVars, documentedVars)
}

console.log(`Checked ${documented.length} documented components.`)

warnings.forEach((warning) => console.log(`warning: ${warning}`))

if (errors.length > 0) {
  errors.forEach((error) => console.error(`error: ${error}`))
  console.error(`\n${errors.length} Styles API data problem(s) found.`)
  process.exit(1)
}

console.log('Styles API data matches component sources.')
