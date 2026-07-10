import { computed, type Ref } from 'vue'
import { useMediaQuery, type UseMediaQueryOptions } from '../use-media-query/use-media-query'

export type UseColorSchemeValue = 'dark' | 'light'

export function useColorScheme(
  initialValue?: UseColorSchemeValue,
  options?: UseMediaQueryOptions,
): Readonly<Ref<UseColorSchemeValue>> {
  const prefersDark = useMediaQuery(
    '(prefers-color-scheme: dark)',
    initialValue === 'dark',
    options,
  )

  return computed(() => (prefersDark.value ? 'dark' : 'light')) as Readonly<
    Ref<UseColorSchemeValue>
  >
}
