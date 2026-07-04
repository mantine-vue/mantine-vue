import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { Checkbox, CheckboxIcon, Radio, RadioIcon, Switch, MantineProvider } from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core selection controls', () => {
  it('renders Checkbox with label, description, error and indeterminate state', () => {
    const rootRef = ref<HTMLElement | null>(null)
    const wrapper = withProvider(() =>
      h(Checkbox, {
        id: 'checkbox',
        label: 'Accept',
        description: 'Checkbox description',
        error: 'Checkbox error',
        indeterminate: true,
        rootRef,
      }),
    )
    const input = wrapper.find('input[type="checkbox"]')

    expect(wrapper.text()).toContain('Accept')
    expect(wrapper.text()).toContain('Checkbox description')
    expect(wrapper.text()).toContain('Checkbox error')
    expect(input.attributes('data-indeterminate')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('checkbox-description checkbox-error')
    expect(rootRef.value?.className).toContain('mantine-Checkbox-root')
  })

  it('does not set Checkbox data-error for empty error attribute', () => {
    const wrapper = mount({
      components: { Checkbox, MantineProvider },
      template: `
        <MantineProvider env="test">
          <Checkbox id="empty-error" label="Empty error" error="" />
          <Checkbox id="boolean-error" label="Boolean error" :error="true" />
        </MantineProvider>
      `,
    })

    const emptyErrorInput = wrapper.find('#empty-error')
    const booleanErrorInput = wrapper.find('#boolean-error')

    expect(emptyErrorInput.attributes('data-error')).toBeUndefined()
    expect(emptyErrorInput.attributes('aria-describedby')).toBeUndefined()
    expect(booleanErrorInput.attributes('data-error')).toBeDefined()
  })

  it('renders Radio with checked state and custom icon', () => {
    const wrapper = withProvider(() =>
      h(Radio, {
        id: 'radio',
        label: 'Radio label',
        checked: true,
        value: 'radio-value',
        icon: (attrs: any) =>
          h('span', { ...attrs, class: ['custom-radio-icon', attrs.class] }, 'dot'),
      }),
    )
    const input = wrapper.find('input[type="radio"]')

    expect(input.element.checked).toBe(true)
    expect(input.attributes('value')).toBe('radio-value')
    expect(wrapper.find('.custom-radio-icon').text()).toBe('dot')
  })

  it('toggles uncontrolled Switch and calls onChange', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(Switch, {
        id: 'switch',
        label: 'Switch label',
        onLabel: 'on',
        offLabel: 'off',
        onChange,
      }),
    )
    const input = wrapper.find('input[role="switch"]')

    expect(input.element.checked).toBe(false)
    expect(wrapper.text()).toContain('off')

    await input.setValue(true)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(input.element.checked).toBe(true)
    expect(wrapper.text()).toContain('on')
  })

  it('supports disabled controls and label positions', () => {
    const wrapper = withProvider(() =>
      h('div', [
        h(Checkbox, { disabled: true, label: 'Disabled checkbox', labelPosition: 'left' }),
        h(Radio, { disabled: true, label: 'Disabled radio', labelPosition: 'left' }),
        h(Switch, { disabled: true, label: 'Disabled switch', labelPosition: 'left' }),
      ]),
    )

    expect(wrapper.findAll('input[disabled]')).toHaveLength(3)
    expect(wrapper.findAll('[data-label-position="left"]').length).toBeGreaterThanOrEqual(3)
  })

  it('exposes default icons', () => {
    expect(CheckboxIcon).toBeTruthy()
    expect(RadioIcon).toBeTruthy()
  })
})
