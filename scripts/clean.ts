/* oxlint-disable no-console */
import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const generatedDirectoryNames = new Set(['cjs', 'dist', 'esm', 'lib'])
const removed: string[] = []

const packagesRoot = join(root, 'packages')
for (const scope of readdirSync(packagesRoot, { withFileTypes: true }).filter((entry) =>
  entry.isDirectory(),
)) {
  const scopePath = join(packagesRoot, scope.name)
  for (const pkg of readdirSync(scopePath, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  )) {
    const packagePath = join(scopePath, pkg.name)
    for (const directoryName of generatedDirectoryNames) {
      const path = join(packagePath, directoryName)
      if (existsSync(path)) {
        rmSync(path, { recursive: true, force: true })
        removed.push(path)
      }
    }
  }
}

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.tsbuildinfo')) {
    const path = join(root, entry.name)
    rmSync(path, { force: true })
    removed.push(path)
  }
}

console.log(
  removed.length === 0 ? 'Nothing to clean.' : `Removed ${removed.length} generated path(s).`,
)
