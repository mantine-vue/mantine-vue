import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { readPackages } from '../build/read-packages'

function writeVersionToPackageJson(filePath: string, version: string) {
  const current = JSON.parse(readFileSync(filePath, 'utf8'))
  current.version = version

  for (const field of ['dependencies', 'peerDependencies']) {
    if (current[field]) {
      for (const packageName of Object.keys(current[field])) {
        if (packageName.startsWith('@mantine-vue/')) {
          current[field][packageName] = version
        }
      }
    }
  }

  writeFileSync(filePath, `${JSON.stringify(current, null, 2)}\n`)
}

export function setPackagesVersion(version: string, root = process.cwd()) {
  const packages = readPackages(join(root, 'packages'))

  for (const pkg of packages) {
    writeVersionToPackageJson(join(pkg.path, 'package.json'), version)
  }

  writeVersionToPackageJson(join(root, 'package.json'), version)
}
