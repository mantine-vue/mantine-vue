import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedCallback } from './use-debounced-callback'

function renderHook<T>(hook: () => T) {
  let result!: T
  const wrapper = mount(
    defineComponent({
      setup() {
        result = hook()
        return () => null
      },
    }),
  )

  return { result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-debounced-callback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces callback with given delay', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    result()
    result()
    result()
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('calls callback with correct arguments', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    result(1)
    result(2)
    result(3)
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledWith(3)
  })

  it('can be flushed immediately and does not flush twice', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    result(1)
    result(2)
    result.flush()
    expect(callback).toHaveBeenCalledWith(2)
    callback.mockClear()
    result.flush()
    expect(callback).not.toHaveBeenCalled()
  })

  it('can flush on unmount', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, flushOnUnmount: true }),
    )

    result(1)
    result(2)
    unmount()
    expect(callback).toHaveBeenCalledWith(2)
  })

  it('does not call after unmount when flushOnUnmount is false', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, flushOnUnmount: false }),
    )

    result(1)
    unmount()
    vi.advanceTimersByTime(100)
    expect(callback).not.toHaveBeenCalled()
  })

  it('debounces callback with leading=true', () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, leading: true }),
    )

    result('a')
    expect(callback).toHaveBeenCalledWith('a')
    callback.mockClear()
    result('b')
    result('c')
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(callback).not.toHaveBeenCalled()
    result('d')
    expect(callback).toHaveBeenCalledWith('d')
  })

  it('can cancel debounced callback', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    result(1)
    result.cancel()
    vi.advanceTimersByTime(100)
    expect(callback).not.toHaveBeenCalled()
  })

  it('isPending reflects pending calls', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    expect(result.isPending()).toBe(false)
    result(1)
    expect(result.isPending()).toBe(true)
    result.flush()
    expect(result.isPending()).toBe(false)
  })

  it('maxWait fires callback after max wait time during continuous calls', () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, maxWait: 250 }),
    )

    result(1)
    vi.advanceTimersByTime(80)
    result(2)
    vi.advanceTimersByTime(80)
    result(3)
    vi.advanceTimersByTime(80)
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(10)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(3)
  })

  it('does not repeat an executed leading call on flush or unmount', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, leading: true, flushOnUnmount: true }),
    )

    result('first')
    result.flush()
    result.flush()
    unmount()
    vi.advanceTimersByTime(100)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([50, 100, 200])('does not repeat a leading call when maxWait is %s', (maxWait) => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, leading: true, maxWait }),
    )

    result('first')
    vi.advanceTimersByTime(maxWait)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(result.isPending()).toBe(false)
  })

  it('fires the trailing call at maxWait during continuous calls', () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, leading: true, maxWait: 200 }),
    )

    result(1)
    vi.advanceTimersByTime(50)
    result(2)
    vi.advanceTimersByTime(70)
    result(3)
    vi.advanceTimersByTime(70)
    result(4)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(10)
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith(4)
  })

  it('preserves the cooldown and restarts maxWait after an empty maxWait timer', () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 100, leading: true, maxWait: 50 }),
    )

    result('first')
    vi.advanceTimersByTime(60)
    result('second')
    expect(callback).toHaveBeenCalledTimes(1)
    expect(result.isPending()).toBe(true)

    vi.advanceTimersByTime(50)
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith('second')

    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('flushes the latest pending leading call only once', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, {
        delay: 100,
        leading: true,
        maxWait: 200,
        flushOnUnmount: true,
      }),
    )

    result('first')
    result('latest')
    result.flush()
    result.flush()
    unmount()
    vi.advanceTimersByTime(200)

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith('latest')
    expect(vi.getTimerCount()).toBe(0)
  })
})
