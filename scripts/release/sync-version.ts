/* oxlint-disable no-console */
import { setPackagesVersion } from './set-packages-version'

const version = process.argv[2]

if (!version) {
  console.error('Usage: tsx scripts/release/sync-version.ts <version>')
  console.error('Example: tsx scripts/release/sync-version.ts 9.3.2')
  process.exit(1)
}

setPackagesVersion(version, process.cwd())
console.log(`Package manifests set to ${version}. No build, no publish, no git commit was run.`)
console.log(
  'Review the diff, then commit/tag/push it yourself (see script comment for the exact commands).',
)
