import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, PinInput } from '../../index'

function withProvider(props: Record<string, any>) {
  const target = document.createElement('div')
  document.body.appendChild(target)

  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => h(PinInput, props)),
    },
    { attachTo: target },
  )
}

function getInputs(wrapper: ReturnType<typeof withProvider>) {
  return wrapper.findAll('input.mantine-PinInput-input')
}

function getInputWrappers(wrapper: ReturnType<typeof withProvider>) {
  return wrapper.findAll('.mantine-PinInput-pinInput')
}

function getInputValues(wrapper: ReturnType<typeof withProvider>) {
  return getInputs(wrapper).map((input) => (input.element as HTMLInputElement).value)
}

function getRoot(wrapper: ReturnType<typeof withProvider>) {
  return wrapper.find('.mantine-PinInput-root')
}

describe('@mantine-vue/core PinInput', () => {
  it('renders correct number of inputs and default values', () => {
    const wrapper = withProvider({ length: 5, defaultValue: '123' })

    expect(getInputs(wrapper)).toHaveLength(5)
    expect(getInputValues(wrapper)).toEqual(['1', '2', '3', '', ''])
  })

  it('renders controlled value', async () => {
    const wrapper = withProvider({ length: 4, value: 'ab' })

    expect(getInputValues(wrapper)).toEqual(['a', 'b', '', ''])
  })

  it('sets root size variable based on size prop', () => {
    const wrapper = withProvider({ size: 'xl' })

    expect(getRoot(wrapper).element.style.getPropertyValue('--pin-input-size')).toBe(
      'var(--pin-input-size-xl)',
    )
  })

  it('updates root size variable when size changes', async () => {
    const size = ref('sm')
    const target = document.createElement('div')
    document.body.appendChild(target)
    const wrapper = mount(
      {
        render: () => h(MantineProvider, { env: 'test' }, () => h(PinInput, { size: size.value })),
      },
      { attachTo: target },
    )

    expect(getRoot(wrapper).element.style.getPropertyValue('--pin-input-size')).toBe(
      'var(--pin-input-size-sm)',
    )

    size.value = 'xl'
    await nextTick()

    expect(getRoot(wrapper).element.style.getPropertyValue('--pin-input-size')).toBe(
      'var(--pin-input-size-xl)',
    )
  })

  it('sets input padding variable to 0 on input wrappers', () => {
    const wrapper = withProvider({ length: 2 })

    expect(getInputWrappers(wrapper)).toHaveLength(2)
    getInputWrappers(wrapper).forEach((inputWrapper) => {
      expect(inputWrapper.element.style.getPropertyValue('--input-padding')).toBe('0')
      expect(inputWrapper.element.style.getPropertyValue('--input-text-align')).toBe('center')
    })
  })

  it('calls onChange with joined value and onComplete once', async () => {
    const onChange = vi.fn()
    const onComplete = vi.fn()
    const wrapper = withProvider({ length: 2, onChange, onComplete })
    const inputs = getInputs(wrapper)

    await inputs[0].setValue('1')
    expect(onChange).toHaveBeenLastCalledWith('1')
    expect(onComplete).not.toHaveBeenCalled()

    await inputs[1].setValue('2')
    expect(onChange).toHaveBeenLastCalledWith('12')
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith('12')
  })

  it('validates numeric input', async () => {
    const wrapper = withProvider({ length: 4, type: 'number' })
    const inputs = getInputs(wrapper)

    await inputs[0].setValue('a')
    expect(getInputValues(wrapper)[0]).toBe('')

    await inputs[0].setValue('5')
    expect(getInputValues(wrapper)[0]).toBe('5')
  })

  it('moves focus to the next input after valid input', async () => {
    const wrapper = withProvider({ length: 4 })
    const inputs = getInputs(wrapper)
    const focusNext = vi.spyOn(inputs[1].element as HTMLInputElement, 'focus')

    await inputs[0].setValue('x')

    expect(focusNext).toHaveBeenCalled()
  })

  it('does not move focus when manageFocus is false', async () => {
    const wrapper = withProvider({ length: 4, manageFocus: false })
    const inputs = getInputs(wrapper)
    const focusNext = vi.spyOn(inputs[1].element as HTMLInputElement, 'focus')

    await inputs[0].setValue('x')

    expect(focusNext).not.toHaveBeenCalled()
  })

  it('handles paste and updates hidden input value', async () => {
    const wrapper = withProvider({ length: 4, name: 'pin', form: 'auth' })
    const firstInput = getInputs(wrapper)[0]

    await firstInput.trigger('paste', {
      clipboardData: { getData: () => '1 2 3 4' },
    })

    const hidden = wrapper.find('input[type="hidden"]')

    expect(getInputValues(wrapper)).toEqual(['1', '2', '3', '4'])
    expect(hidden.attributes('name')).toBe('pin')
    expect(hidden.attributes('form')).toBe('auth')
    expect((hidden.element as HTMLInputElement).value).toBe('1234')
  })

  it('sets mask, readonly, disabled, autocomplete, and custom input props', () => {
    const wrapper = withProvider({
      length: 2,
      mask: true,
      readOnly: true,
      disabled: true,
      oneTimeCode: false,
      getInputProps: (index: number) => ({ 'data-index': index }),
    })

    getInputs(wrapper).forEach((input, index) => {
      expect(input.attributes('type')).toBe('password')
      expect(input.attributes('readonly')).toBeDefined()
      expect(input.attributes('disabled')).toBeDefined()
      expect(input.attributes('autocomplete')).toBe('off')
      expect(input.attributes('data-index')).toBe(String(index))
    })
  })
})
