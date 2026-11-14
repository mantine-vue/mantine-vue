import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  QuarterPicker,
  QuarterPickerInput,
  QuartersList,
  getQuarterInTabOrder,
  getQuarterStart,
  getQuartersData,
  isQuarterDisabled,
  normalizeQuarterValue,
} from '../index'
import { cleanupRenderedComponents, render, press, headerLabels } from './test-utils'

cleanupRenderedComponents()

describe('@mantine-vue/dates quarter utils', () => {
  it('returns quarter start', () => {
    expect(getQuarterStart('2024-05-17')).toBe('2024-04-01')
    expect(getQuarterStart('2024-12-31')).toBe('2024-10-01')
    expect(getQuarterStart('2024-01-01')).toBe('2024-01-01')
  })

  it('normalizes quarter values', () => {
    expect(normalizeQuarterValue('2024-08-15')).toBe('2024-07-01')
    expect(normalizeQuarterValue(['2024-02-02', null])).toEqual(['2024-01-01', null])
    expect(normalizeQuarterValue(null)).toBe(null)
    expect(normalizeQuarterValue(undefined)).toBe(undefined)
  })

  it('returns quarters data and disabled state', () => {
    expect(getQuartersData('2024-06-01')).toEqual([
      ['2024-01-01', '2024-04-01', '2024-07-01', '2024-10-01'],
    ])
    expect(
      isQuarterDisabled({ quarter: '2024-01-01', minDate: '2024-02-10', maxDate: undefined }),
    ).toBe(false)
    expect(
      isQuarterDisabled({ quarter: '2023-10-01', minDate: '2024-02-10', maxDate: undefined }),
    ).toBe(true)
    expect(
      isQuarterDisabled({ quarter: '2024-10-01', minDate: undefined, maxDate: '2024-09-30' }),
    ).toBe(true)
  })

  it('returns quarter in tab order', () => {
    const quarters = getQuartersData('2024-01-01')
    expect(
      getQuarterInTabOrder({
        quarters,
        minDate: undefined,
        maxDate: undefined,
        getQuarterControlProps: (quarter) => ({ selected: quarter === '2024-07-01' }),
      }),
    ).toBe('2024-07-01')
    expect(
      getQuarterInTabOrder({
        quarters,
        minDate: '2024-05-01',
        maxDate: undefined,
        getQuarterControlProps: undefined,
      }),
    ).toBe('2024-04-01')
  })
})

describe('@mantine-vue/dates QuarterPicker', () => {
  it('renders quarters and selects the first day of the quarter', async () => {
    const onChange = vi.fn()
    render(QuarterPicker, { defaultDate: '2024-01-01', onChange })
    const quarters = Array.from(document.querySelectorAll<HTMLButtonElement>('table button'))
    expect(quarters.map((node) => node.textContent)).toEqual(['Q1', 'Q2', 'Q3', 'Q4'])
    quarters[2].click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2024-07-01')
    expect(quarters[2].hasAttribute('data-selected')).toBe(true)

    quarters[2].click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('normalizes controlled value to the quarter start', () => {
    render(QuarterPicker, { modelValue: '2024-05-20', defaultDate: '2024-01-01' })
    const quarters = document.querySelectorAll<HTMLButtonElement>('table button')
    expect(quarters[1].hasAttribute('data-selected')).toBe(true)
  })

  it('supports range selection', async () => {
    const onChange = vi.fn()
    render(QuarterPicker, { type: 'range', defaultDate: '2024-01-01', onChange })
    const quarters = document.querySelectorAll<HTMLButtonElement>('table button')
    quarters[0].click()
    await nextTick()
    quarters[2].click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith(['2024-01-01', '2024-07-01'])
    expect(quarters[1].hasAttribute('data-in-range')).toBe(true)
  })

  it('disables quarters outside of min and max dates', () => {
    render(QuarterPicker, {
      defaultDate: '2024-01-01',
      minDate: '2024-04-15',
      maxDate: '2024-08-01',
    })
    const quarters = document.querySelectorAll<HTMLButtonElement>('table button')
    expect(Array.from(quarters).map((node) => node.disabled)).toEqual([true, false, false, true])
  })

  it('changes level to decade and back', async () => {
    render(QuarterPicker, { defaultDate: '2024-01-01' })
    document.querySelector<HTMLButtonElement>('button[data-level-control]')!.click()
    await nextTick()
    expect(document.body.textContent).toContain('2020 – 2029')
    const year = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
      (node) => node.textContent === '2026',
    )!
    year.click()
    await nextTick()
    expect(headerLabels()).toEqual(['2026'])
  })

  it('switches year with arrow navigation off the quarters list', async () => {
    render(QuarterPicker, { defaultDate: '2024-01-01' })
    const quarters = document.querySelectorAll<HTMLButtonElement>('table button')
    quarters[3].focus()
    await press(quarters[3], 'ArrowRight')
    expect(headerLabels()).toEqual(['2025'])
    expect(document.activeElement?.textContent).toBe('Q1')
  })

  it('supports presets', async () => {
    const onChange = vi.fn()
    render(QuarterPicker, {
      defaultDate: '2024-01-01',
      onChange,
      presets: [{ value: '2023-08-10', label: 'Last year Q3' }],
    })
    document.querySelector<HTMLButtonElement>('[data-preset]')!.click()
    await nextTick()
    expect(onChange).toHaveBeenCalledWith('2023-07-01')
    expect(headerLabels()).toEqual(['2023'])
  })

  it('renders formatted value in QuarterPickerInput', () => {
    render(QuarterPickerInput, { label: 'Pick quarter', defaultValue: '2024-05-10' })
    expect(document.body.textContent).toContain('Q2 2024')
  })

  it('renders QuartersList with custom format', () => {
    render(QuartersList, { year: '2024-01-01', quartersListFormat: '[Quarter] Q' })
    expect(document.querySelector('table button')?.textContent).toBe('Quarter 1')
  })
})
