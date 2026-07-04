import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { failIfErrors, getWorkspaceManifests, root } from './utils'

const rootManifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const scripts = rootManifest.scripts as Record<string, string>
const workspaceNames = new Set(getWorkspaceManifests().map(({ content }) => content.name))
const errors: string[] = []

for (const [name, command] of Object.entries(scripts)) {
  for (const match of command.matchAll(/(?:tsx|node)\s+(scripts\/[^\s&|]+)/g)) {
    const path = join(root, match[1])
    const candidates = [
      path,
      `${path}.ts`,
      `${path}.js`,
      join(path, 'index.ts'),
      join(path, 'index.js'),
    ]
    if (!candidates.some(existsSync)) {
      errors.push(`${name} references missing helper ${match[1]}`)
    }
  }

  const workspace = command.match(/yarn workspace\s+([^\s]+)/)?.[1]
  if (workspace && !workspaceNames.has(workspace)) {
    errors.push(`${name} references missing workspace ${workspace}`)
  }
}

failIfErrors(errors, 'All root script paths and workspace references are valid.')
