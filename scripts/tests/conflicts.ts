import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { failIfErrors, root } from './utils'

const errors: string[] = []
const ignored = new Set(['.git', '.yarn', 'node_modules'])

function inspect(directory: string) {
  for (const name of readdirSync(directory)) {
    if (ignored.has(name)) {
      continue
    }

    const path = join(directory, name)
    if (statSync(path).isDirectory()) {
      inspect(path)
      continue
    }

    const content = readFileSync(path, 'utf8')
    if (/^(<{7}|={7}|>{7})(?: .*)?$/m.test(content)) {
      errors.push(`Unresolved merge marker in ${path}`)
    }

    if (name === 'package.json') {
      try {
        JSON.parse(content)
      } catch {
        errors.push(`Invalid JSON in ${path}`)
      }
    }
  }
}

inspect(root)
failIfErrors(errors, 'No unresolved conflicts found.')
