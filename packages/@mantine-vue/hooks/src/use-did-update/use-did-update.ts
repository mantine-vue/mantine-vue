import { toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useDidUpdate(effect: () => void, deps: MaybeRefOrGetter<unknown>[]) {
  let mounted = false

  watch(
    deps.map((dep) => () => toValue(dep)),
    () => {
      if (mounted) {
        effect()
      }
      mounted = true
    },
  )
}
