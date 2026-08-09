import { computed, getCurrentInstance, type ComputedRef } from 'vue'

function kebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Forwards only props that were actually supplied by the consumer. This is important for
 * adapter components because Vue casts absent Boolean props to `false`, which must not shadow
 * defaults owned by the implementation component.
 */
export function useForwardedProps<Props extends object>(props: Props): ComputedRef<Props> {
  const instance = getCurrentInstance()

  return computed(() => {
    const rawProps = instance?.vnode.props ?? {}
    const result: Partial<Props> = {}

    for (const key of Object.keys(props) as Array<keyof Props & string>) {
      if (key in rawProps || kebabCase(key) in rawProps) {
        result[key] = props[key]
      }
    }

    return result as Props
  })
}
