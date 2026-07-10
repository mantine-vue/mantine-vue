/* oxlint-disable no-console */
import { spawnSync } from 'node:child_process'
import { commandInvocation } from '../utils/commands'

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

  const command = commandInvocation('npm', args)
  const result = spawnSync(command.command, command.args, {
    cwd: packagePath,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    throw new Error(`Failed to publish package ${name}`)
  }

  console.log(`Package ${name} has been published${dryRun ? ' (dry run)' : ''}.`)
}
