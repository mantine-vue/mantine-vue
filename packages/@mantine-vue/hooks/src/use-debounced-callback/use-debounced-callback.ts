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

  const cancel = () => {
    lastArgs = undefined
    leadingCalled = false
    clear()
  }

  const invoke = () => {
    if (!lastArgs) {
      return
    }

    const args = lastArgs
    cancel()
    callback(...args)
  }

  const flush = () => {
    if (lastArgs) {
      invoke()
    } else {
      cancel()
    }
  }

  const startMaxWaitTimer = () => {
    if (maxWait !== undefined && !maxTimeout) {
      maxTimeout = setTimeout(() => {
        maxTimeout = undefined
        invoke()
      }, maxWait)
    }
  }

  onBeforeUnmount(() => {
    if (flushOnUnmount) {
      flush()
    } else {
      cancel()
    }
  })

  const debounced = (...args: Args) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (leading && !leadingCalled) {
      leadingCalled = true
      callback(...args)
      timeout = setTimeout(cancel, delay)
      startMaxWaitTimer()
      return
    }

    lastArgs = args
    timeout = setTimeout(leading ? cancel : invoke, delay)
    startMaxWaitTimer()
  }

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.isPending = () => lastArgs !== undefined

  return debounced
}
