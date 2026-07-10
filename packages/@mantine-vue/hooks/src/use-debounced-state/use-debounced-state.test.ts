import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedState } from './use-debounced-state'

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

describe('@mantine-vue/hooks/use-debounced-state', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces value with leading=false', () => {
    const { result, unmount } = renderHook(() => useDebouncedState('test1', 100))
    const [value, setValue] = result

    expect(value.value).toBe('test1')
    setValue('test2')
    expect(value.value).toBe('test1')
    setValue('test3')
    expect(value.value).toBe('test1')
    vi.advanceTimersByTime(100)
    expect(value.value).toBe('test3')
    setValue((prev) => `${prev}0`)
    vi.advanceTimersByTime(100)
    expect(value.value).toBe('test30')
    unmount()
  })

  it('debounces value with leading=true', () => {
    const { result } = renderHook(() => useDebouncedState('test1', 100, { leading: true }))
    const [value, setValue] = result

    setValue('test2')
    expect(value.value).toBe('test2')
    setValue('test3')
    expect(value.value).toBe('test2')
    vi.advanceTimersByTime(100)
    expect(value.value).toBe('test3')
  })
})
