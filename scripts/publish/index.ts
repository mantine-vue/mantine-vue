import { getPackageBuildOrder, readPackages } from '../build/read-packages'
import { publishPackage } from './publish-package'

function parseArgs(argv: string[]) {
  const stageIndex = argv.indexOf('--stage')
  const tagIndex = argv.indexOf('--tag')
  const stage = stageIndex !== -1 ? argv[stageIndex + 1] : undefined
  let tag = tagIndex !== -1 ? argv[tagIndex + 1] : 'latest'
  const dryRun = argv.includes('--dry-run')

  if (stage && (!tagIndex || tag === 'latest')) {
    tag = 'next'
  }

  if (stage && !['alpha', 'beta'].includes(stage)) {
    throw new Error(`Invalid --stage "${stage}". Expected "alpha" or "beta".`)
  }

  return { stage, tag, dryRun }
}

async function run() {
  const { tag, dryRun } = parseArgs(process.argv.slice(2))
  const packages = getPackageBuildOrder(readPackages())

  if (packages.length === 0) {
    console.log('No public packages found to publish.')
    return
  }

  console.log(
    `Publishing ${packages.length} package(s) with tag "${tag}"${dryRun ? ' (dry run)' : ''}:`,
  )
  packages.forEach((pkg) => console.log(`- ${pkg.name}`))

  for (const pkg of packages) {
    // eslint-disable-next-line no-await-in-loop
    publishPackage({ packagePath: pkg.path, name: pkg.name, tag, dryRun })
  }

  console.log('\nAll packages have been published successfully.')
}

run().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
