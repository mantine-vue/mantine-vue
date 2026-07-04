import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useLongPress } from '../index'

describe('@mantine-vue/hooks useLongPress', () => {
  it('triggers after threshold and reports finish', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const onFinish = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          const handlers = useLongPress(callback, { threshold: 100, events: ['mouse'], onFinish })
          return () => h('button', handlers)
        },
      }),
    )
    await wrapper.find('button').trigger('mousedown', { clientX: 0, clientY: 0 })
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledOnce()
    await wrapper.find('button').trigger('mouseup')
    expect(onFinish).toHaveBeenCalledOnce()
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('cancels before threshold when pointer moves beyond limit', async () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const onCancel = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          const handlers = useLongPress(callback, {
            threshold: 100,
            events: ['mouse'],
            cancelOnMove: 5,
            onCancel,
          })
          return () => h('button', handlers)
        },
      }),
    )
    await wrapper.find('button').trigger('mousedown', { clientX: 0, clientY: 0 })
    await wrapper.find('button').trigger('mousemove', { clientX: 10, clientY: 0 })
    vi.advanceTimersByTime(100)
    expect(callback).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledOnce()
    wrapper.unmount()
    vi.useRealTimers()
  })
})
