import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import {
  AngleSlider,
  Checkbox,
  CheckboxGroup,
  Chip,
  ChipGroup,
  ColorPicker,
  Input,
  InputBase,
  JsonInput,
  MantineProvider,
  NumberInput,
  PasswordInput,
  PillsInputField,
  PinInput,
  Radio,
  RadioGroup,
  RangeSlider,
  Rating,
  SegmentedControl,
  Slider,
  Switch,
  SwitchGroup,
  Textarea,
  TextInput,
} from '../../index'

function renderModel<T>(component: Component, initialValue: T, props: Record<string, any> = {}) {
  const value = ref(initialValue)
  const onChange = vi.fn()
  const wrapper = mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(component, {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (nextValue: T) => (value.value = nextValue),
          onChange,
        }),
      ),
  })

  return { onChange, value, wrapper }
}

describe('@mantine-vue/core v-model', () => {
  it.each([
    ['Input', Input, 'input'],
    ['InputBase', InputBase, 'input'],
    ['TextInput', TextInput, 'input'],
    ['Textarea', Textarea, 'textarea'],
    ['PasswordInput', PasswordInput, 'input'],
    ['PillsInput.Field', PillsInputField, 'input'],
  ])('binds %s values in both directions and emits raw strings', async (_, component, selector) => {
    const { onChange, value, wrapper } = renderModel(component, 'initial')
    const input = wrapper.get(selector)

    value.value = 'external'
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('external')

    await input.setValue('user')
    expect(value.value).toBe('user')
    expect(onChange).toHaveBeenLastCalledWith('user')
  })

  it.each([
    ['Checkbox', Checkbox, 'input[type="checkbox"]'],
    ['Switch', Switch, 'input[role="switch"]'],
    ['Chip', Chip, 'input'],
  ])('binds %s boolean state and emits raw booleans', async (_, component, selector) => {
    const { onChange, value, wrapper } = renderModel(component, false, {
      label: 'Control',
      value: 'control',
    })
    const input = wrapper.get(selector)

    value.value = true
    await nextTick()
    expect((input.element as HTMLInputElement).checked).toBe(true)

    await input.setValue(false)
    expect(value.value).toBe(false)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('binds Radio boolean state and emits a raw boolean', async () => {
    const { onChange, value, wrapper } = renderModel(Radio, false, {
      label: 'Radio',
      value: 'radio',
    })
    const input = wrapper.get('input[type="radio"]')

    await input.setValue(true)
    expect(value.value).toBe(true)
    expect(onChange).toHaveBeenLastCalledWith(true)

    value.value = false
    await nextTick()
    expect((input.element as HTMLInputElement).checked).toBe(false)
  })

  it('binds selection group values in both directions', async () => {
    const checkboxValue = ref<string[]>(['a'])
    const radioValue = ref('a')
    const switchValue = ref<string[]>(['a'])
    const chipValue = ref<string | null>('a')
    const wrapper = mount({
      components: {
        Checkbox,
        CheckboxGroup,
        Chip,
        ChipGroup,
        MantineProvider,
        Radio,
        RadioGroup,
        Switch,
        SwitchGroup,
      },
      setup: () => ({ checkboxValue, chipValue, radioValue, switchValue }),
      template: `
        <MantineProvider env="test">
          <CheckboxGroup v-model="checkboxValue">
            <Checkbox value="a" label="Checkbox A" />
            <Checkbox value="b" label="Checkbox B" />
          </CheckboxGroup>
          <RadioGroup v-model="radioValue">
            <Radio value="a" label="Radio A" />
            <Radio value="b" label="Radio B" />
          </RadioGroup>
          <SwitchGroup v-model="switchValue">
            <Switch value="a" label="Switch A" />
            <Switch value="b" label="Switch B" />
          </SwitchGroup>
          <ChipGroup v-model="chipValue">
            <Chip value="a">Chip A</Chip>
            <Chip value="b">Chip B</Chip>
          </ChipGroup>
        </MantineProvider>
      `,
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    const radios = wrapper.findAll('input[type="radio"]')

    await checkboxes[1].setValue(true)
    await radios[1].setValue(true)
    await wrapper.findAll('input[role="switch"]')[1].setValue(true)
    await wrapper.findAll('.mantine-Chip-input')[1].setValue(true)

    expect(checkboxValue.value).toEqual(['a', 'b'])
    expect(radioValue.value).toBe('b')
    expect(switchValue.value).toEqual(['a', 'b'])
    expect(chipValue.value).toBe('b')
  })

  it('binds formatted and composite input values', async () => {
    const number = renderModel(NumberInput, 1)
    await number.wrapper.get('input').setValue('42')
    expect(number.value.value).toBe(42)
    expect(number.onChange).toHaveBeenLastCalledWith(42)

    const json = renderModel(JsonInput, '{"a":1}')
    await json.wrapper.get('textarea').setValue('{"b":2}')
    expect(json.value.value).toBe('{"b":2}')

    const pin = renderModel(PinInput, '', { length: 2 })
    await pin.wrapper.findAll('input[type="text"]')[0].setValue('7')
    expect(pin.value.value).toBe('7')

    const segmented = renderModel(SegmentedControl, 'a', { data: ['a', 'b'] })
    await segmented.wrapper.findAll('input')[1].setValue(true)
    expect(segmented.value.value).toBe('b')
    expect(segmented.onChange).toHaveBeenLastCalledWith('b')
  })

  it('binds slider, rating, and color control values', async () => {
    const slider = renderModel(Slider, 20)
    await slider.wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(slider.value.value).toBe(21)

    const range = renderModel(RangeSlider, [20, 80] as [number, number])
    await range.wrapper.findAll('[role="slider"]')[0].trigger('keydown', { key: 'ArrowRight' })
    expect(range.value.value).toEqual([21, 80])

    const angle = renderModel(AngleSlider, 45)
    await angle.wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(angle.value.value).toBe(46)

    const rating = renderModel(Rating, 1)
    const secondRating = rating.wrapper
      .findAll('input[type="radio"]')
      .find((input) => input.element.value === '2')!
    secondRating.element.nextElementSibling?.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    )
    await nextTick()
    expect(rating.value.value).toBe(2)

    const color = renderModel(ColorPicker, '#ff0000', {
      withPicker: false,
      swatches: ['#ff0000', '#00ff00'],
    })
    await color.wrapper.get('[aria-label="#00ff00"]').trigger('click')
    expect(color.value.value).toBe('#00ff00')
  })
})
