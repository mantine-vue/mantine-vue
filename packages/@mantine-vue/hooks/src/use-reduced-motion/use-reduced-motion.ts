import type { Ref } from 'vue'
import { useMediaQuery, type UseMediaQueryOptions } from '../use-media-query/use-media-query'

export function useReducedMotion(
  initialValue?: boolean,
  options?: UseMediaQueryOptions,
): Readonly<Ref<boolean>> {
  return useMediaQuery('(prefers-reduced-motion: reduce)', initialValue, options)
}
