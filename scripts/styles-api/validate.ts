/* oxlint-disable no-console */
import * as stylesData from '../../packages/@docs/styles-api/src/index'
import type { StylesApiData } from '../../packages/@docs/styles-api/src/types'
import { getComponentSourceData, getDocumentedStylesComponents } from './source-data'

const records = stylesData as unknown as Record<string, StylesApiData<string>>
const errors: string[] = []
const documentedComponents = getDocumentedStylesComponents()

function compare(
  component: string,
  label: string,
  actual: Iterable<string>,
  documented: Iterable<string>,
  exact = false,
) {
  const actualSet = new Set(actual)
  const documentedSet = new Set(documented)
  const missing = [...actualSet].filter((item) => !documentedSet.has(item))
  const stale = exact ? [...documentedSet].filter((item) => !actualSet.has(item)) : []

  if (missing.length > 0) {
    errors.push(`${component}: undocumented ${label}: ${missing.join(', ')}`)
  }

  if (stale.length > 0) {
    errors.push(`${component}: documented ${label} not found in source: ${stale.join(', ')}`)
  }
}

for (const component of documentedComponents) {
  const record = records[`${component}StylesApi`]

  if (!record) {
    errors.push(`${component}: Styles API tab is declared but no data record is exported`)
    continue
  }

  const source = getComponentSourceData(component)
  const selectorNames = Object.keys(record.selectors)
  const variableNames = Object.values(record.vars).flatMap((variables) =>
    Object.keys(variables ?? {}),
  )

  if (selectorNames.length === 0) {
    errors.push(`${component}: Styles API record does not contain selectors`)
  }

  compare(component, 'selectors', source.selectors, selectorNames, source.selectorsAreComplete)
  compare(component, 'CSS variables', source.vars, variableNames, source.varsAreComplete)

  for (const modifier of record.modifiers ?? []) {
    const selectors = Array.isArray(modifier.selector) ? modifier.selector : [modifier.selector]
    const invalid = selectors.filter((selector) => !selectorNames.includes(selector))

    if (invalid.length > 0) {
      errors.push(
        `${component}: ${modifier.modifier} references unknown selectors: ${invalid.join(', ')}`,
      )
    }
  }

  compare(
    component,
    'data attributes',
    source.modifiers.map((modifier) => modifier.modifier),
    (record.modifiers ?? []).map((modifier) => modifier.modifier),
  )
}

console.log(`Checked Styles API coverage for ${documentedComponents.length} components.`)

if (errors.length > 0) {
  errors.forEach((error) => console.error(`error: ${error}`))
  console.error(`\n${errors.length} Styles API data problem(s) found.`)
  process.exit(1)
}

console.log('Styles API data covers all documentation tabs and matches component sources.')
