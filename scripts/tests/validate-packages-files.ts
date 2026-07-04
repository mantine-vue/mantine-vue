import { join } from 'node:path'
import { existsSync, failIfErrors, getWorkspaceManifests } from './utils'

const errors: string[] = []

for (const manifest of getWorkspaceManifests().filter(({ content }) => !content.private)) {
  const entry = join(manifest.directory, 'src', 'index.ts')
  if (!existsSync(entry)) {
    errors.push(`${manifest.content.name} is missing src/index.ts`)
  }
}

failIfErrors(errors, 'All publishable packages contain their source entry file.')
