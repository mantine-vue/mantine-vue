import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, shallowRef } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWindowEvent } from './use-window-event'

function renderHook(hook: () => void) {
  return mount(
    defineComponent({
      setup() {
        hook()
        return () => null
      },
    }),
  )
}

describe('@mantine-vue/hooks/use-window-event', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls listener when the event fires', () => {
    const handler = vi.fn()
    renderHook(() => useWindowEvent('click', handler))

    window.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('calls the latest listener after callback changes', () => {
    const first = vi.fn()
    const second = vi.fn()
    const callback = shallowRef(first)

    renderHook(() => useWindowEvent('click', callback))
    callback.value = second
    window.dispatchEvent(new MouseEvent('click'))

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('does not re-register the listener when callback changes identity', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const callback = shallowRef(() => 1)

    renderHook(() => useWindowEvent('click', callback))
    const initialAddCalls = addSpy.mock.calls.filter(([type]) => type === 'click').length
    const initialRemoveCalls = removeSpy.mock.calls.filter(([type]) => type === 'click').length

    callback.value = () => 2
    callback.value = () => 3

    expect(addSpy.mock.calls.filter(([type]) => type === 'click').length).toBe(initialAddCalls)
    expect(removeSpy.mock.calls.filter(([type]) => type === 'click').length).toBe(
      initialRemoveCalls,
    )
  })

  it('re-registers when event type changes', async () => {
    const handler = vi.fn()
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const type = ref<keyof WindowEventMap>('click')

    renderHook(() => useWindowEvent(type, handler))
    expect(addSpy.mock.calls.filter(([eventType]) => eventType === 'click')).toHaveLength(1)
    type.value = 'keydown'
    await nextTick()
    expect(removeSpy.mock.calls.filter(([eventType]) => eventType === 'click')).toHaveLength(1)
    expect(addSpy.mock.calls.filter(([eventType]) => eventType === 'keydown')).toHaveLength(1)
  })

  it('removes the listener on unmount', () => {
    const handler = vi.fn()
    const wrapper = renderHook(() => useWindowEvent('click', handler))

    wrapper.unmount()
    window.dispatchEvent(new MouseEvent('click'))
    expect(handler).not.toHaveBeenCalled()
  })
})
