export type BumpType = 'patch' | 'minor' | 'major'
export type Stage = 'alpha' | 'beta'

/**
 * Minimal semver increment, purpose-built for this monorepo's release flow.
 * Avoids pulling in an extra dependency (`version-next`) for a small amount of logic.
 */
export function getNextVersion(
  current: string,
  { type, stage }: { type: BumpType; stage?: Stage },
) {
  const [base, prerelease] = current.split('-')
  const [major, minor, patch] = base.split('.').map(Number)

  if (stage && prerelease) {
    const [existingStage, existingIndex] = prerelease.split('.')
    if (existingStage === stage) {
      return `${base}-${stage}.${Number(existingIndex ?? 0) + 1}`
    }
  }

  let nextBase = `${major}.${minor}.${patch}`

  switch (type) {
    case 'major':
      nextBase = `${major + 1}.0.0`
      break
    case 'minor':
      nextBase = `${major}.${minor + 1}.0`
      break
    case 'patch':
    default:
      nextBase = `${major}.${minor}.${patch + 1}`
      break
  }

  return stage ? `${nextBase}-${stage}.0` : nextBase
}
