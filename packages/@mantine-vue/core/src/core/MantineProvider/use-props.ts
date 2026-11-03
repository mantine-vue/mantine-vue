import { computed } from 'vue'
import { useSafeMantineTheme } from './MantineThemeProvider'

const EMPTY_PROPS: Record<string, any> = Object.freeze({})
const hasOwn = (target: object, key: PropertyKey): boolean => Object.hasOwn(target, key)

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
  const names = (Array.isArray(component) ? component : [component]).filter(Boolean) as string[]
  const defaults: Record<string, any> = defaultProps ?? EMPTY_PROPS
  const contextProps = computed(() => {
    let resolvedContextProps: Record<string, any> | undefined

    for (const name of names) {
      const payload = theme.value.components[name]?.defaultProps
      const resolved = typeof payload === 'function' ? (payload as any)(theme.value) : payload

      if (resolved) {
        resolvedContextProps = { ...resolvedContextProps, ...resolved }
      }
    }

    return resolvedContextProps ?? EMPTY_PROPS
  })

  const get = (key: string) => {
    const value = props[key]

    if (value !== undefined) {
      return value
    }

    const context = contextProps.value
    return hasOwn(context, key) ? context[key] : defaults[key]
  }

  const has = (key: string) =>
    props[key] !== undefined || hasOwn(contextProps.value, key) || hasOwn(defaults, key)

  // Vue reads internal flags (`__v_isRef`, `__v_skip`, ...) and symbols off arbitrary
  // objects; they must not be forwarded to the reactive props object.
  const isPropKey = (key: PropertyKey): key is string =>
    typeof key === 'string' && !key.startsWith('__v_')

  return new Proxy({} as Props, {
    get(_, key) {
      return isPropKey(key) ? get(key) : undefined
    },
    has(_, key) {
      return isPropKey(key) && has(key)
    },
    ownKeys() {
      const keys = new Set([...Object.keys(defaults), ...Object.keys(contextProps.value)])
      Object.keys(props).forEach((key) => {
        if (props[key] !== undefined) {
          keys.add(key)
        }
      })
      return [...keys]
    },
    getOwnPropertyDescriptor(_, key) {
      if (!isPropKey(key) || !has(key)) {
        return undefined
      }

      return { enumerable: true, configurable: true, value: get(key) }
    },
  })
}
