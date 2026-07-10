import { onBeforeUnmount } from 'vue'

export interface UseTimeoutOptions {
  autoInvoke?: boolean
}

export interface UseTimeoutReturnValue {
  start: (...callbackParams: unknown[]) => void
  clear: () => void
}

export function useTimeout(
  callback: (...callbackParams: unknown[]) => void,
  delay: number,
  options: UseTimeoutOptions = { autoInvoke: false },
): UseTimeoutReturnValue {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const start = (...callbackParams: unknown[]) => {
    clear()
    timeout = setTimeout(() => callback(...callbackParams), delay)
  }

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  if (options.autoInvoke) {
    start()
  }

  onBeforeUnmount(clear)
  return { start, clear }
}
