import { spawnSync } from 'node:child_process'
import { getPackageBuildOrder, readPackages } from '../build/read-packages'
import { commandInvocation } from '../utils/commands'
import { publishPackage } from './publish-package'

function parseArgs(argv: string[]) {
  const stageIndex = argv.indexOf('--stage')
  const tagIndex = argv.indexOf('--tag')
  const stage = stageIndex !== -1 ? argv[stageIndex + 1] : undefined
  let tag = tagIndex !== -1 ? argv[tagIndex + 1] : 'latest'
  const dryRun = argv.includes('--dry-run')
  const skipBuild = argv.includes('--skip-build')

  if (stage && (!tagIndex || tag === 'latest')) {
    tag = 'next'
  }

  if (stage && !['alpha', 'beta'].includes(stage)) {
    throw new Error(`Invalid --stage "${stage}". Expected "alpha" or "beta".`)
  }

  return { stage, tag, dryRun, skipBuild }
}

function runCommand(command: string, args: string[], description: string) {
  const invocation = commandInvocation(command, args)
  const result = spawnSync(invocation.command, invocation.args, {
    cwd: process.cwd(),
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    throw new Error(`${description} failed`)
  }
}

async function run() {
  const { tag, dryRun, skipBuild } = parseArgs(process.argv.slice(2))
  const packages = getPackageBuildOrder(readPackages())

  if (packages.length === 0) {
    console.log('No public packages found to publish.')
    return
  }

  console.log(
    `Publishing ${packages.length} package(s) with tag "${tag}"${dryRun ? ' (dry run)' : ''}:`,
  )
  packages.forEach((pkg) => console.log(`- ${pkg.name}`))

  if (!skipBuild) {
    console.log('\nBuilding packages before publish...')
    runCommand('corepack', ['yarn', 'build'], 'Package build')
  }

  console.log('\nValidating npm package contents...')
  runCommand('corepack', ['yarn', 'test:pack'], 'Package contents validation')

  for (const pkg of packages) {
    publishPackage({ packagePath: pkg.path, name: pkg.name, tag, dryRun })
  }

  console.log('\nAll packages have been published successfully.')
}

run().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
