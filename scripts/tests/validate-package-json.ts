import { failIfErrors, getWorkspaceManifests } from './utils'

const errors: string[] = []

for (const { content, path } of getWorkspaceManifests()) {
  for (const field of ['name', 'version']) {
    if (!content[field]) {
      errors.push(`${path} is missing ${field}`)
    }
  }

  if (content.private) {
    continue
  }

  for (const field of ['description', 'license', 'main', 'module', 'types', 'exports']) {
    if (!content[field]) {
      errors.push(`${path} is missing ${field}`)
    }
  }

  if (content.sideEffects == null) {
    errors.push(`${path} is missing sideEffects`)
  }
}

failIfErrors(errors, 'All workspace package manifests are valid.')
