import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, NumberFormatter, NumberInput, formatNumber } from '../../index'

function withProvider(component: any, options: Record<string, any> = {}) {
  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => component()),
    },
    options,
  )
}

async function waitForInputFormatting() {
  await new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
  await nextTick()
}

describe('@mantine-vue/core NumberFormatter', () => {
  it('formats numbers with separators, decimal scale, prefix and suffix', () => {
    expect(
      formatNumber(1000000.5, {
        thousandSeparator: ',',
        decimalScale: 2,
        fixedDecimalScale: true,
        prefix: '$',
        suffix: ' USD',
      }),
    ).toBe('$1,000,000.50 USD')
    expect(formatNumber(100000, { thousandSeparator: ',', thousandsGroupStyle: 'lakh' })).toBe(
      '1,00,000',
    )
  })

  it('renders formatted text and nothing for undefined values', () => {
    const wrapper = withProvider(() =>
      h('div', [
        h(NumberFormatter, { value: 1234, thousandSeparator: ',' }),
        h(NumberFormatter, { value: undefined }),
      ]),
    )

    expect(wrapper.find('span').text()).toBe('1,234')
  })
})

describe('@mantine-vue/core NumberInput', () => {
  it('parses input changes and formats display value', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(NumberInput, { onChange, thousandSeparator: ',', prefix: '$' }),
    )
    const input = wrapper.find('input')

    await input.setValue('1234')

    expect(onChange).toHaveBeenLastCalledWith(1234)
    expect((input.element as HTMLInputElement).value).toBe('$1,234')
  })

  it('supports increment/decrement controls and handlersRef', async () => {
    const onChange = vi.fn()
    const handlersRef = ref<any>(null)
    const wrapper = withProvider(() =>
      h(NumberInput, { defaultValue: 2, step: 3, onChange, handlersRef }),
    )
    const controls = wrapper.findAll('.mantine-NumberInput-control')

    await controls[0].trigger('pointerdown')
    expect(onChange).toHaveBeenLastCalledWith(5)

    await controls[1].trigger('pointerdown')
    expect(onChange).toHaveBeenLastCalledWith(2)

    handlersRef.value.increment()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('steps with keyboard and respects max callback', async () => {
    const onChange = vi.fn()
    const onMaxReached = vi.fn()
    const wrapper = withProvider(() =>
      h(NumberInput, {
        defaultValue: 9,
        min: 0,
        max: 10,
        step: 2,
        onChange,
        onMaxReached,
      }),
    )
    const input = wrapper.find('input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(10)
    expect(onMaxReached).toHaveBeenCalledTimes(1)

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith(8)
  })

  it('clamps value on blur and trims leading zeros', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() => h(NumberInput, { min: 5, max: 10, onChange }))
    const input = wrapper.find('input')

    await input.setValue('001')
    await input.trigger('blur')

    expect(onChange).toHaveBeenLastCalledWith(5)
    expect((input.element as HTMLInputElement).value).toBe('5')
  })

  it('hides controls when readOnly is set', () => {
    const wrapper = withProvider(() => h(NumberInput, { readOnly: true }))

    expect(wrapper.find('.mantine-NumberInput-controls').exists()).toBe(false)
  })

  it('prevents out of range values with strict clampBehavior', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() =>
      h(NumberInput, { defaultValue: 10, max: 10, clampBehavior: 'strict', onChange }),
    )
    const input = wrapper.find('input')

    await input.setValue('100')
    await waitForInputFormatting()

    expect(onChange).not.toHaveBeenCalled()
    expect((input.element as HTMLInputElement).value).toBe('10')
  })

  it('restores rejected strict values without waiting for delayed formatting', async () => {
    const wrapper = withProvider(() =>
      h(NumberInput, { defaultValue: 10, max: 10, clampBehavior: 'strict' }),
    )
    const input = wrapper.find('input')

    await input.setValue('100')

    expect((input.element as HTMLInputElement).value).toBe('10')
  })

  it('keeps suffix fixed while typing', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() => h(NumberInput, { suffix: '%', onChange }))
    const input = wrapper.find('input')

    await input.setValue('1%2%1%2%1%')
    await waitForInputFormatting()

    expect(onChange).toHaveBeenLastCalledWith(12121)
    expect((input.element as HTMLInputElement).value).toBe('12121%')
  })

  it('keeps caret out of prefix and suffix on focus and click', async () => {
    const wrapper = withProvider(() =>
      h(NumberInput, { defaultValue: 123, prefix: '$', suffix: '%' }),
    )
    const input = wrapper.find('input')
    const element = input.element as HTMLInputElement

    element.setSelectionRange(0, 0)
    await input.trigger('focus')
    await waitForInputFormatting()

    expect(element.selectionStart).toBe(1)
    expect(element.selectionEnd).toBe(1)

    element.setSelectionRange(element.value.length, element.value.length)
    await input.trigger('click')
    await waitForInputFormatting()

    expect(element.selectionStart).toBe(4)
    expect(element.selectionEnd).toBe(4)
  })

  it('does not allow negative values when allowNegative is false', async () => {
    const wrapper = withProvider(() => h(NumberInput, { allowNegative: false }))
    const input = wrapper.find('input')

    await input.setValue('-')
    await waitForInputFormatting()

    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('respects allowDecimal and decimalScale', async () => {
    const integerWrapper = withProvider(() => h(NumberInput, { allowDecimal: false }))
    const integerInput = integerWrapper.find('input')

    await integerInput.setValue('1.2')
    await waitForInputFormatting()

    expect((integerInput.element as HTMLInputElement).value).toBe('1')

    const scaleWrapper = withProvider(() => h(NumberInput, { decimalScale: 2 }))
    const scaleInput = scaleWrapper.find('input')

    await scaleInput.setValue('1.234')
    await waitForInputFormatting()

    expect((scaleInput.element as HTMLInputElement).value).toBe('1.23')
  })

  it('supports fixedDecimalScale', async () => {
    const wrapper = withProvider(() =>
      h(NumberInput, { defaultValue: 1, decimalScale: 2, fixedDecimalScale: true }),
    )

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('1.00')
  })

  it('allows editing partial values with fixedDecimalScale', async () => {
    const wrapper = withProvider(() => h(NumberInput, { decimalScale: 2, fixedDecimalScale: true }))
    const input = wrapper.find('input')

    await input.trigger('focus')

    await input.setValue('1')
    expect((input.element as HTMLInputElement).value).toBe('1')

    await input.setValue('1.')
    expect((input.element as HTMLInputElement).value).toBe('1.')

    await input.setValue('1.1')
    expect((input.element as HTMLInputElement).value).toBe('1.1')

    await input.setValue('1.11')
    expect((input.element as HTMLInputElement).value).toBe('1.11')

    await input.setValue('2.')
    expect((input.element as HTMLInputElement).value).toBe('2.')

    await input.setValue('2.2')
    expect((input.element as HTMLInputElement).value).toBe('2.2')

    await input.setValue('2.22')
    expect((input.element as HTMLInputElement).value).toBe('2.22')

    await input.setValue('')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('uses decimalSeparator while typing', async () => {
    const wrapper = withProvider(() => h(NumberInput, { decimalSeparator: ',' }))
    const input = wrapper.find('input')

    await input.setValue('1.')
    await waitForInputFormatting()

    expect((input.element as HTMLInputElement).value).toBe('1,')
  })

  it('trims leading zeroes on blur without min/max', async () => {
    const wrapper = withProvider(() => h(NumberInput))
    const input = wrapper.find('input')

    await input.setValue('001')
    await input.trigger('blur')

    expect((input.element as HTMLInputElement).value).toBe('1')
  })
})
