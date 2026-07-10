import { onMounted, ref, type Ref } from 'vue'
import { useWindowEvent } from '../use-window-event/use-window-event'

export interface UseHashInput {
  getInitialValueInEffect?: boolean
}

export type UseHashReturnValue = [Ref<string>, (value: string) => void]

function getInitialHash(getInitialValueInEffect: boolean): string {
  if (getInitialValueInEffect) {
    return ''
  }

  return typeof window !== 'undefined' ? window.location.hash || '' : ''
}

export function useHash(options: UseHashInput = {}): UseHashReturnValue {
  const { getInitialValueInEffect = true } = options

  const hash = ref<string>(getInitialHash(getInitialValueInEffect)) as Ref<string>

  const setHashHandler = (value: string): void => {
    const valueWithHash = value.startsWith('#') ? value : `#${value}`
    if (typeof window !== 'undefined') {
      window.location.hash = valueWithHash
    }
    hash.value = valueWithHash
  }

  useWindowEvent('hashchange', () => {
    const newHash = window.location.hash
    if (hash.value !== newHash) {
      hash.value = newHash
    }
  })

  onMounted(() => {
    if (getInitialValueInEffect) {
      hash.value = window.location.hash
    }
  })

  return [hash, setHashHandler]
}
