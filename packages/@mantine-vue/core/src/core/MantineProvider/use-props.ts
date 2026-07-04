import { computed } from 'vue'
import { filterProps } from '@mantine-vue/utils'
import { useSafeMantineTheme } from './MantineThemeProvider'

export function useProps<Props extends Record<string, any>>(
  component: string,
  defaultProps: Partial<Props> | null,
  props: Props,
) {
  const theme = useSafeMantineTheme()
  const resolvedProps = computed(
    () =>
      ({
        ...defaultProps,
        ...theme.value.components[component]?.defaultProps,
        ...filterProps(props),
      }) as Props,
  )

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
