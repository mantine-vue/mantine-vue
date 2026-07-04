import { bundlePackage } from './bundle-package'
import { getPackageBuildOrder, readPackages } from './read-packages'
import { generateDeclarations } from './types'

const requestedPackages = process.argv.slice(2).filter((arg) => arg !== 'all')

const allPackages = getPackageBuildOrder(readPackages())
const packages =
  requestedPackages.length === 0
    ? allPackages
    : allPackages.filter(
        (pkg) =>
          requestedPackages.includes(pkg.name) ||
          requestedPackages.includes(pkg.name.replace('@mantine-vue/', '')),
      )

if (requestedPackages.length > 0 && packages.length === 0) {
  console.error(`No matching public packages found for: ${requestedPackages.join(', ')}`)
  process.exit(1)
}

console.log('Build order:')
packages.forEach((pkg, index) => {
  console.log(`${index + 1}. ${pkg.name}`)
})

console.log(
  '\nThis script preserves Mantine build philosophy: package graph first, package build second.',
)

async function run() {
  for (const pkg of packages) {
    console.log(`\nBundling ${pkg.name} (esm + cjs)...`)
    await bundlePackage(pkg)
  }

  console.log('\nGenerating type declarations...')
  generateDeclarations(packages)

  console.log('\nBuild complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
