import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Alert, MantineProvider } from '../../index'

function withProvider(
  props: Record<string, any> = {},
  children?: any,
  slots?: Record<string, any>,
) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Alert, props, slots ?? children)),
  })
}

describe('@mantine-vue/core Alert', () => {
  it('renders ARIA structure, title, icon and message', () => {
    const wrapper = withProvider(
      { id: 'test-alert', title: 'Alert title', icon: () => h('span', { id: 'icon' }, '!') },
      () => 'Alert message',
    )
    const root = wrapper.find('.mantine-Alert-root')

    expect(root.attributes('role')).toBe('alert')
    expect(root.attributes('aria-labelledby')).toBe('test-alert-title')
    expect(root.attributes('aria-describedby')).toBe('test-alert-body')
    expect(wrapper.find('#test-alert-title').text()).toBe('Alert title')
    expect(wrapper.find('#test-alert-body').text()).toBe('Alert message')
    expect(wrapper.find('#icon').exists()).toBe(true)
  })

  it('resolves variant variables and close button props', async () => {
    const onClose = vi.fn()
    const wrapper = withProvider(
      {
        id: 'close-alert',
        title: 'Closable',
        withCloseButton: true,
        closeButtonLabel: 'Close alert',
        onClose,
        color: 'red.6',
        variant: 'outline',
        radius: 'sm',
      },
      () => 'Message',
    )
    const root = wrapper.find('.mantine-Alert-root')

    expect(root.attributes('data-variant')).toBe('outline')
    expect(root.attributes('style')).toContain('--alert-radius: var(--mantine-radius-sm)')
    expect(root.attributes('style')).toContain('--alert-color: var(--mantine-color-red-6)')
    expect(root.attributes('style')).toContain(
      '--alert-bd: 0.0625rem solid var(--mantine-color-red-6)',
    )
    expect(wrapper.find('.mantine-Alert-title').attributes('data-with-close-button')).toBe('')

    await wrapper.find('button[aria-label="Close alert"]').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('supports title and icon slots', () => {
    const wrapper = withProvider({}, undefined, {
      title: () => h('span', 'Slot title'),
      icon: () => h('span', 'i'),
      default: () => 'Slot message',
    })

    expect(wrapper.find('.mantine-Alert-title').text()).toBe('Slot title')
    expect(wrapper.find('.mantine-Alert-icon').text()).toBe('i')
    expect(wrapper.find('.mantine-Alert-message').text()).toBe('Slot message')
  })
})
