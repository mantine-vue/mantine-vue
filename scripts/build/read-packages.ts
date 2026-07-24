import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface PackageInfo {
  name: string
  path: string
  dependencies: string[]
  private?: boolean
  cssLayer?: string
}

export function readPackages(root = join(process.cwd(), 'packages')): PackageInfo[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((scope) => {
      const scopePath = join(root, scope.name)
      return readdirSync(scopePath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((pkg) => {
          const packagePath = join(scopePath, pkg.name)
          const packageJson = JSON.parse(readFileSync(join(packagePath, 'package.json'), 'utf8'))
          const dependencyNames = [
            ...Object.keys(packageJson.dependencies ?? {}),
            ...Object.keys(packageJson.peerDependencies ?? {}),
            ...Object.keys(packageJson.devDependencies ?? {}),
          ].filter((dependency) => dependency.startsWith('@mantine-vue/'))

          return {
            name: packageJson.name,
            path: packagePath,
            dependencies: dependencyNames,
            private: packageJson.private,
            cssLayer: packageJson.mantineVue?.cssLayer,
          }
        })
    })
}

export function getPackageBuildOrder(packages: PackageInfo[]) {
  const order = new Map<string, number>()
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]))
  const foundationPriority = [
    '@mantine-vue/utils',
    '@mantine-vue/hooks',
    '@mantine-vue/store',
    '@mantine-vue/core',
    '@mantine-vue/form',
  ]

  function visit(pkg: PackageInfo): number {
    if (order.has(pkg.name)) {
      return order.get(pkg.name)!
    }

    if (pkg.private) {
      order.set(pkg.name, -1)
      return -1
    }

    const dependencyOrder = pkg.dependencies
      .map((dependency) => byName.get(dependency))
      .filter(Boolean)
      .map((dependency) => visit(dependency!))

    const level = dependencyOrder.length === 0 ? 0 : Math.max(...dependencyOrder) + 1
    order.set(pkg.name, level)
    return level
  }

  packages.forEach(visit)

  return [...packages]
    .filter((pkg) => order.get(pkg.name) !== -1)
    .sort(
      (a, b) =>
        order.get(a.name)! - order.get(b.name)! ||
        foundationPriority.indexOf(a.name) - foundationPriority.indexOf(b.name) ||
        a.name.localeCompare(b.name),
    )
}
