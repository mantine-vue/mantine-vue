import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { ActionBar, ActionBarCloseButton, ActionBarDivider, MantineProvider } from '../../index'

function renderActionBar(props: Record<string, unknown> = {}) {
  return mount(MantineProvider, {
    props: { env: 'test' },
    slots: {
      default: () =>
        h(ActionBar, { opened: true, withinPortal: false, ...props }, () => [
          h('span', 'Selected items'),
          h(ActionBarDivider),
          h(ActionBarCloseButton),
        ]),
    },
  })
}

describe('@mantine-vue/core ActionBar', () => {
  it('exposes compound components and renders accessible content', () => {
    const wrapper = renderActionBar()

    expect(ActionBar.Divider).toBe(ActionBarDivider)
    expect(ActionBar.CloseButton).toBe(ActionBarCloseButton)
    expect(wrapper.get('[role="group"]').text()).toContain('Selected items')
    expect(wrapper.find('.mantine-ActionBar-divider').exists()).toBe(true)
  })

  it('emits close from the close button and Escape when enabled', async () => {
    const onClose = vi.fn()
    const wrapper = renderActionBar({ closeOnEscape: true, onClose })

    await wrapper.get('button').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
