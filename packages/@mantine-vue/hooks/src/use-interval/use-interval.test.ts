import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { useInterval } from './use-interval'

const defaultTimeout = 2000

function renderHook(callback: () => void, timeout = defaultTimeout) {
  let result!: ReturnType<typeof useInterval>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useInterval(callback, timeout)
        return () => null
      },
    }),
  )

  return { result, unmount: () => wrapper.unmount() }
}

describe('@mantine-vue/hooks/use-interval', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'setInterval')
    vi.spyOn(window, 'clearInterval')
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('initializes interval handlers', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback)

    expect(result.active.value).toBe(false)
    expect(typeof result.start).toBe('function')
    expect(typeof result.stop).toBe('function')
    expect(typeof result.toggle).toBe('function')
  })

  it('runs after timeout exceeded', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback)

    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).not.toHaveBeenCalled()
    result.start()
    expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), defaultTimeout)
    expect(result.active.value).toBe(true)

    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('stops after stop is called', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback)

    result.start()
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledTimes(1)
    result.stop()
    expect(window.clearInterval).toHaveBeenCalled()
    expect(result.active.value).toBe(false)
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('toggles between active states', () => {
    const callback = vi.fn()
    const { result } = renderHook(callback)

    result.toggle()
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(result.active.value).toBe(true)
    result.toggle()
    expect(result.active.value).toBe(false)
    vi.advanceTimersByTime(defaultTimeout)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
