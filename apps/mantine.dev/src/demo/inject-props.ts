// Replaces the `{{props}}` placeholder in a code template with a string of
// attributes derived from the current configurator state.
export function injectProps(props: Record<string, unknown>, code: string): string {
  const propStrings: string[] = []

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') {
      continue
    }
    if (typeof value === 'string') {
      propStrings.push(`${key}="${value}"`)
    } else if (typeof value === 'number') {
      propStrings.push(`${key}={${value}}`)
    } else if (typeof value === 'boolean') {
      propStrings.push(value ? key : `${key}={false}`)
    }
  }

  const joined = propStrings.join(' ')
  return joined.length > 0
    ? code.replace(/\{\{props\}\}/g, ` ${joined}`)
    : code.replace(/\{\{props\}\}/g, '')
}
