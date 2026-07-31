import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import {
  Day,
  AmPmInput,
  DateInput,
  DatePicker,
  MiniCalendar,
  SpinInput,
  TimeGrid,
  TimeInput,
  assignTime,
  clampDate,
  compareTime,
  getDefaultClampedDate,
  getEndOfWeek,
  getStartOfWeek,
  getTimeRange,
  getTimeString,
  isSameDate,
  timeToSeconds,
  padTime,
  toDateString,
} from '../index'

describe('@mantine-vue/dates v-model', () => {
  it('binds native and segmented time inputs in both directions', async () => {
    const nativeTime = ref('10:15')
    const gridTime = ref<string | null>('10:00')
    const spinValue = ref<number | null>(1)
    const period = ref<string | null>('AM')
    const wrapper = mount({
      components: { AmPmInput, MantineProvider, SpinInput, TimeGrid, TimeInput },
      setup: () => ({ gridTime, nativeTime, period, spinValue }),
      template: `
        <MantineProvider env="test">
          <TimeInput v-model="nativeTime" />
          <TimeGrid v-model="gridTime" :data="['10:00', '10:30']" />
          <SpinInput v-model="spinValue" :min="0" :max="23" />
          <AmPmInput v-model="period" :labels="{ am: 'AM', pm: 'PM' }" />
        </MantineProvider>
      `,
    })

    await wrapper.get('input[type="time"]').setValue('11:45')
    await wrapper
      .findAll('button')
      .find((button) => button.text() === '10:30')!
      .trigger('click')
    await wrapper.get('input[role="spinbutton"]').setValue('12')
    await wrapper.get('select').setValue('PM')

    expect(nativeTime.value).toBe('11:45')
    expect(gridTime.value).toBe('10:30')
    expect(spinValue.value).toBe(12)
    expect(period.value).toBe('PM')
  })

  it('binds date controls and reflects external model updates', async () => {
    const date = ref<string | null>('2024-01-15')
    const typedDate = ref<string | null>('2024-01-15')
    const miniDate = ref<string | null>('2024-01-15')
    const wrapper = mount({
      components: { DateInput, DatePicker, MantineProvider, MiniCalendar },
      setup: () => ({ date, miniDate, typedDate }),
      template: `
        <MantineProvider env="test">
          <DatePicker v-model="date" default-date="2024-01-01" />
          <DateInput v-model="typedDate" value-format="YYYY-MM-DD" />
          <MiniCalendar
            v-model="miniDate"
            default-date="2024-01-15"
            :number-of-days="2"
          />
        </MantineProvider>
      `,
    })

    await wrapper
      .findAll('table button')
      .find((button) => button.text() === '20')!
      .trigger('click')
    expect(date.value).toBe('2024-01-20')

    typedDate.value = '2024-02-03'
    await nextTick()
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2024-02-03')

    await wrapper.get('[aria-label="2024-01-16"]').trigger('click')
    expect(miniDate.value).toBe('2024-01-16')
  })
})

describe('TimePicker 9.5 duration support', () => {
  it('formats hour values greater than 9999 without truncation', () => {
    expect(padTime(10_000)).toBe('10000')
    expect(getTimeString({ hours: 10_000, minutes: 5 })).toEqual({
      valid: true,
      value: '10000:05',
    })
  })
})

describe('@mantine-vue/dates utilities', () => {
  it('normalizes dates to date strings', () => {
    expect(toDateString(new Date('2024-02-03T10:00:00'))).toBe('2024-02-03')
    expect(toDateString(null)).toBe(null)
  })

  it('clamps dates to min and max dates', () => {
    expect(clampDate('2024-01-01', '2024-02-01', '2024-03-01')).toBe('2024-02-01')
    expect(clampDate('2024-04-01', '2024-02-01', '2024-03-01')).toBe('2024-03-01')
    expect(getDefaultClampedDate({ defaultDate: '2024-02-15' })).toBe('2024-02-15')
  })

  it('matches Mantine week calculations', () => {
    expect(getStartOfWeek('2024-05-15', 1)).toBe('2024-05-13')
    expect(getEndOfWeek('2024-05-15', 1)).toBe('2024-05-19')
  })

  it('assigns time and compares time values', () => {
    const assigned = assignTime('2024-01-01', '2024-01-02T12:30:10')
    expect([assigned.getFullYear(), assigned.getMonth(), assigned.getDate()]).toEqual([2024, 0, 1])
    expect([assigned.getHours(), assigned.getMinutes(), assigned.getSeconds()]).toEqual([
      12, 30, 10,
    ])
    expect(timeToSeconds('01:02:03')).toBe(3723)
    expect(compareTime('12:00', '11:30')).toBeGreaterThan(0)
    expect(getTimeRange('10:00', '11:00', 1800)).toEqual(['10:00', '10:30', '11:00'])
  })

  it('compares dates by day', () => {
    expect(isSameDate('2024-01-01', '2024-01-01T20:00:00')).toBe(true)
  })
})

describe('@mantine-vue/dates render slots', () => {
  it('supports renderDay slot and keeps the renderDay prop authoritative', () => {
    const slotted = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Day,
            { date: '2024-01-02', static: true },
            { renderDay: ({ date }: any) => h('span', { class: 'day-slot' }, date) },
          ),
        ),
    })
    expect(slotted.get('.day-slot').text()).toBe('2024-01-02')

    const withProp = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(
            Day,
            {
              date: '2024-01-02',
              static: true,
              renderDay: () => h('span', { class: 'day-prop' }, 'Prop'),
            },
            { renderDay: () => h('span', { class: 'day-slot' }, 'Slot') },
          ),
        ),
    })
    expect(withProp.find('.day-prop').exists()).toBe(true)
    expect(withProp.find('.day-slot').exists()).toBe(false)
  })
})
