import { useMediaQuery } from '@mantine-vue/hooks'

const MOBILE_QUERY = '(max-width: 47.99em)'

/** `true` below the `sm` breakpoint (phones), where overlays become bottom sheets. */
export function useIsMobile() {
  const initial =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(MOBILE_QUERY).matches
      : true
  return useMediaQuery(MOBILE_QUERY, initial, { getInitialValueInEffect: false })
}
