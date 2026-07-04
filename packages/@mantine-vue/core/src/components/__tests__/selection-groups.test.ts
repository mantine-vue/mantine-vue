import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  CheckboxIndicator,
  MantineProvider,
  Radio,
  RadioCard,
  RadioGroup,
  RadioIndicator,
  Switch,
  SwitchGroup,
} from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core selection groups', () => {
  it('Checkbox.Group controls children, serializes hidden value and enforces maxSelectedValues', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(
        CheckboxGroup,
        { defaultValue: ['a'], name: 'checks', maxSelectedValues: 1, onChange },
        () => [h(Checkbox, { value: 'a', label: 'A' }), h(Checkbox, { value: 'b', label: 'B' })],
      ),
    )
    const inputs = wrapper.findAll('input[type="checkbox"]')

    expect(inputs[0].element.checked).toBe(true)
    expect(inputs[1].attributes('disabled')).toBeDefined()
    expect(wrapper.find('input[type="hidden"][name="checks"]').element.value).toBe('a')

    await inputs[0].setValue(false)

    expect(onChange).toHaveBeenLastCalledWith([])
    expect(wrapper.find('input[type="hidden"][name="checks"]').element.value).toBe('')
    expect(wrapper.findAll('input[type="checkbox"]')[1].attributes('disabled')).toBeUndefined()
  })

  it('Checkbox.Card provides checked state to Checkbox.Indicator', async () => {
    const wrapper = withProvider(() =>
      h(CheckboxCard, { value: 'card' }, () => [
        h(CheckboxIndicator, { 'data-testid': 'indicator' }),
        h('span', 'Checkbox card'),
      ]),
    )

    expect(wrapper.find('[data-testid="indicator"]').attributes('data-checked')).toBeUndefined()

    await wrapper.find('[role="checkbox"]').trigger('click')

    expect(wrapper.find('[data-testid="indicator"]').attributes('data-checked')).toBe('true')
  })

  it('Radio.Group controls checked child, shared name and changes value', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(RadioGroup, { defaultValue: 'first', name: 'radios', onChange }, () => [
        h(Radio, { value: 'first', label: 'First' }),
        h(Radio, { value: 'second', label: 'Second' }),
      ]),
    )
    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios[0].element.checked).toBe(true)
    expect(radios[0].attributes('name')).toBe('radios')
    expect(radios[1].attributes('name')).toBe('radios')

    await radios[1].setValue(true)

    expect(onChange).toHaveBeenLastCalledWith('second')
    expect(wrapper.findAll('input[type="radio"]')[1].element.checked).toBe(true)
  })

  it('Radio.Card provides checked state to Radio.Indicator', async () => {
    const wrapper = withProvider(() =>
      h(RadioGroup, { defaultValue: 'first', name: 'radio-cards' }, () => [
        h(RadioCard, { value: 'first' }, () => h(RadioIndicator, { 'data-testid': 'first' })),
        h(RadioCard, { value: 'second' }, () => h(RadioIndicator, { 'data-testid': 'second' })),
      ]),
    )

    expect(wrapper.find('[data-testid="first"]').attributes('data-checked')).toBe('true')
    expect(wrapper.find('[data-testid="second"]').attributes('data-checked')).toBeUndefined()

    await wrapper.findAll('[role="radio"]')[1].trigger('click')

    expect(wrapper.find('[data-testid="first"]').attributes('data-checked')).toBeUndefined()
    expect(wrapper.find('[data-testid="second"]').attributes('data-checked')).toBe('true')
  })

  it('Switch.Group controls children and serializes hidden value', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(SwitchGroup, { defaultValue: ['wifi'], name: 'switches', onChange }, () => [
        h(Switch, { value: 'wifi', label: 'Wi-Fi' }),
        h(Switch, { value: 'bt', label: 'Bluetooth' }),
      ]),
    )
    const switches = wrapper.findAll('input[role="switch"]')

    expect(switches[0].element.checked).toBe(true)
    expect(wrapper.find('input[type="hidden"][name="switches"]').element.value).toBe('wifi')

    await switches[1].setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(['wifi', 'bt'])
    expect(wrapper.find('input[type="hidden"][name="switches"]').element.value).toBe('wifi,bt')
  })

  it('exposes Mantine-like static subcomponents', () => {
    expect((Checkbox as any).Group).toBe(CheckboxGroup)
    expect((Checkbox as any).Indicator).toBe(CheckboxIndicator)
    expect((Checkbox as any).Card).toBe(CheckboxCard)
    expect((Radio as any).Group).toBe(RadioGroup)
    expect((Radio as any).Indicator).toBe(RadioIndicator)
    expect((Radio as any).Card).toBe(RadioCard)
    expect((Switch as any).Group).toBe(SwitchGroup)
  })
})
