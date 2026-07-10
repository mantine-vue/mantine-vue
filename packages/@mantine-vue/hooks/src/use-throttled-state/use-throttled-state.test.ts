import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottledState } from './use-throttled-state'

function renderHook<T>(defaultValue: T, wait: number) {
  let result!: ReturnType<typeof useThrottledState<T>>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useThrottledState(defaultValue, wait)
        return () => null
      },
    }),
  )

  return { result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-throttled-state', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should update value with throttling', () => {
    const { result } = renderHook(0, 100)
    const [value, setValue] = result

    setValue(1)
    setValue(2)
    setValue(3)
    expect(value.value).toBe(1)
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(3)
    vi.advanceTimersByTime(100)
    setValue(4)
    expect(value.value).toBe(4)
  })

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const { result, unmount } = renderHook(0, 100)
    const [value, setValue] = result

    setValue(1)
    setValue(2)
    unmount()
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(1)
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)
  })
})
