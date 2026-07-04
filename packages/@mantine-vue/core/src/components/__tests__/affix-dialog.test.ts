import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Affix, Dialog, MantineProvider } from '../../index'

describe('@mantine-vue/core Affix', () => {
  it('renders fixed position variables without portal in test env', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Affix,
            { position: { top: 'md', left: 12 }, zIndex: 123, withinPortal: false },
            () => 'Affixed',
          ),
        ),
    })
    const root = wrapper.find('.mantine-Affix-root')

    expect(root.text()).toBe('Affixed')
    expect(root.attributes('style')).toContain('--affix-z-index: 123')
    expect(root.attributes('style')).toContain('--affix-top: var(--mantine-spacing-md)')
    expect(root.attributes('style')).toContain('--affix-left: 0.75rem')
  })
})

describe('@mantine-vue/core Dialog', () => {
  it('renders opened dialog content and close button', async () => {
    const onClose = vi.fn()
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Dialog,
            {
              opened: true,
              withinPortal: false,
              withCloseButton: true,
              onClose,
              size: 'lg',
              transitionProps: { duration: 0 },
            },
            () => 'Dialog content',
          ),
        ),
      global: { stubs: { Transition: false } },
    })

    const root = wrapper.find('.mantine-Dialog-root')
    expect(root.text()).toContain('Dialog content')
    expect(root.attributes('style')).toContain('--dialog-size: var(--dialog-size-lg)')

    await wrapper.find('.mantine-Dialog-closeButton').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render dialog content when closed without keepMounted', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Dialog,
            { opened: false, withinPortal: false, transitionProps: { duration: 0 } },
            () => 'Hidden',
          ),
        ),
      global: { stubs: { Transition: false } },
    })

    expect(wrapper.text()).not.toContain('Hidden')
  })
})
