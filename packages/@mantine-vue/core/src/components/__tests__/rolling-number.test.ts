import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  buildValue,
  getDigitParts,
  getRenderSlots,
  MantineProvider,
  RollingNumber,
} from '../../index'

function withProvider(props: Record<string, any>) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(RollingNumber, props)),
  })
}

describe('@mantine-vue/core RollingNumber helpers', () => {
  it('splits numeric values into digit parts', () => {
    expect(getDigitParts({ value: -42 })).toMatchObject({
      negative: true,
      intDigits: ['4', '2'],
      fracDigits: [],
      hasDecimal: false,
    })

    expect(getDigitParts({ value: 1.5, decimalScale: 3, fixedDecimalScale: true })).toMatchObject({
      intDigits: ['1'],
      fracDigits: ['5', '0', '0'],
      hasDecimal: true,
    })
  })

  it('builds accessible formatted values', () => {
    expect(
      buildValue({
        value: 1234.5,
        prefix: '$ ',
        suffix: ' USD',
        thousandSeparator: true,
        decimalScale: 2,
        fixedDecimalScale: true,
      }),
    ).toBe('$ 1,234.50 USD')
  })

  it('creates stable render slots with formatting characters', () => {
    const current = getDigitParts({ value: 1234.5, decimalScale: 1, fixedDecimalScale: true })
    const slots = getRenderSlots({
      current,
      previous: current,
      prefix: '$ ',
      suffix: '%',
      thousandSeparator: true,
      decimalSeparator: ',',
    })

    expect(slots.filter((slot) => slot.type === 'digit')).toHaveLength(5)
    expect(slots.filter((slot) => slot.type === 'char').map((slot: any) => slot.char)).toEqual([
      '$',
      ' ',
      ',',
      ',',
      '%',
    ])
  })
})

describe('@mantine-vue/core RollingNumber', () => {
  it('renders digit columns and static characters', () => {
    const wrapper = withProvider({ value: 1000, prefix: '$ ', thousandSeparator: true })

    expect(wrapper.findAll('.mantine-RollingNumber-digit')).toHaveLength(4)
    expect(
      wrapper.findAll('.mantine-RollingNumber-char').map((node) => node.element.textContent),
    ).toEqual(['$', ' ', ','])
  })

  it('sets accessibility role and label', () => {
    const wrapper = withProvider({
      value: 42,
      prefix: '$ ',
      suffix: ' USD',
      withLiveRegion: true,
    })
    const root = wrapper.find('.mantine-RollingNumber-root')

    expect(root.attributes('role')).toBe('status')
    expect(root.attributes('aria-label')).toBe('$ 42 USD')
  })

  it('sets CSS variables and tabular number modifier', () => {
    const wrapper = withProvider({ value: 1, animationDuration: 1000, timingFunction: 'linear' })
    const root = wrapper.find('.mantine-RollingNumber-root')

    expect(root.attributes('data-tabular-numbers')).toBe('true')
    expect(root.attributes('style')).toContain('--rn-duration: 1000ms')
    expect(root.attributes('style')).toContain('--rn-timing-function: linear')
  })

  it('renders digit column transform and strip cells', () => {
    const wrapper = withProvider({ value: 5 })
    const column = wrapper.find('.mantine-RollingNumber-digitColumn')

    expect(column.attributes('style')).toContain('transform: translateY(-5em)')
    expect(column.findAll('span').map((node) => node.text())).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '1',
    ])
  })

  it('supports non-tabular mode and default img role', () => {
    const wrapper = withProvider({ value: -42, tabularNumbers: false })
    const root = wrapper.find('.mantine-RollingNumber-root')

    expect(root.attributes('role')).toBe('img')
    expect(root.attributes('data-tabular-numbers')).toBeUndefined()
    expect(root.attributes('aria-label')).toBe('-42')
    expect(wrapper.findAll('.mantine-RollingNumber-char').map((node) => node.text())).toContain('-')
  })
})
