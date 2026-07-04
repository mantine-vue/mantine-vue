import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Rating } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Rating, props)),
  })
}

describe('@mantine-vue/core Rating', () => {
  it('renders radio inputs and checked value', () => {
    const wrapper = withProvider({ defaultValue: 3, name: 'rating' })
    const inputs = wrapper.findAll('input[type="radio"]')

    expect(inputs.length).toBe(6)
    expect(inputs.find((input) => input.element.value === '3')?.element.checked).toBe(true)
    expect(inputs[1].attributes('name')).toBe('rating')
  })

  it('changes value by clicking label and supports allowClear', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider({ defaultValue: 3, allowClear: true, onChange })
    const third = wrapper
      .findAll('input[type="radio"]')
      .find((input) => input.element.value === '3')!

    await third.element.nextElementSibling?.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    )
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('supports fractions and aria labels', () => {
    const wrapper = withProvider({
      fractions: 2,
      getSymbolLabel: (value: number) => `${value} stars`,
    })
    const inputs = wrapper.findAll('input[type="radio"]')

    expect(inputs.find((input) => input.element.value === '0.5')).toBeTruthy()
    expect(inputs.find((input) => input.element.value === '2')?.attributes('aria-label')).toBe(
      '2 stars',
    )
  })

  it('does not render inputs in readOnly mode and supports custom symbols', () => {
    const wrapper = withProvider({
      readOnly: true,
      value: 2,
      fullSymbol: (value: number) => h('span', { class: 'full-symbol' }, `F${value}`),
      emptySymbol: 'E',
    })

    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0)
    expect(wrapper.findAll('.full-symbol').length).toBeGreaterThanOrEqual(2)
  })

  it('throws on negative fractions', () => {
    expect(() => withProvider({ fractions: -2 })).toThrow()
  })
})
