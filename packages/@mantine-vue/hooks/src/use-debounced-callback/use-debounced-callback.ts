import { onBeforeUnmount } from 'vue'

export interface UseDebouncedCallbackOptions {
  delay: number
  flushOnUnmount?: boolean
  leading?: boolean
  maxWait?: number
}

export type UseDebouncedCallbackReturnValue<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  waitOrOptions: number | UseDebouncedCallbackOptions,
): UseDebouncedCallbackReturnValue<Args> {
  const options = typeof waitOrOptions === 'number' ? { delay: waitOrOptions } : waitOrOptions
  const { delay, flushOnUnmount = false, leading = false, maxWait } = options

  let timeout: ReturnType<typeof setTimeout> | undefined
  let maxTimeout: ReturnType<typeof setTimeout> | undefined
  let lastArgs: Args | undefined
  let leadingCalled = false

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    if (maxTimeout) {
      clearTimeout(maxTimeout)
      maxTimeout = undefined
    }
  }

  const invoke = () => {
    if (!lastArgs) {
      return
    }

    callback(...lastArgs)
    lastArgs = undefined
    leadingCalled = false
    clear()
  }

  const cancel = () => {
    lastArgs = undefined
    leadingCalled = false
    clear()
  }

  onBeforeUnmount(() => {
    if (flushOnUnmount) {
      invoke()
    } else {
      cancel()
    }
  })

  const debounced = (...args: Args) => {
    lastArgs = args

    if (leading && !leadingCalled) {
      callback(...args)
      lastArgs = undefined
      leadingCalled = true
      timeout = setTimeout(() => {
        leadingCalled = false
        timeout = undefined
      }, delay)
      return
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      if (!leading || maxWait !== undefined) {
        invoke()
      } else {
        lastArgs = undefined
        leadingCalled = false
        clear()
      }
    }, delay)

    if (maxWait !== undefined && !maxTimeout) {
      maxTimeout = setTimeout(invoke, maxWait)
    }
  }

  debounced.cancel = cancel
  debounced.flush = invoke
  debounced.isPending = () => lastArgs !== undefined

  return debounced
}
