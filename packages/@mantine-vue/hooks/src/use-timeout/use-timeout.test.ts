import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { useTimeout } from './use-timeout'

const defaultTimeout = 2000

function renderHook(callback: (...args: unknown[]) => void, options = { autoInvoke: false }) {
  let result!: ReturnType<typeof useTimeout>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useTimeout(callback, defaultTimeout, options)
        return () => null
      },
    }),
  )

  return { result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-timeout', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.spyOn(global, 'setTimeout')
    vi.spyOn(global, 'clearTimeout')
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('initializes timeout handlers', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback)

    expect(typeof result.start).toBe('function')
    expect(typeof result.clear).toBe('function')
  })

  it('does not fire before calling start if autoInvoke is false', () => {
    const callback = vi.fn()
    renderHook(callback, { autoInvoke: false })

    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).not.toHaveBeenCalled()
    expect(setTimeout).not.toHaveBeenCalled()
  })

  it('fires after calling start if autoInvoke is false', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback, { autoInvoke: false })

    result.start()
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalled()
    expect(setTimeout).toHaveBeenCalled()
  })

  it('fires without calling start when autoInvoke is true', () => {
    const callback = vi.fn()
    renderHook(callback, { autoInvoke: true })

    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalled()
  })

  it('clears timeout on clear', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback, { autoInvoke: false })

    result.start()
    result.clear()
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).not.toHaveBeenCalled()
    expect(clearTimeout).toHaveBeenCalled()
  })

  it('start function passes parameters to callback', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback)

    result.start('MOCK_CALLBACK_VALUE')
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledWith('MOCK_CALLBACK_VALUE')
  })
})
