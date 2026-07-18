import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import {
  MantineProvider,
  Menu,
  Menubar,
  MenubarDropdown,
  MenubarMenu,
  MenubarTarget,
} from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []

function menu(label: string, items: string[]) {
  return h(MenubarMenu, { withinPortal: false, transitionProps: { duration: 0 } }, () => [
    h(MenubarTarget, null, () => label),
    h(MenubarDropdown, null, () => items.map((item) => h(Menu.Item, { key: item }, () => item))),
  ])
}

function render(props: Record<string, any> = {}) {
  const wrapper = mount(
    defineComponent({
      props: { barProps: { type: Object, default: () => ({}) } },
      setup(p) {
        return () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(Menubar, p.barProps, () => [
              menu('File', ['New file', 'Open']),
              menu('Edit', ['Undo', 'Redo']),
              menu('View', ['Zoom in']),
            ]),
          )
      },
    }),
    { attachTo: document.body, props: { barProps: props } },
  )
  mounted.push(wrapper)
  return wrapper
}

function targets(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-menubar-target]')
}

function target(wrapper: ReturnType<typeof mount>, name: string) {
  return targets(wrapper).find((node) => node.text() === name)!
}

async function ready(_wrapper: ReturnType<typeof mount>) {
  await flushPromises()
  await nextTick()
  await nextTick()
}

afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('@mantine-vue/core Menubar', () => {
  it('exposes related components as static properties', () => {
    expect(Menubar.Menu).toBe(MenubarMenu)
    expect(Menubar.Target).toBe(MenubarTarget)
    expect(Menubar.Dropdown).toBe(MenubarDropdown)
  })

  it('renders root with role="menubar" and horizontal orientation', async () => {
    const wrapper = render()
    await ready(wrapper)
    const bar = wrapper.find('[role="menubar"]')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('aria-orientation')).toBe('horizontal')
  })

  it('renders targets with role="menuitem" and aria-haspopup="menu"', async () => {
    const wrapper = render()
    await ready(wrapper)
    expect(target(wrapper, 'File').attributes('role')).toBe('menuitem')
    expect(target(wrapper, 'File').attributes('aria-haspopup')).toBe('menu')
    expect(target(wrapper, 'Edit').attributes('aria-haspopup')).toBe('menu')
  })

  it('uses a single tab stop (roving tabindex)', async () => {
    const wrapper = render()
    await ready(wrapper)
    expect(target(wrapper, 'File').attributes('tabindex')).toBe('0')
    expect(target(wrapper, 'Edit').attributes('tabindex')).toBe('-1')
    expect(target(wrapper, 'View').attributes('tabindex')).toBe('-1')
  })

  it('opens and closes a menu on target click', async () => {
    const wrapper = render()
    await ready(wrapper)
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(0)

    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    expect(wrapper.text()).toContain('New file')
    expect(target(wrapper, 'File').attributes('data-expanded')).toBe('true')

    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(0)
  })

  it('keeps only one menu open at a time and switches on click', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    expect(wrapper.text()).toContain('New file')

    await target(wrapper, 'Edit').trigger('click')
    await ready(wrapper)
    expect(wrapper.text()).toContain('Undo')
    expect(wrapper.text()).not.toContain('New file')
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(1)
  })

  it('moves the active target with ArrowRight/ArrowLeft', async () => {
    const wrapper = render()
    await ready(wrapper)

    await target(wrapper, 'File').trigger('keydown', { key: 'ArrowRight' })
    await ready(wrapper)
    expect(target(wrapper, 'Edit').attributes('tabindex')).toBe('0')
    expect(target(wrapper, 'File').attributes('tabindex')).toBe('-1')

    await target(wrapper, 'Edit').trigger('keydown', { key: 'ArrowLeft' })
    await ready(wrapper)
    expect(target(wrapper, 'File').attributes('tabindex')).toBe('0')
  })

  it('wraps with arrow navigation by default', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'File').trigger('keydown', { key: 'ArrowLeft' })
    await ready(wrapper)
    expect(target(wrapper, 'View').attributes('tabindex')).toBe('0')
  })

  it('does not wrap when loop is false', async () => {
    const wrapper = render({ loop: false })
    await ready(wrapper)
    await target(wrapper, 'File').trigger('keydown', { key: 'ArrowLeft' })
    await ready(wrapper)
    expect(target(wrapper, 'File').attributes('tabindex')).toBe('0')
  })

  it('Home and End move to the first and last targets', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'Edit').trigger('keydown', { key: 'End' })
    await ready(wrapper)
    expect(target(wrapper, 'View').attributes('tabindex')).toBe('0')

    await target(wrapper, 'View').trigger('keydown', { key: 'Home' })
    await ready(wrapper)
    expect(target(wrapper, 'File').attributes('tabindex')).toBe('0')
  })

  it('opens the menu with ArrowDown on a target', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'File').trigger('keydown', { key: 'ArrowDown' })
    await ready(wrapper)
    expect(wrapper.text()).toContain('New file')
  })

  it('opens the menu with Enter on a target', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'Edit').trigger('keydown', { key: 'Enter' })
    await ready(wrapper)
    expect(wrapper.text()).toContain('Undo')
  })

  it('opens a menu on hover when trigger is hover', async () => {
    const wrapper = render({ trigger: 'hover' })
    await ready(wrapper)
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(0)
    await target(wrapper, 'File').trigger('mouseenter')
    await ready(wrapper)
    expect(wrapper.text()).toContain('New file')
  })

  it('does not open a menu on hover when all menus are closed (trigger click)', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'File').trigger('mouseenter')
    await ready(wrapper)
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(0)
  })

  it('switches the opened menu on hover once a menu is open (trigger click)', async () => {
    const wrapper = render()
    await ready(wrapper)
    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    await target(wrapper, 'Edit').trigger('mouseenter')
    await ready(wrapper)
    expect(wrapper.text()).toContain('Undo')
    expect(wrapper.text()).not.toContain('New file')
  })

  it('supports controlled openIndex', async () => {
    const wrapper = render({ openIndex: 0 })
    await ready(wrapper)
    expect(wrapper.text()).toContain('New file')

    await wrapper.setProps({ barProps: { openIndex: 1 } })
    await ready(wrapper)
    expect(wrapper.text()).toContain('Undo')
    expect(wrapper.text()).not.toContain('New file')

    await wrapper.setProps({ barProps: { openIndex: null } })
    await ready(wrapper)
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(0)
  })

  it('calls onOpenChange with the opened menu index', async () => {
    const onOpenChange = vi.fn()
    const wrapper = render({ onOpenChange })
    await ready(wrapper)
    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    expect(onOpenChange).toHaveBeenLastCalledWith(0)
    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    expect(onOpenChange).toHaveBeenLastCalledWith(null)
  })

  it('keeps the tab stop on an enabled target when the first target is disabled', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(MantineProvider, { env: 'test' }, () =>
              h(Menubar, null, () => [
                h(MenubarMenu, { withinPortal: false }, () => [
                  h(MenubarTarget, { disabled: true }, () => 'File'),
                  h(MenubarDropdown, null, () => h(Menu.Item, null, () => 'New file')),
                ]),
                h(MenubarMenu, { withinPortal: false }, () => [
                  h(MenubarTarget, null, () => 'Edit'),
                  h(MenubarDropdown, null, () => h(Menu.Item, null, () => 'Undo')),
                ]),
              ]),
            )
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await ready(wrapper)

    expect(target(wrapper, 'File').attributes('tabindex')).toBe('-1')
    expect(target(wrapper, 'Edit').attributes('tabindex')).toBe('0')
  })

  it('does not open a data-disabled target on click', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(MantineProvider, { env: 'test' }, () =>
              h(Menubar, null, () =>
                h(MenubarMenu, { withinPortal: false }, () => [
                  h(MenubarTarget, { 'data-disabled': true }, () => 'File'),
                  h(MenubarDropdown, null, () => h(Menu.Item, null, () => 'New file')),
                ]),
              ),
            )
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await ready(wrapper)

    await target(wrapper, 'File').trigger('click')
    await ready(wrapper)
    expect(wrapper.findAll('[role="menu"]')).toHaveLength(0)
  })
})
