import { onMounted } from 'vue'

export function useIsomorphicEffect(effect: () => void) {
  if (typeof window === 'undefined') {
    return
  }

  onMounted(effect)
}
