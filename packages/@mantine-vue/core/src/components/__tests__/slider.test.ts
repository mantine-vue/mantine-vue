import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, RangeSlider, Slider } from '../../index'
import {
  getChangeValue,
  getFloatingValue,
  getPosition,
  getPrecision,
} from '../Slider/utils/slider-utils'

function render(component: any, props: Record<string, any>) {
  return mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(component, props)) })
}

describe('@mantine-vue/core Slider utilities', () => {
  it('calculates positions, stepped changes and precision', () => {
    expect(getPosition({ value: 25, min: 0, max: 100 })).toBe(25)
    expect(getPosition({ value: 150, min: 0, max: 100 })).toBe(100)
    expect(getChangeValue({ value: 0.26, min: 0, max: 100, step: 10 })).toBe(30)
    expect(getPrecision(0.01)).toBe(2)
    expect(getFloatingValue(1.234, 2)).toBe(1.23)
  })
})

describe('@mantine-vue/core Slider', () => {
  it('renders marks, label, variables and hidden input', () => {
    const wrapper = render(Slider, {
      defaultValue: 25,
      name: 'volume',
      labelAlwaysOn: true,
      label: (value: number) => `${value}%`,
      marks: [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Mid' },
        { value: 100, hidden: true },
      ],
      size: 'sm',
    })

    expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('25')
    expect(wrapper.findComponent({ name: 'SliderThumb' }).props('labelAlwaysOn')).toBe(true)
    expect(wrapper.findComponent({ name: 'SliderThumb' }).props('label')).toBe('25%')
    expect(wrapper.text()).toContain('25%')
    expect(wrapper.findAll('.mantine-Slider-mark')).toHaveLength(2)
    expect((wrapper.find('input[name="volume"]').element as HTMLInputElement).value).toBe('25')
    expect(wrapper.find('.mantine-Slider-root').attributes('style')).toContain(
      '--slider-size: var(--slider-size-sm)',
    )
  })

  it('updates with keyboard and reports change end', async () => {
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    const wrapper = render(Slider, { defaultValue: 10, step: 5, onChange, onChangeEnd })
    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(onChange).toHaveBeenLastCalledWith(15)
    expect(onChangeEnd).toHaveBeenLastCalledWith(15)
    expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('15')
  })

  it('snaps keyboard changes to marks and supports vertical orientation', async () => {
    const wrapper = render(Slider, {
      defaultValue: 20,
      restrictToMarks: true,
      marks: [{ value: 20 }, { value: 45 }, { value: 80 }],
      orientation: 'vertical',
    })
    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('45')
    expect(wrapper.find('.mantine-Slider-root').attributes('data-orientation')).toBe('vertical')
    expect(wrapper.find('[role="slider"]').attributes('aria-orientation')).toBe('vertical')
  })
})

describe('@mantine-vue/core RangeSlider', () => {
  it('renders two accessible thumbs and hidden inputs', () => {
    const wrapper = render(RangeSlider, {
      defaultValue: [20, 70],
      name: 'price',
      thumbLabel: ['Minimum', 'Maximum'],
    })
    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)
    expect(thumbs[0].attributes('aria-label')).toBe('Minimum')
    expect(thumbs[1].attributes('aria-valuenow')).toBe('70')
    expect((wrapper.find('input[name="price_from"]').element as HTMLInputElement).value).toBe('20')
    expect((wrapper.find('input[name="price_to"]').element as HTMLInputElement).value).toBe('70')
  })

  it('supports keyboard updates and pushes an overlapping thumb', async () => {
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    const wrapper = render(RangeSlider, {
      defaultValue: [40, 50],
      minRange: 10,
      step: 10,
      pushOnOverlap: true,
      onChange,
      onChangeEnd,
    })
    await wrapper.findAll('[role="slider"]')[0].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(onChange).toHaveBeenLastCalledWith([50, 60])
    expect(onChangeEnd).toHaveBeenLastCalledWith([50, 60])
    expect(wrapper.findAll('[role="slider"]')[1].attributes('aria-valuenow')).toBe('60')
  })
})
