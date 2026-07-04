import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Notification } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(Notification, { title: 'Title', icon: 'I', ...props }, () => 'Description'),
      ),
  })
}

describe('@mantine-vue/core Notification', () => {
  it('renders title, description, icon, and close button', () => {
    const wrapper = withProvider({ color: 'red', withBorder: true })
    const root = wrapper.find('.mantine-Notification-root')

    expect(root.attributes('role')).toBe('alert')
    expect(root.attributes('data-with-icon')).toBe('true')
    expect(root.attributes('data-with-border')).toBe('true')
    expect(root.attributes('style')).toContain(
      '--notification-color: var(--mantine-color-red-filled)',
    )
    expect(wrapper.find('.mantine-Notification-icon').text()).toBe('I')
    expect(wrapper.find('.mantine-Notification-title').text()).toBe('Title')
    expect(wrapper.find('.mantine-Notification-description').text()).toBe('Description')
    expect(wrapper.find('.mantine-Notification-closeButton').exists()).toBe(true)
  })

  it('renders loader instead of icon when loading', () => {
    const wrapper = withProvider({ loading: true, icon: 'I' })

    expect(wrapper.find('.mantine-Notification-loader').exists()).toBe(true)
    expect(wrapper.find('.mantine-Notification-icon').exists()).toBe(false)
  })

  it('hides close button and calls onClose when shown', async () => {
    const hidden = withProvider({ withCloseButton: false })
    expect(hidden.find('.mantine-Notification-closeButton').exists()).toBe(false)

    const onClose = vi.fn()
    const wrapper = withProvider({ onClose })
    await wrapper.find('.mantine-Notification-closeButton').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
