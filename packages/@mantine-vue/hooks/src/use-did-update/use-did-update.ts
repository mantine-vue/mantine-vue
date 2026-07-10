import { onUpdated, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useDidUpdate(
  effect: () => void | (() => void),
  deps?: MaybeRefOrGetter<unknown>[],
) {
  let cleanup: void | (() => void)

  const runEffect = () => {
    cleanup?.()
    cleanup = effect()
  }

  if (!deps) {
    onUpdated(runEffect)
    return
  }

  watch(
    deps.map((dep) => () => toValue(dep)),
    runEffect,
  )
}
