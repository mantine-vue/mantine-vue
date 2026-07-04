import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Tooltip, TooltipFloating, TooltipGroup } from '../../index'

const mounted: Array<ReturnType<typeof mount>> = []
function render(
  props: Record<string, any> = {},
  child: any = () => h('button', { class: 'target' }, 'Target'),
) {
  const wrapper = mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Tooltip, { label: 'Tooltip label', withinPortal: false, ...props }, child),
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

describe('@mantine-vue/core Tooltip', () => {
  it('shows and hides on target hover', async () => {
    const wrapper = render()
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    await wrapper.find('.target').trigger('mouseenter')
    expect(wrapper.find('[role="tooltip"]').text()).toBe('Tooltip label')
    await wrapper.find('.target').trigger('mouseleave')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('supports default and controlled opened state', async () => {
    expect(render({ defaultOpened: true }).find('[role="tooltip"]').exists()).toBe(true)
    const opened = ref(true)
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Tooltip, { label: 'Controlled', opened: opened.value, withinPortal: false }, () =>
            h('button', { class: 'target' }, 'Target'),
          ),
        ),
    })
    mounted.push(wrapper)
    await wrapper.find('.target').trigger('mouseleave')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
  })

  it('honors open and close delays', async () => {
    vi.useFakeTimers()
    const wrapper = render({ openDelay: 100, closeDelay: 50 })
    await wrapper.find('.target').trigger('mouseenter')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    vi.advanceTimersByTime(100)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    await wrapper.find('.target').trigger('mouseleave')
    vi.advanceTimersByTime(50)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('supports focus events, arrows, multiline, and disabled state', async () => {
    const wrapper = render({
      events: { hover: false, focus: true, touch: false },
      withArrow: true,
      multiline: true,
    })
    await wrapper.find('.target').trigger('focus')
    expect(wrapper.find('.mantine-Tooltip-arrow').exists()).toBe(true)
    expect(wrapper.find('[role="tooltip"]').attributes('data-multiline')).toBe('true')
    await wrapper.find('.target').trigger('blur')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    expect(render({ defaultOpened: true, disabled: true }).find('[role="tooltip"]').exists()).toBe(
      false,
    )
  })

  it('preserves child event handlers', async () => {
    const onMouseenter = vi.fn()
    const wrapper = render({}, () => h('button', { class: 'target', onMouseenter }, 'Target'))
    await wrapper.find('.target').trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalledOnce()
  })

  it('supports selector targets without requiring a slot child', async () => {
    const wrapper = mount(
      defineComponent({
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h('div', [
              h('button', { id: 'external-target' }, 'External'),
              h(Tooltip, {
                label: 'External tooltip',
                target: '#external-target',
                withinPortal: false,
              }),
            ]),
          ),
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await wrapper.find('#external-target').trigger('mouseenter')
    expect(wrapper.find('[role="tooltip"]').text()).toBe('External tooltip')
  })

  it('exposes Group and Floating variants', async () => {
    expect(Tooltip.Group).toBe(TooltipGroup)
    expect(Tooltip.Floating).toBe(TooltipFloating)
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Tooltip.Floating, { label: 'Floating', withinPortal: false }, () =>
            h('button', { class: 'target' }, 'Target'),
          ),
        ),
    })
    mounted.push(wrapper)
    await wrapper.find('.target').trigger('mouseenter', { clientX: 20, clientY: 30 })
    expect(wrapper.find('[role="tooltip"]').text()).toBe('Floating')
    await wrapper.find('.target').trigger('mouseleave')
    expect(wrapper.find('[role="tooltip"]').attributes('style')).toContain('display: none')
  })
})
