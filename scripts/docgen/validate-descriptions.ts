/* oxlint-disable no-console */
import fs from 'node:fs'
import { isComponentSpecificProp } from '../../apps/mantine.dev/src/components/PropsTable/inherited-props'
import { getPath } from '../utils/get-path'
import type { DocgenComponent, DocgenData } from './types'

/**
 * Fails when a public, component-specific prop has no description.
 *
 * The docs render `docgen.json`, so a prop with an empty description shows up
 * as an empty cell on the website. This check is what keeps that from
 * regressing.
 *
 * ## What counts as "component-specific"
 *
 * The same rule the docs use to decide which rows to render, imported from
 * `PropsTable/inherited-props.ts` so the check can never drift from what a
 * reader actually sees. Props inherited from shared interfaces – `BoxProps`,
 * `MantineStyleProps`, `StylesApiProps` are documented once, centrally, and
 * are not this check's business.
 *
 * Run with `yarn docgen:validate`.
 */

const DOCGEN_PATH = getPath('apps/mantine.dev/src/.docgen/docgen.json')

const args = process.argv.slice(2)
const strict = args.includes('--strict')

/**
 *  component owns a hand-written interface in
 * `<Component>/<Component>.types.ts`.
 */
function hasInterface(component: DocgenComponent) {
  return Boolean(component.declaredIn?.endsWith(`/${component.displayName}.types.ts`))
}

function main() {
  if (!fs.existsSync(DOCGEN_PATH)) {
    console.error(`docgen.json not found at ${DOCGEN_PATH}. Run \`yarn docgen\` first.`)
    process.exit(1)
  }

  const data: DocgenData = JSON.parse(fs.readFileSync(DOCGEN_PATH, 'utf8'))

  const failures: string[] = []
  const missingInterface: string[] = []
  let hasInterfaceComponents = 0
  let checkedProps = 0

  for (const component of Object.values(data).sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  )) {
    const isHasInterface = hasInterface(component)

    if (isHasInterface) {
      hasInterfaceComponents += 1
    }

    for (const prop of Object.values(component.props)) {
      // Exactly the props the docs render for this component – inherited props
      // are documented centrally, so they are not this check's business.
      if (!isComponentSpecificProp(component, prop)) {
        continue
      }

      if (isHasInterface) {
        checkedProps += 1
      }

      if (prop.description.trim().length > 0) {
        continue
      }

      const entry = `${component.displayName}.${prop.name}`

      if (isHasInterface || strict) {
        failures.push(entry)
      } else {
        missingInterface.push(entry)
      }
    }
  }

  console.log(
    `Docgen descriptions: checked ${checkedProps} component-specific props across ` +
      `${hasInterfaceComponents} components has interface.`,
  )

  if (missingInterface.length > 0) {
    console.log(`\n${missingInterface.length} undocumented `)
    console.log(
      missingInterface
        .slice(0, 20)
        .map((entry) => `- ${entry}`)
        .join('\n'),
    )
    if (missingInterface.length > 20) {
      console.log(`  ...and ${missingInterface.length - 20} more`)
    }
  }

  if (failures.length > 0) {
    console.error('\nMissing prop descriptions:')
    console.error(failures.map((entry) => `- ${entry}`).join('\n'))
    console.error(
      '\nEvery public, component-specific prop must have a JSDoc description in its ' +
        '`<Component>.types.ts` interface.',
    )
    process.exit(1)
  }

  console.log('\nAll component-specific props are documented.')
}

main()
