import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  HoverCard,
  HoverCardDropdown,
  HoverCardGroup,
  HoverCardTarget,
  MantineProvider,
} from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(props: Record<string, any> = {}) {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            HoverCard,
            { withinPortal: false, ...props },
            {
              default: () => [
                h(HoverCard.Target, null, () => h('button', { class: 'target' }, 'Target')),
                h(HoverCard.Dropdown, null, () => 'Dropdown'),
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
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.useRealTimers()
})

describe('@mantine-vue/core HoverCard', () => {
  it('opens on target hover and closes after leaving', async () => {
    vi.useFakeTimers()
    const wrapper = render({ closeDelay: 100 })
    await wrapper.find('.target').trigger('mouseenter')
    expect(wrapper.find('[role="dialog"]').text()).toBe('Dropdown')
    await wrapper.find('.target').trigger('mouseleave')
    vi.advanceTimersByTime(99)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('keeps dropdown open while pointer moves from target to dropdown', async () => {
    vi.useFakeTimers()
    const wrapper = render({ closeDelay: 100 })
    await wrapper.find('.target').trigger('mouseenter')
    await wrapper.find('.target').trigger('mouseleave')
    await wrapper.find('[role="dialog"]').trigger('mouseenter')
    vi.advanceTimersByTime(100)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('supports initiallyOpened and lifecycle callbacks', async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    expect(render({ initiallyOpened: true }).find('[role="dialog"]').exists()).toBe(true)
    const wrapper = render({ onOpen, onClose, closeDelay: 0 })
    await wrapper.find('.target').trigger('mouseenter')
    await wrapper.find('.target').trigger('mouseleave')
    expect(onOpen).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('uses HoverCard styles selector and exposes compounds', async () => {
    const wrapper = render()
    await wrapper.find('.target').trigger('mouseenter')
    expect(wrapper.find('.mantine-HoverCard-dropdown').exists()).toBe(true)
    expect(HoverCard.Target).toBe(HoverCardTarget)
    expect(HoverCard.Dropdown).toBe(HoverCardDropdown)
    expect(HoverCard.Group).toBe(HoverCardGroup)
  })

  it('uses group delays', async () => {
    vi.useFakeTimers()
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(HoverCard.Group, { openDelay: 75, closeDelay: 25 }, () =>
            h(
              HoverCard,
              { withinPortal: false },
              {
                default: () => [
                  h(HoverCard.Target, null, () => h('button', { class: 'target' }, 'Target')),
                  h(HoverCard.Dropdown, null, () => 'Grouped'),
                ],
              },
            ),
          ),
        ),
    })
    mounted.push(wrapper)
    await wrapper.find('.target').trigger('mouseenter')
    vi.advanceTimersByTime(74)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })
})
