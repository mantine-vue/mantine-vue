/**
 * Props that every Mantine component inherits and that are therefore not part
 * of an individual component's API.
 *
 *
 * Inherited props are not undocumented, they are documented once, centrally:
 * style props on the Style props page, `classNames`/`styles`/`vars`/`unstyled`
 * on the Styles API page, and `component` on the polymorphic components page.
 */

/**
 * Never shown on a component's props table, no matter which file declares them.
 *
 */
const ALWAYS_INHERITED = [
  // Styles API
  'className',
  'class',
  'classNames',
  'styles',
  'unstyled',
  'vars',
  'attributes',
  'style',
  'sx',
  // Framework internals
  'key',
  'ref',
  'renderRoot',
  // Box behaviour
  'mod',
  'hiddenFrom',
  'visibleFrom',
  'lightHidden',
  'darkHidden',
  // Margin
  'm',
  'mx',
  'my',
  'mt',
  'ml',
  'mr',
  'mb',
  'ms',
  'me',
  'mis',
  'mie',
  // Padding
  'p',
  'px',
  'py',
  'pt',
  'pl',
  'pr',
  'pb',
  'ps',
  'pe',
  'pis',
  'pie',
  // Background, color, border
  'bg',
  'bga',
  'bgp',
  'bgr',
  'bgsz',
  'bd',
  'bdrs',
  'c',
  'opacity',
  // Typography
  'ff',
  'fs',
  'fw',
  'fz',
  'lh',
  'lts',
  'ta',
  'td',
  'tt',
  // Layout and position
  'display',
  'flex',
  'pos',
  'inset',
  'top',
  'left',
  'right',
  'bottom',
  'w',
  'h',
  'maw',
  'mah',
  'miw',
  'mih',
] as const

/**
 * Inherited from `BoxProps`, but shown when the component declares its own
 * version.
 *
 */
const INHERITED_UNLESS_REDECLARED = ['component', 'variant', 'size'] as const

export const ALWAYS_INHERITED_PROPS: ReadonlySet<string> = new Set<string>(ALWAYS_INHERITED)

export const REDECLARABLE_INHERITED_PROPS: ReadonlySet<string> = new Set<string>(
  INHERITED_UNLESS_REDECLARED,
)

/**
 * Whether a prop belongs to the component itself rather than to a shared
 * interface it extends.
 *
 */
export function isComponentSpecificProp(
  component: { displayName: string },
  prop: { name: string; declaredIn?: string },
): boolean {
  if (ALWAYS_INHERITED_PROPS.has(prop.name)) {
    return false
  }

  if (!REDECLARABLE_INHERITED_PROPS.has(prop.name)) {
    return true
  }

  if (!prop.declaredIn) {
    return false
  }

  const directory = prop.declaredIn.split('/').slice(-2, -1)[0]
  return directory === component.displayName
}
