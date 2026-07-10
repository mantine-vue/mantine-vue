import { onBeforeUnmount } from 'vue'

export interface UseDebouncedCallbackOptions {
  delay: number
}

export type UseDebouncedCallbackReturnValue<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void
}

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
): UseDebouncedCallbackReturnValue<Args> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  onBeforeUnmount(clear)

  const debounced = (...args: Args) => {
    clear()
    timeout = setTimeout(() => callback(...args), wait)
  }

  debounced.cancel = clear
  return debounced
}
