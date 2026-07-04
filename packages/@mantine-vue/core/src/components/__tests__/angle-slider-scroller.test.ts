import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { normalizeRadialValue } from '@mantine-vue/hooks'
import { AngleSlider, MantineProvider, Scroller } from '../../index'

function withProvider(
  component: any,
  props: Record<string, any> = {},
  slots?: Record<string, any>,
) {
  const target = document.createElement('div')
  document.body.appendChild(target)

  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, slots)),
    },
    { attachTo: target },
  )
}

describe('@mantine-vue/core AngleSlider', () => {
  it('normalizes radial values by step', () => {
    expect(normalizeRadialValue(359, 1)).toBe(359)
    expect(normalizeRadialValue(360, 1)).toBe(0)
    expect(normalizeRadialValue(11, 10)).toBe(20)
  })

  it('renders label, thumb and hidden input', () => {
    const wrapper = withProvider(AngleSlider, {
      defaultValue: 45,
      name: 'angle',
      size: 80,
      thumbSize: 16,
      formatLabel: (value: number) => `${value}deg`,
    })

    expect(wrapper.find('.mantine-AngleSlider-label').text()).toBe('45deg')
    expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('45')
    expect(wrapper.find('[role="slider"]').attributes('style')).toContain('rotate(45deg)')
    expect((wrapper.find('input[type="hidden"]').element as HTMLInputElement).value).toBe('45')
    expect(wrapper.find('.mantine-AngleSlider-root').attributes('style')).toContain(
      '--slider-size: 5rem',
    )
  })

  it('supports keyboard updates and onChangeEnd', async () => {
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    const wrapper = withProvider(AngleSlider, {
      defaultValue: 0,
      step: 15,
      onChange,
      onChangeEnd,
    })
    const thumb = wrapper.find('[role="slider"]')

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(onChange).toHaveBeenLastCalledWith(15)
    expect(onChangeEnd).toHaveBeenLastCalledWith(15)
    expect(thumb.attributes('aria-valuenow')).toBe('15')
  })

  it('restricts keyboard values to marks', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(AngleSlider, {
      defaultValue: 0,
      step: 20,
      restrictToMarks: true,
      marks: [
        { value: 0, label: '0' },
        { value: 90, label: '90' },
        { value: 180, label: '180' },
      ],
      onChange,
    })

    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(onChange).toHaveBeenLastCalledWith(90)
    expect(wrapper.findAll('.mantine-AngleSlider-mark')).toHaveLength(3)
  })

  it('does not render label when withLabel is false', () => {
    const wrapper = withProvider(AngleSlider, { defaultValue: 20, withLabel: false })

    expect(wrapper.find('.mantine-AngleSlider-label').exists()).toBe(false)
  })
})

describe('@mantine-vue/core Scroller', () => {
  it('renders controls and content', () => {
    const wrapper = withProvider(
      Scroller,
      { showStartControl: true, showEndControl: true, controlSize: 40 },
      { default: () => [h('span', 'One'), h('span', 'Two')] },
    )

    expect(wrapper.text()).toContain('One')
    expect(wrapper.text()).toContain('Two')
    expect(wrapper.findAll('.mantine-Scroller-control')).toHaveLength(2)
    expect(wrapper.find('.mantine-Scroller-root').attributes('style')).toContain(
      '--scroller-control-size: 2.5rem',
    )
  })

  it('scrolls start and end with configured amount', async () => {
    const wrapper = withProvider(
      Scroller,
      { showStartControl: true, showEndControl: true, scrollAmount: 125 },
      { default: () => h('span', 'Scrollable') },
    )
    const container = wrapper.find('.mantine-Scroller-container').element as HTMLDivElement
    const scrollBy = vi.fn()
    container.scrollBy = scrollBy

    await wrapper.find('[data-position="end"]').trigger('click')
    await wrapper.find('[data-position="start"]').trigger('click')

    expect(scrollBy).toHaveBeenNthCalledWith(1, { left: 125, behavior: 'smooth' })
    expect(scrollBy).toHaveBeenNthCalledWith(2, { left: -125, behavior: 'smooth' })
  })

  it('applies hidden controls by scroll state and supports custom icons', () => {
    const wrapper = withProvider(
      Scroller,
      { startControlIcon: 'S', endControlIcon: 'E' },
      { default: () => h('span', 'Item') },
    )
    const controls = wrapper.findAll('.mantine-Scroller-control')

    expect(controls[0].attributes('data-hidden')).toBeDefined()
    expect(controls[1].attributes('data-hidden')).toBeDefined()
    expect(controls[0].text()).toBe('S')
    expect(controls[1].text()).toBe('E')
  })
})
