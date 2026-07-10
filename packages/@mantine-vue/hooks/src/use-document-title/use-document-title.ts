import { toValue, watch, type MaybeRefOrGetter } from 'vue'
import { useIsomorphicEffect } from '../use-isomorphic-effect/use-isomorphic-effect'

export function useDocumentTitle(title: MaybeRefOrGetter<string>) {
  useIsomorphicEffect(() => {
    watch(
      () => toValue(title),
      (value) => {
        document.title = value
      },
      { immediate: true },
    )
  })
}
