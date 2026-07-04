import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { failIfErrors, getWorkspaceManifests } from './utils'

/**
 * Confirms that every field a public package declares in package.json (main, module, types,
 * exports) points at a file that actually exists after `yarn build`. This is the check that
 * would have caught the ESM/CJS bundles being entirely missing before the build script bundled
 * them - run it after `yarn build`, not instead of it.
 */

const errors: string[] = []

function checkPath(directory: string, relativePath: string, label: string) {
  if (!relativePath || relativePath.includes('*')) {
    return
  }

  const resolved = join(directory, relativePath)
  if (!existsSync(resolved)) {
    errors.push(`${label} points to missing file: ${relativePath}`)
  }
}

function walkExports(directory: string, exportsField: unknown, label: string) {
  if (typeof exportsField === 'string') {
    checkPath(directory, exportsField, label)
    return
  }

  if (exportsField && typeof exportsField === 'object') {
    for (const [key, value] of Object.entries(exportsField as Record<string, unknown>)) {
      walkExports(directory, value, `${label} -> ${key}`)
    }
  }
}

for (const { content, directory, path } of getWorkspaceManifests()) {
  if (content.private) {
    continue
  }

  checkPath(directory, content.main, `${path} "main"`)
  checkPath(directory, content.module, `${path} "module"`)
  checkPath(directory, content.types, `${path} "types"`)
  walkExports(directory, content.exports, `${path} "exports"`)
}

failIfErrors(errors, 'All public package build outputs referenced by package.json exist.')
