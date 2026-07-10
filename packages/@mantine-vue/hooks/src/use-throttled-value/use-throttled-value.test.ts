import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottledValue } from './use-throttled-value'

function renderHook<T>(initialValue: T, wait: number) {
  const source = ref(initialValue)
  let result!: ReturnType<typeof useThrottledValue<T>>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useThrottledValue(source, wait)
        return () => null
      },
    }),
  )

  return { source, result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-throttled-value', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the initial value', () => {
    const { result } = renderHook('initial', 1000)
    expect(result.value).toBe('initial')
  })

  it('should throttle the value update', async () => {
    const { source, result } = renderHook('initial', 1000)

    source.value = 'updated'
    await nextTick()
    expect(result.value).toBe('updated')
    vi.advanceTimersByTime(1000)
    source.value = 'updated-2'
    await nextTick()
    source.value = 'updated-3'
    await nextTick()
    vi.advanceTimersByTime(3000)
    expect(result.value).toBe('updated-3')
  })

  it('should clear timeout on unmount', async () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const { source, result, unmount } = renderHook('initial', 1000)

    source.value = 'updated'
    await nextTick()
    source.value = 'updated-2'
    await nextTick()
    unmount()
    vi.advanceTimersByTime(1000)
    expect(result.value).toBe('updated')
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)
  })
})
