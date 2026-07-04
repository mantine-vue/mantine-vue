import { spawnSync } from 'node:child_process'

export interface PublishPackageOptions {
  packagePath: string
  name: string
  tag: string
  dryRun?: boolean
}

export function publishPackage({ packagePath, name, tag, dryRun }: PublishPackageOptions) {
  const args = ['publish', '--access', 'public', '--tag', tag]

  if (dryRun) {
    args.push('--dry-run')
  }

  const result = spawnSync('npm', args, {
    cwd: packagePath,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    throw new Error(`Failed to publish package ${name}`)
  }

  console.log(`Package ${name} has been published${dryRun ? ' (dry run)' : ''}.`)
}
