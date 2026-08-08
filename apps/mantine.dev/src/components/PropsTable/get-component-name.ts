const SPECIAL_PREFIXES = [{ prefix: 'MenuSub', replace: 'Menu.Sub.' }]

interface GetComponentNameInput {
  component: string
  componentPrefix: string | undefined
}

/**
 * Formats a docgen component key for display. Compound components are shown
 * with dot notation `ButtonGroup` with a `Button` prefix becomes
 * `Button.Group`.
 */
export function getComponentName({ component, componentPrefix }: GetComponentNameInput) {
  const special = SPECIAL_PREFIXES.find(
    (item) => component.startsWith(item.prefix) && component !== item.prefix,
  )

  if (special) {
    return component.replace(special.prefix, special.replace)
  }

  if (!componentPrefix || componentPrefix === component) {
    return component
  }

  return `${componentPrefix}.${component.replace(componentPrefix, '')}`
}
