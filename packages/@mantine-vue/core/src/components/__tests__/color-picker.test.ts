import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import {
  AlphaSlider,
  ColorPicker,
  ColorSlider,
  HueSlider,
  MantineProvider,
  convertHsvaTo,
  isColorValid,
  parseColor,
} from '../../index'

function render(component: any, props: Record<string, any>) {
  return mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(component, props)) })
}

describe('@mantine-vue/core color converters', () => {
  it('parses supported formats and converts HSVA values', () => {
    expect(parseColor('#ff0000')).toMatchObject({ h: 0, s: 100, v: 100, a: 1 })
    expect(parseColor('rgba(255, 0, 0, 0.5)')).toMatchObject({ h: 0, s: 100, v: 100, a: 0.5 })
    expect(parseColor('transparent').a).toBe(0)
    expect(convertHsvaTo('hex', { h: 120, s: 100, v: 100, a: 1 })).toBe('#00ff00')
    expect(convertHsvaTo('hexa', { h: 0, s: 100, v: 100, a: 0.5 })).toBe('#ff000080')
    expect(isColorValid('hsl(120, 100%, 50%)')).toBe(true)
    expect(isColorValid('not-a-color')).toBe(false)
  })
})

describe('@mantine-vue/core color sliders', () => {
  it('exports the generic slider and updates HueSlider with keyboard', async () => {
    expect(ColorSlider).toBeDefined()
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    const wrapper = render(HueSlider, { value: 180, onChange, onChangeEnd, 'aria-label': 'Hue' })
    const slider = wrapper.find('[role="slider"]')

    expect(slider.attributes('aria-valuemax')).toBe('360')
    expect(slider.attributes('aria-label')).toBe('Hue')
    await slider.trigger('keydown', { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(198)
    expect(onChangeEnd).toHaveBeenLastCalledWith(198)
  })

  it('rounds AlphaSlider values', async () => {
    const onChange = vi.fn()
    const wrapper = render(AlphaSlider, { value: 0.5, color: '#ff0000', onChange })
    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(0.55)
    expect(wrapper.find('[data-alpha]').exists()).toBe(true)
  })
})

describe('@mantine-vue/core ColorPicker', () => {
  it('renders saturation, hue, alpha, preview and hidden input', () => {
    const wrapper = render(ColorPicker, {
      defaultValue: '#ff000080',
      format: 'hexa',
      name: 'color',
      saturationLabel: 'Saturation',
      hueLabel: 'Hue',
      alphaLabel: 'Alpha',
    })

    expect(wrapper.findAll('[role="slider"]')).toHaveLength(3)
    expect(wrapper.find('[aria-label="Saturation"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Hue"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Alpha"]').exists()).toBe(true)
    expect(wrapper.find('.mantine-ColorPicker-preview').exists()).toBe(true)
    expect((wrapper.find('input[name="color"]').element as HTMLInputElement).value).toBe(
      '#ff000080',
    )
  })

  it('supports swatch-only mode and emits converted values', async () => {
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    const onColorSwatchClick = vi.fn()
    const wrapper = render(ColorPicker, {
      format: 'rgb',
      withPicker: false,
      swatches: ['#ff0000', '#00ff00'],
      onChange,
      onChangeEnd,
      onColorSwatchClick,
    })

    expect(wrapper.find('[role="slider"]').exists()).toBe(false)
    await wrapper.find('[aria-label="#00ff00"]').trigger('click')
    await nextTick()

    expect(onChange).toHaveBeenLastCalledWith('rgb(0, 255, 0)')
    expect(onChangeEnd).toHaveBeenLastCalledWith('rgb(0, 255, 0)')
    expect(onColorSwatchClick).toHaveBeenLastCalledWith('rgb(0, 255, 0)')
  })

  it('updates through saturation keyboard controls', async () => {
    const onChange = vi.fn()
    const onChangeEnd = vi.fn()
    const wrapper = render(ColorPicker, {
      defaultValue: '#ff0000',
      onChange,
      onChangeEnd,
      saturationLabel: 'Saturation',
    })

    await wrapper.find('[aria-label="Saturation"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalled()
    expect(onChangeEnd).toHaveBeenCalled()
  })
})
