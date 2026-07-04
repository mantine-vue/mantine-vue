import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  MantineProvider,
  Popover,
  PopoverContextMenu,
  PopoverDropdown,
  PopoverTarget,
} from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(props: Record<string, any> = {}, context = false) {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Popover,
            { withinPortal: false, ...props },
            {
              default: () => [
                h(context ? Popover.ContextMenu : Popover.Target, null, () =>
                  h('button', { class: 'target' }, 'Target'),
                ),
                h(Popover.Dropdown, null, () => 'Dropdown'),
              ],
            },
          ),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}
afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

describe('@mantine-vue/core Popover', () => {
  it('supports uncontrolled toggle behavior and accessible roles', async () => {
    const wrapper = render()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await wrapper.find('.target').trigger('click')
    const dropdown = wrapper.find('[role="dialog"]')
    expect(dropdown.text()).toBe('Dropdown')
    expect(wrapper.find('.target').attributes('aria-expanded')).toBe('true')
    expect(dropdown.attributes('aria-labelledby')).toBe(wrapper.find('.target').attributes('id'))
    await wrapper.find('.target').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('handles defaultOpened, Escape, and callbacks', async () => {
    const onClose = vi.fn()
    const onDismiss = vi.fn()
    const wrapper = render({ defaultOpened: true, onClose, onDismiss })
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
    expect(onDismiss).toHaveBeenCalledOnce()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('closes on outside pointer events when enabled', async () => {
    const onClose = vi.fn()
    const wrapper = render({ defaultOpened: true, onClose })
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(onClose).toHaveBeenCalledOnce()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders arrow and exposes compound components', () => {
    const wrapper = render({ defaultOpened: true, withArrow: true })
    expect(wrapper.find('.mantine-Popover-arrow').exists()).toBe(true)
    expect(Popover.Target).toBe(PopoverTarget)
    expect(Popover.Dropdown).toBe(PopoverDropdown)
    expect(Popover.ContextMenu).toBe(PopoverContextMenu)
  })

  it('opens at a context-menu virtual reference and prevents browser menu', async () => {
    const wrapper = render({}, true)
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 25,
      clientY: 35,
    })
    wrapper.find('.target').element.dispatchEvent(event)
    await wrapper.vm.$nextTick()
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.find('.target').attributes('data-expanded')).toBe('true')
  })
})
