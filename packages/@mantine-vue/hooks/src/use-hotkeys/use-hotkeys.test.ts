import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useHotkeys } from './use-hotkeys'

describe('@mantine-vue/hooks/use-hotkeys', () => {
  it('handles hotkeys and ignores inputs by default', async () => {
    const handler = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup() {
          useHotkeys([['mod + K', handler]])
          return () => h('input')
        },
      }),
      { attachTo: document.body },
    )

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(handler).toHaveBeenCalledTimes(1)

    await wrapper.find('input').trigger('keydown', { key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
