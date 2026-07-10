import { mount } from '@vue/test-utils'
import { defineComponent, shallowRef } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { usePageLeave } from './use-page-leave'

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

describe('@mantine-vue/hooks/use-page-leave', () => {
  it('calls onPageLeave when mouseleave fires on documentElement', () => {
    const handler = vi.fn()
    renderHook(() => usePageLeave(handler))

    document.documentElement.dispatchEvent(new MouseEvent('mouseleave'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('calls the latest onPageLeave after callback changes', () => {
    const first = vi.fn()
    const second = vi.fn()
    const callback = shallowRef(first)
    renderHook(() => usePageLeave(callback))

    callback.value = second
    document.documentElement.dispatchEvent(new MouseEvent('mouseleave'))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('removes the listener on unmount', () => {
    const handler = vi.fn()
    const wrapper = renderHook(() => usePageLeave(handler))

    wrapper.unmount()
    document.documentElement.dispatchEvent(new MouseEvent('mouseleave'))
    expect(handler).not.toHaveBeenCalled()
  })
})
