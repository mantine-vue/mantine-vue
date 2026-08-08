import { computed } from 'vue'
import { filterProps } from '@mantine-vue/utils'
import { useSafeMantineTheme } from './MantineThemeProvider'

/**
 * Resolves a component's props against the theme.
 *
 * Precedence, lowest to highest: `defaultProps` → `theme.components[name].defaultProps`
 * → the props the consumer actually passed.
 *
 * `component` accepts several names so a component can inherit theme defaults from the
 * components it composes, with later names winning. The input family relies on this:
 * `Textarea` resolves `['Input', 'InputWrapper', 'Textarea']`, so a theme-level `Input`
 * default reaches every input unless the specific component overrides it.
 *
 * A theme's `defaultProps` may also be a function of the theme.
 */
export function useProps<Props extends Record<string, any>>(
  component: string | (string | undefined)[],
  defaultProps: Partial<Props> | null,
  props: Props,
) {
  const theme = useSafeMantineTheme()
  const resolvedProps = computed(() => {
    const names = (Array.isArray(component) ? component : [component]).filter(Boolean) as string[]
    let contextProps: Record<string, any> = {}

    for (const name of names) {
      const payload = theme.value.components[name]?.defaultProps
      const resolved = typeof payload === 'function' ? (payload as any)(theme.value) : payload

      if (resolved) {
        contextProps = { ...contextProps, ...resolved }
      }
    }

    return {
      ...defaultProps,
      ...contextProps,
      ...filterProps(props),
    } as Props
  })

  return new Proxy({} as Props, {
    get(_, key) {
      return resolvedProps.value[key as keyof Props]
    },
    has(_, key) {
      return key in resolvedProps.value
    },
    ownKeys() {
      return Reflect.ownKeys(resolvedProps.value)
    },
    getOwnPropertyDescriptor(_, key) {
      return {
        enumerable: true,
        configurable: true,
        value: resolvedProps.value[key as keyof Props],
      }
    },
  })
}
