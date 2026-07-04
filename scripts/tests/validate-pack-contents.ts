import { spawnSync } from 'node:child_process'
import { commandInvocation } from '../utils/commands'
import { getWorkspaceManifests, failIfErrors } from './utils'

const errors: string[] = []

function collectExportPaths(exportsField: unknown): string[] {
  if (typeof exportsField === 'string') {
    return exportsField.includes('*') ? [] : [exportsField]
  }

  if (exportsField && typeof exportsField === 'object') {
    return Object.values(exportsField as Record<string, unknown>).flatMap(collectExportPaths)
  }

  return []
}

function normalize(path: string) {
  return path.replace(/^\.\//, '')
}

for (const { content, directory, path } of getWorkspaceManifests()) {
  if (content.private) {
    continue
  }

  const command = commandInvocation('npm', ['pack', '--dry-run', '--json'])
  const result = spawnSync(command.command, command.args, {
    cwd: directory,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    errors.push(
      `${path}: \`npm pack --dry-run\` failed:\n${result.stderr || result.stdout || result.error}`,
    )
    continue
  }

  let packedFiles: string[]
  try {
    const parsed = JSON.parse(result.stdout)
    packedFiles = parsed[0].files.map((file: { path: string }) => file.path)
  } catch (error) {
    errors.push(`${path}: could not parse \`npm pack --dry-run --json\` output: ${error}`)
    continue
  }

  const expectedPaths = [
    ...[content.main, content.module, content.types].filter(Boolean),
    ...collectExportPaths(content.exports),
  ].map(normalize)

  for (const expected of expectedPaths) {
    if (!packedFiles.includes(expected)) {
      errors.push(
        `${path}: npm pack would NOT include "${expected}" (declared in package.json but ` +
          `missing from the tarball - check the "files" field)`,
      )
    }
  }
}

failIfErrors(errors, 'npm pack would include every file each public package.json declares.')
