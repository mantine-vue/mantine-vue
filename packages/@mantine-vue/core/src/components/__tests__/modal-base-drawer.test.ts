import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerRoot,
  DrawerTitle,
  MantineProvider,
  ModalBase,
  ModalBaseBody,
  ModalBaseCloseButton,
  ModalBaseContent,
  ModalBaseHeader,
  ModalBaseOverlay,
  ModalBaseTitle,
} from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function render(component: () => any) {
  const wrapper = mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, component),
    },
    { attachTo: document.body, global: { stubs: { Transition: false, transition: false } } },
  )
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('@mantine-vue/core ModalBase', () => {
  it('connects dialog title and body with stable accessible ids', async () => {
    const wrapper = render(() =>
      h(
        ModalBase,
        { id: 'settings', opened: true, onClose: () => {}, withinPortal: false },
        {
          default: () =>
            h(
              ModalBaseContent,
              { innerProps: { 'data-inner': 'true' } },
              {
                default: () => [
                  h(ModalBaseHeader, null, () => h(ModalBaseTitle, null, () => 'Settings')),
                  h(ModalBaseBody, null, () => 'Preferences'),
                ],
              },
            ),
        },
      ),
    )
    await nextTick()

    const dialog = wrapper.find('[role="dialog"]')
    expect(dialog.attributes('aria-labelledby')).toBe('settings-title')
    expect(dialog.attributes('aria-describedby')).toBe('settings-body')
    expect(wrapper.find('#settings-title').text()).toBe('Settings')
    expect(wrapper.find('#settings-body').text()).toBe('Preferences')
    expect(wrapper.find('[data-inner="true"]').exists()).toBe(true)
  })

  it('closes once on Escape and honors propagation opt-out', async () => {
    const onClose = vi.fn()
    const wrapper = render(() =>
      h(
        ModalBase,
        { opened: true, onClose, withinPortal: false },
        {
          default: () =>
            h(ModalBaseContent, null, () =>
              h(ModalBaseBody, null, () =>
                h('button', { 'data-mantine-stop-propagation': 'true' }, 'Nested'),
              ),
            ),
        },
      ),
    )

    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    await wrapper.find('button').trigger('keydown', { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('honors overlay and close button behavior', async () => {
    const onClose = vi.fn()
    const overlayClick = vi.fn()
    const wrapper = render(() =>
      h(
        ModalBase,
        {
          opened: true,
          onClose,
          withinPortal: false,
          closeOnClickOutside: false,
        },
        {
          default: () => [
            h(ModalBaseOverlay, { onClick: overlayClick }),
            h(ModalBaseContent, null, () => h(ModalBaseCloseButton)),
          ],
        },
      ),
    )

    await wrapper.find('.mantine-Overlay-root').trigger('click')
    expect(overlayClick).toHaveBeenCalledOnce()
    expect(onClose).not.toHaveBeenCalled()
    await wrapper.find('button').trigger('click')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('keeps hidden content mounted when requested', () => {
    const wrapper = render(() =>
      h(
        ModalBase,
        {
          opened: false,
          onClose: () => {},
          keepMounted: true,
          withinPortal: false,
        },
        { default: () => h(ModalBaseContent, null, () => 'Hidden content') },
      ),
    )

    expect(wrapper.text()).toContain('Hidden content')
    expect(wrapper.find('[role="dialog"]').attributes('style')).toContain('display: none')
  })
})

describe('@mantine-vue/core Drawer', () => {
  it('renders overlay, title, body, and requested position', () => {
    const wrapper = render(() =>
      h(
        Drawer,
        {
          opened: true,
          onClose: () => {},
          withinPortal: false,
          title: 'Navigation',
          position: 'right',
        },
        () => 'Links',
      ),
    )

    expect(wrapper.find('.mantine-Drawer-overlay').exists()).toBe(true)
    expect(wrapper.find('.mantine-Drawer-title').text()).toBe('Navigation')
    expect(wrapper.find('.mantine-Drawer-body').text()).toBe('Links')
    expect(wrapper.find('.mantine-Drawer-root').attributes('data-position')).toBe('right')
  })

  it('conditionally renders overlay and header', async () => {
    const withOverlay = ref(false)
    const withCloseButton = ref(false)
    const title = ref<any>(null)
    const wrapper = render(() =>
      h(Drawer, {
        opened: true,
        onClose: () => {},
        withinPortal: false,
        withOverlay: withOverlay.value,
        withCloseButton: withCloseButton.value,
        title: title.value,
      }),
    )

    expect(wrapper.find('.mantine-Drawer-overlay').exists()).toBe(false)
    expect(wrapper.find('.mantine-Drawer-header').exists()).toBe(false)
    withOverlay.value = true
    title.value = 'Title'
    await nextTick()
    expect(wrapper.find('.mantine-Drawer-overlay').exists()).toBe(true)
    expect(wrapper.find('.mantine-Drawer-header').exists()).toBe(true)
  })

  it('exposes Mantine-compatible compound components', () => {
    expect(Drawer.Root).toBe(DrawerRoot)
    expect(Drawer.Overlay).toBe(DrawerOverlay)
    expect(Drawer.Content).toBe(DrawerContent)
    expect(Drawer.Body).toBe(DrawerBody)
    expect(Drawer.Header).toBe(DrawerHeader)
    expect(Drawer.Title).toBe(DrawerTitle)
    expect(Drawer.CloseButton).toBe(DrawerCloseButton)
  })
})
