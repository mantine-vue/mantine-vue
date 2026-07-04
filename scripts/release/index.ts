import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getNextVersion, type BumpType, type Stage } from './semver'
import { setPackagesVersion } from './set-packages-version'

const root = process.cwd()

function parseArgs(argv: string[]) {
  const type = (argv.find((arg) => !arg.startsWith('--')) ?? 'patch') as BumpType
  const stageIndex = argv.indexOf('--stage')
  const stage = stageIndex !== -1 ? (argv[stageIndex + 1] as Stage) : undefined
  const tagIndex = argv.indexOf('--tag')
  let tag = tagIndex !== -1 ? argv[tagIndex + 1] : 'latest'
  const dryRun = argv.includes('--dry-run')

  if (stage && tag === 'latest') {
    tag = 'next'
  }

  if (!['patch', 'minor', 'major'].includes(type)) {
    throw new Error(`Invalid release type "${type}". Expected "patch", "minor" or "major".`)
  }

  return { type, stage, tag, dryRun }
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
  }
}

function getDirtyFiles() {
  const result = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' })
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

async function release() {
  const { type, stage, tag, dryRun } = parseArgs(process.argv.slice(2))

  const dirtyFiles = getDirtyFiles()
  if (dirtyFiles.length > 0) {
    console.error('Working tree is not clean. Commit or stash changes before releasing.')
    console.error('\nDirty entries reported by `git status --porcelain`:')
    dirtyFiles.forEach((line) => console.error(`  ${line}`))
    console.error(
      '\nIf this is `.yarn/install-state.gz` (or another file under `.yarn/`) showing as' +
        ' modified: it is already listed in .gitignore but was likely committed before that' +
        ' rule existed, so git still tracks it and `yarn install` rewrites it on every run.' +
        ' Untrack it once with:\n' +
        '  git rm --cached .yarn/install-state.gz\n' +
        '  git commit -m "chore: stop tracking .yarn/install-state.gz"\n' +
        '  git push',
    )
    process.exit(1)
  }

  const rootManifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  const nextVersion = getNextVersion(rootManifest.version, { type, stage })

  console.log(`Releasing all packages`)
  console.log(`Current version: ${rootManifest.version}`)
  console.log(`New version: ${nextVersion}`)

  if (dryRun) {
    console.log('\n--dry-run: stopping before any files are written.')
    return
  }

  setPackagesVersion(nextVersion, root)
  console.log('Package manifests updated.')

  run('yarn', ['build'])
  console.log('All packages have been built successfully.')

  run('yarn', ['test:all'])
  run('yarn', ['test:exports'])
  console.log('All checks passed.')

  console.log('Publishing packages to npm...')
  const publishArgs = ['tsx', 'scripts/publish/index.ts', '--tag', tag, '--skip-build']
  run('yarn', publishArgs)
  console.log('All packages have been published successfully.')

  run('yarn', ['install', '--no-immutable'])
  run('git', ['add', 'packages', 'package.json', 'yarn.lock'])
  run('git', ['commit', '-m', `[release] Version: ${nextVersion}`])
  run('git', ['tag', `v${nextVersion}`])
  run('git', ['push'])
  run('git', ['push', '--tags'])

  console.log(`\nRelease v${nextVersion} complete. Create the GitHub release notes manually or`)
  console.log('via `gh release create` using the pushed tag.')
}

release().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
