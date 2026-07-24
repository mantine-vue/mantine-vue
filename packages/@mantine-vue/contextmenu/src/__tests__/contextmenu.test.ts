import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { DirectionProvider, MantineProvider } from '@mantine-vue/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContextMenuProvider, useContextMenu } from '../ContextMenuProvider'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function mountContextMenu(options: {
  items?: Parameters<ReturnType<typeof useContextMenu>['showContextMenu']>[0]
  providerProps?: Record<string, unknown>
  direction?: 'ltr' | 'rtl'
}) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 })

  const onClick = vi.fn()
  const items =
    options.items ??
    ([
      { key: 'copyToClipboard', onClick },
      { key: 'divider' },
      { key: 'hidden', hidden: true },
    ] as const)

  const Trigger = defineComponent({
    setup() {
      const contextMenu = useContextMenu()

      return () =>
        h(
          'button',
          {
            id: 'trigger',
            onContextmenu: contextMenu.showContextMenu(items as any, {
              className: 'custom-menu',
              classNames: {
                root: 'custom-root',
                item: 'custom-item',
                divider: 'custom-divider',
              },
            }),
          },
          'Open',
        )
    },
  })

  const App = defineComponent({
    setup() {
      return () =>
        h(MantineProvider, null, () =>
          h(DirectionProvider, { initialDirection: options.direction }, () =>
            h(ContextMenuProvider, options.providerProps, () => h(Trigger)),
          ),
        )
    },
  })

  const wrapper = mount(App, {
    attachTo: document.body,
  })

  return { wrapper, onClick }
}

describe('@mantine-vue/contextmenu', () => {
  it('opens at the triggering event and renders items, dividers, and custom classes', async () => {
    const { wrapper } = mountContextMenu({})
    await wrapper.get('#trigger').trigger('contextmenu', { clientX: 24, clientY: 36 })
    await nextTick()
    await nextTick()

    const menu = document.querySelector<HTMLElement>('.mantine-contextmenu')
    expect(menu).not.toBeNull()
    expect(menu?.classList).toContain('custom-menu')
    expect(menu?.classList).toContain('custom-root')
    expect(menu?.style.left).toBe('24px')
    expect(menu?.style.top).toBe('36px')

    const item = document.querySelector<HTMLElement>('.mantine-contextmenu-item-button')
    expect(item?.textContent).toContain('Copy to clipboard')
    expect(item?.classList).toContain('custom-item')
    expect(document.querySelector('.custom-divider')).not.toBeNull()
    expect(document.body.textContent).not.toContain('Hidden')
  })

  it('closes before invoking an item action', async () => {
    const order: string[] = []
    const action = vi.fn(() => {
      order.push(document.querySelector('.mantine-contextmenu') ? 'open' : 'closed')
    })
    const { wrapper } = mountContextMenu({
      items: [{ key: 'action', onClick: action }],
    })

    await wrapper.get('#trigger').trigger('contextmenu')
    await nextTick()
    document
      .querySelector<HTMLElement>('.mantine-contextmenu-item-button')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(action).toHaveBeenCalledOnce()
    expect(order).toEqual(['open'])
    expect(document.querySelector('.mantine-contextmenu')).toBeNull()
  })

  it('dismisses on overlay click, repeat contextmenu, resize, and Escape', async () => {
    const { wrapper } = mountContextMenu({})
    const open = async () => {
      await wrapper.get('#trigger').trigger('contextmenu')
      await nextTick()
      expect(document.querySelector('.mantine-contextmenu')).not.toBeNull()
    }

    await open()
    document
      .querySelector<HTMLElement>('.mantine-contextmenu-overlay')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('.mantine-contextmenu')).toBeNull()

    await open()
    document
      .querySelector<HTMLElement>('.mantine-contextmenu-overlay')
      ?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('.mantine-contextmenu')).toBeNull()

    await open()
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(document.querySelector('.mantine-contextmenu')).toBeNull()

    await open()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.querySelector('.mantine-contextmenu')).toBeNull()
  })

  it('propagates RTL direction and reverses the default submenu indicator', async () => {
    const { wrapper } = mountContextMenu({
      direction: 'rtl',
      items: [
        {
          key: 'share',
          items: [{ key: 'email', onClick: () => {} }],
        },
      ],
    })

    await wrapper.get('#trigger').trigger('contextmenu', { clientX: 240, clientY: 80 })
    await nextTick()

    const menu = document.querySelector<HTMLElement>('.mantine-contextmenu')
    const item = document.querySelector<HTMLElement>('.mantine-contextmenu-item-button')

    expect(menu?.dir).toBe('rtl')
    expect(item?.dir).toBe('rtl')
    expect(item?.textContent).toContain('‹')
    expect(item?.textContent).not.toContain('›')
  })
})
