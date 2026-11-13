import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  Month,
  WeekPicker,
  WeekPickerInput,
  getWeekFormatter,
  getWeekInTabOrder,
  normalizeWeekValue,
} from '../index'
import { cleanupRenderedComponents, render, press, getDay, headerLabels } from './test-utils'

cleanupRenderedComponents()

describe('@mantine-vue/dates week utils', () => {
  it('normalizes week values', () => {
    expect(normalizeWeekValue('2022-04-14', 1)).toBe('2022-04-11')
    expect(normalizeWeekValue('2022-04-14', 0)).toBe('2022-04-10')
    expect(normalizeWeekValue(['2022-04-14', null], 1)).toEqual(['2022-04-11', null])
  })

  it('formats week values', () => {
    const formatter = getWeekFormatter(1)
    const base = { locale: 'en', format: 'MMM D, YYYY', labelSeparator: '–' }
    expect(formatter({ ...base, type: 'default', date: '2022-04-11' })).toBe(
      'Apr 11, 2022 – Apr 17, 2022',
    )
    expect(formatter({ ...base, type: 'range', date: ['2022-04-11', '2022-04-18'] })).toBe(
      'Apr 11, 2022 – Apr 24, 2022',
    )
    expect(formatter({ ...base, type: 'default', date: null })).toBe('')
  })

  it('returns week in tab order', () => {
    const dates = [
      [
        '2026-03-02',
        '2026-03-03',
        '2026-03-04',
        '2026-03-05',
        '2026-03-06',
        '2026-03-07',
        '2026-03-08',
      ],
      [
        '2026-03-09',
        '2026-03-10',
        '2026-03-11',
        '2026-03-12',
        '2026-03-13',
        '2026-03-14',
        '2026-03-15',
      ],
    ]
    expect(
      getWeekInTabOrder({
        dates,
        isDayDisabled: () => false,
        getWeekControlProps: (weekStart) => ({ selected: weekStart === '2026-03-09' }),
      }),
    ).toBe(1)
    expect(
      getWeekInTabOrder({ dates, isDayDisabled: () => true, getWeekControlProps: undefined }),
    ).toBe(-1)
  })
})

describe('@mantine-vue/dates Month week controls', () => {
  it('renders week numbers as text by default', () => {
    render(Month, { month: '2022-04-11', withWeekNumbers: true })
    expect(document.querySelectorAll('[data-week-control]')).toHaveLength(0)
  })

  it('renders week controls and removes days from tab order', () => {
    render(Month, { month: '2022-04-11', withWeekNumbers: true, __withWeekControls: true })
    const controls = document.querySelectorAll('[data-week-control]')
    expect(controls).toHaveLength(5)
    expect(controls[0].textContent).toBe('13')
    expect(controls[0].getAttribute('tabindex')).toBe('0')
    expect(controls[1].getAttribute('tabindex')).toBe('-1')
    document
      .querySelectorAll('table button:not([data-week-control])')
      .forEach((day) => expect(day.getAttribute('tabindex')).toBe('-1'))
  })

  it('forwards week control props and disables weeks without enabled days', () => {
    render(Month, {
      month: '2022-04-11',
      withWeekNumbers: true,
      __withWeekControls: true,
      minDate: '2022-04-05',
      maxDate: '2022-04-20',
      __getWeekControlProps: (weekStart: string) => ({
        selected: weekStart === '2022-04-11',
        'aria-label': `week ${weekStart}`,
      }),
    })
    const controls = document.querySelectorAll<HTMLButtonElement>('[data-week-control]')
    expect(controls[0].disabled).toBe(true)
    expect(controls[4].disabled).toBe(true)
    expect(controls[2].hasAttribute('data-selected')).toBe(true)
    expect(controls[2].getAttribute('tabindex')).toBe('0')
    expect(controls[2].getAttribute('aria-label')).toBe('week 2022-04-11')
  })
})

describe('@mantine-vue/dates WeekPicker', () => {
  it('selects the first day of the week when any day is clicked', async () => {
    const onChange = vi.fn()
    render(WeekPicker, { defaultDate: '2022-04-11', onChange })
    getDay('14 April 2022')!.click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2022-04-11')
    expect(getDay('11 April 2022')!.hasAttribute('data-selected')).toBe(true)
    expect(getDay('17 April 2022')!.hasAttribute('data-selected')).toBe(true)
    expect(getDay('18 April 2022')!.hasAttribute('data-selected')).toBe(false)
  })

  it('respects firstDayOfWeek', async () => {
    const onChange = vi.fn()
    render(WeekPicker, { defaultDate: '2022-04-11', firstDayOfWeek: 0, onChange })
    getDay('14 April 2022')!.click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2022-04-10')
  })

  it('renders week controls that select weeks', async () => {
    const onChange = vi.fn()
    render(WeekPicker, { defaultDate: '2022-04-11', onChange })
    const controls = document.querySelectorAll<HTMLButtonElement>('[data-week-control]')
    expect(controls.length).toBeGreaterThan(3)
    expect(controls[2].getAttribute('aria-label')).toBe('11 April 2022 – 17 April 2022')
    controls[2].click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2022-04-11')
    expect(controls[2].hasAttribute('data-selected')).toBe(true)
  })

  it('moves focus between week controls across months', async () => {
    render(WeekPicker, { defaultDate: '2022-04-11' })
    const controls = document.querySelectorAll<HTMLButtonElement>('[data-week-control]')
    controls[0].focus()
    await press(controls[0], 'ArrowUp')
    expect(headerLabels()).toEqual(['March 2022'])
    expect(document.activeElement?.hasAttribute('data-week-control')).toBe(true)
  })

  it('supports range selection', async () => {
    const onChange = vi.fn()
    render(WeekPicker, { defaultDate: '2022-04-11', type: 'range', onChange })
    getDay('5 April 2022')!.click()
    await nextTick()
    getDay('20 April 2022')!.click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith(['2022-04-04', '2022-04-18'])
    expect(getDay('13 April 2022')!.hasAttribute('data-in-range')).toBe(true)
  })

  it('formats WeekPickerInput value', () => {
    render(WeekPickerInput, { label: 'Pick week', defaultValue: '2022-04-13' })
    expect(document.body.textContent).toContain('Apr 11, 2022 – Apr 17, 2022')
  })
})
