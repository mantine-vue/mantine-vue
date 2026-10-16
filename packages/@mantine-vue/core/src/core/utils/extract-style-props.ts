import { filterProps } from '@mantine-vue/utils'
import { STYLE_PROPS_DATA, type MantineStyleProps } from '../Box/style-props'

/** `Box` props that are not part of `MantineStyleProps` but follow the same routing rules. */
const EXTRA_STYLE_PROP_KEYS = ['hiddenFrom', 'visibleFrom', 'lightHidden', 'darkHidden'] as const

const STYLE_PROP_KEYS: readonly string[] = [
  ...Object.keys(STYLE_PROPS_DATA),
  ...EXTRA_STYLE_PROP_KEYS,
]

/**
 * Splits `attrs` into style props (`mt`, `ml`, `bg`, ...) and the rest. Use this before
 * forwarding fallthrough attrs to an inner element, so style props reach the component's
 * root instead of landing on the inner element they were never meant for.
 *
 * @example
 * const { styleProps, rest } = extractStyleProps(attrs)
 * // styleProps go on the root, rest (minus handlers) goes on the inner <input>
 */
export function extractStyleProps<T extends Record<string, unknown>>(
  attrs: MantineStyleProps & T,
): { styleProps: MantineStyleProps; rest: T } {
  const styleProps: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}

  for (const key of Object.keys(attrs)) {
    if (STYLE_PROP_KEYS.includes(key)) {
      styleProps[key] = attrs[key]
    } else {
      rest[key] = attrs[key]
    }
  }

  return { styleProps: filterProps(styleProps), rest: rest as T }
}
