/* oxlint-disable no-console */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const packagesRoot = join(process.cwd(), 'packages')
const errors: string[] = []

for (const scope of readdirSync(packagesRoot)) {
  const scopePath = join(packagesRoot, scope)
  for (const pkg of readdirSync(scopePath)) {
    const pkgPath = join(scopePath, pkg)
    const manifestPath = join(pkgPath, 'package.json')
    if (!existsSync(manifestPath)) {
      continue
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    if (!manifest.name || !manifest.exports || !manifest.types) {
      errors.push(`${manifestPath} must define name, exports and types`)
    }
  }
}

if (errors.length > 0) {
  throw new Error(errors.join('\n'))
}

console.log('Package manifests are structurally valid.')
