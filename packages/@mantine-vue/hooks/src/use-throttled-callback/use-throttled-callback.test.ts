import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottledCallback } from './use-throttled-callback'

function renderHook<T extends (...args: any[]) => any>(callback: T, wait: number) {
  let result!: ReturnType<typeof useThrottledCallback<T>>
  mount(
    defineComponent({
      setup() {
        result = useThrottledCallback(callback, wait)
        return () => null
      },
    }),
  )

  return result
}

describe('@mantine-vue/hooks/use-throttled-callback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should throttle the callback', () => {
    const callback = vi.fn()
    const throttled = renderHook(callback, 100)

    throttled(1)
    throttled(2)
    vi.advanceTimersByTime(50)
    throttled(3)
    vi.advanceTimersByTime(100)

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith(3)
  })

  it('should allow callback after throttle period', () => {
    const callback = vi.fn()
    const throttled = renderHook(callback, 100)

    throttled()
    vi.advanceTimersByTime(100)
    throttled()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should call the callback with correct arguments', () => {
    const callback = vi.fn()
    const throttled = renderHook(callback, 100)

    throttled('test')
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledWith('test')
  })

  it('queues a reentrant call instead of running it immediately', () => {
    const calls: number[] = []
    const result = renderHook((value: number) => {
      calls.push(value)
      if (value === 1) {
        result(2)
      }
    }, 100)

    result(1)
    expect(calls).toEqual([1])

    vi.advanceTimersByTime(100)
    expect(calls).toEqual([1, 2])
  })

  it('stays usable after the callback throws', () => {
    const callback = vi.fn().mockImplementationOnce(() => {
      throw new Error('failure')
    })
    const result = renderHook(callback, 100)

    expect(() => result(1)).toThrow('failure')
    result(2)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
