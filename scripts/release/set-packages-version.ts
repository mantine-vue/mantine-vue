import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { readPackages } from '../build/read-packages'

const SYNCED_DEPENDENCY_FIELDS = ['dependencies', 'peerDependencies'] as const

function readManifest(filePath: string) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function writeManifest(filePath: string, manifest: unknown) {
  writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`)
}

export function setPackagesVersion(version: string, root = process.cwd()) {
  const packages = readPackages(join(root, 'packages'))
  const manifestPaths = packages.map((pkg) => join(pkg.path, 'package.json'))
  const rootManifestPath = join(root, 'package.json')

  // bump every package's own version.
  for (const manifestPath of [...manifestPaths, rootManifestPath]) {
    const manifest = readManifest(manifestPath)
    manifest.version = version
    writeManifest(manifestPath, manifest)
  }

  // point every internal cross-reference (dependencies/peerDependencies)
  const versionsByPackageName = new Map<string, string>(
    manifestPaths.map((manifestPath) => {
      const manifest = readManifest(manifestPath)
      return [manifest.name as string, manifest.version as string]
    }),
  )

  for (const manifestPath of manifestPaths) {
    const manifest = readManifest(manifestPath)
    let changed = false

    for (const field of SYNCED_DEPENDENCY_FIELDS) {
      if (!manifest[field]) continue

      for (const dependencyName of Object.keys(manifest[field])) {
        if (!dependencyName.startsWith('@mantine-vue/')) continue

        const actualVersion = versionsByPackageName.get(dependencyName)
        if (actualVersion && manifest[field][dependencyName] !== actualVersion) {
          manifest[field][dependencyName] = actualVersion
          changed = true
        }
      }
    }

    if (changed) {
      writeManifest(manifestPath, manifest)
    }
  }
}
