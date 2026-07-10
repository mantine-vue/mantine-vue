import { onBeforeUnmount } from 'vue'

export function useThrottledCallbackWithClearTimeout<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
): [(...args: Parameters<T>) => void, () => void] {
  let latestInArgs: Parameters<T> | null = null
  let latestOutArgs: Parameters<T> | null = null
  let active = true
  let timeoutId = -1

  const clear = () => window.clearTimeout(timeoutId)

  const callThrottledCallback = (...args: Parameters<T>) => {
    callback(...args)
    latestInArgs = args
    latestOutArgs = args
    active = false
  }

  const timerCallback = () => {
    if (latestInArgs && latestInArgs !== latestOutArgs) {
      callThrottledCallback(...latestInArgs)

      timeoutId = window.setTimeout(timerCallback, wait)
    } else {
      active = true
    }
  }

  const throttled = (...args: Parameters<T>) => {
    if (active) {
      callThrottledCallback(...args)
      timeoutId = window.setTimeout(timerCallback, wait)
    } else {
      latestInArgs = args
    }
  }

  return [throttled, clear]
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
): (...args: Parameters<T>) => void {
  const [throttled, clear] = useThrottledCallbackWithClearTimeout(callback, wait)
  onBeforeUnmount(clear)
  return throttled
}
