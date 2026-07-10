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
})
