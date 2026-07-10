import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './use-debounced-value'

function renderDebouncedValue<T>(initialValue: T, wait: number, options?: { leading?: boolean }) {
  const source = ref(initialValue)
  let result!: ReturnType<typeof useDebouncedValue<T>>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useDebouncedValue(source, wait, options)
        return () => null
      },
    }),
  )

  return { source, result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-debounced-value', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderDebouncedValue('initial', 200)
    expect(result[0].value).toBe('initial')
  })

  it('debounces value updates by wait milliseconds', async () => {
    const { source, result } = renderDebouncedValue('a', 200)

    source.value = 'b'
    await nextTick()
    expect(result[0].value).toBe('a')
    vi.advanceTimersByTime(200)
    expect(result[0].value).toBe('b')
  })

  it('only applies the last value when updated rapidly', async () => {
    const { source, result } = renderDebouncedValue('a', 200)

    source.value = 'b'
    await nextTick()
    source.value = 'c'
    await nextTick()
    source.value = 'd'
    await nextTick()
    expect(result[0].value).toBe('a')
    vi.advanceTimersByTime(200)
    expect(result[0].value).toBe('d')
  })

  it('cancel prevents the pending update', async () => {
    const { source, result } = renderDebouncedValue('a', 200)

    source.value = 'b'
    await nextTick()
    result[1]()
    vi.advanceTimersByTime(200)
    expect(result[0].value).toBe('a')
  })

  it('supports leading updates', async () => {
    const { source, result } = renderDebouncedValue('a', 200, { leading: true })

    source.value = 'b'
    await nextTick()
    expect(result[0].value).toBe('b')
    source.value = 'c'
    await nextTick()
    expect(result[0].value).toBe('b')
    vi.advanceTimersByTime(200)
    expect(result[0].value).toBe('c')
  })
})
