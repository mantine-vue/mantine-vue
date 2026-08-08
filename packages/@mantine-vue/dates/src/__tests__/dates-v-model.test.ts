import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import {
  AmPmInput,
  Calendar,
  DateInput,
  DatePicker,
  DatePickerInput,
  DateTimePicker,
  MiniCalendar,
  MonthPicker,
  MonthPickerInput,
  SpinInput,
  TimeGrid,
  TimeInput,
  TimePicker,
  YearPicker,
  YearPickerInput,
} from '../index'

const mounted: Array<ReturnType<typeof mount>> = []
afterEach(() => mounted.splice(0).forEach((wrapper) => wrapper.unmount()))

const flush = async () => {
  for (let index = 0; index < 5; index += 1) {
    await nextTick()
  }
}

function render(component: any, props: Record<string, any>) {
  const wrapper = mount(
    { render: () => h(MantineProvider, { env: 'test' }, () => h(component, props)) },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return wrapper
}

/** Every component that carries a value is bound with `v-model`, never `value`/`onChange`. */
const VALUE_COMPONENTS: Array<[string, any]> = [
  ['DatePicker', DatePicker],
  ['MonthPicker', MonthPicker],
  ['YearPicker', YearPicker],
  ['DatePickerInput', DatePickerInput],
  ['MonthPickerInput', MonthPickerInput],
  ['YearPickerInput', YearPickerInput],
  ['DateInput', DateInput],
  ['DateTimePicker', DateTimePicker],
  ['MiniCalendar', MiniCalendar],
  ['TimeInput', TimeInput],
  ['TimeGrid', TimeGrid],
  ['TimePicker', TimePicker],
  ['SpinInput', SpinInput],
  ['AmPmInput', AmPmInput],
]

describe('@mantine-vue/dates v-model surface', () => {
  it.each(VALUE_COMPONENTS)(
    '%s declares modelValue and no legacy value/onChange',
    (_name, component) => {
      const declared = Object.keys((component as any).props ?? {})

      expect(declared).toContain('modelValue')
      expect(declared).not.toContain('value')
      expect(declared).not.toContain('onChange')
      expect((component as any).emits).toEqual(
        expect.arrayContaining(['update:modelValue', 'change']),
      )
    },
  )

  it('Calendar reports navigation through emits rather than callback props', () => {
    const declared = Object.keys((Calendar as any).props ?? {})

    expect(declared).not.toContain('onLevelChange')
    expect(declared).not.toContain('onDateChange')
    expect((Calendar as any).emits).toEqual(
      expect.arrayContaining(['update:level', 'level-change', 'update:date', 'date-change']),
    )
  })

  it('drives DatePicker selection through v-model', async () => {
    const value = ref<any>(null)
    const wrapper = render(DatePicker, {
      modelValue: value.value,
      'onUpdate:modelValue': (next: any) => (value.value = next),
      defaultDate: '2024-03-05',
    })
    await flush()

    const day = wrapper.findAll('table button').find((button) => button.text() === '12')
    await day!.trigger('click')
    await flush()

    expect(value.value).toBe('2024-03-12')
  })

  it('drives TimePicker through v-model, including the nested number fields', async () => {
    const value = ref('10:30:00')
    const wrapper = render(TimePicker, {
      modelValue: value.value,
      'onUpdate:modelValue': (next: string) => (value.value = next),
    })
    await flush()

    const fields = wrapper.findAll('input')
    expect((fields[0].element as HTMLInputElement).value).toBe('10')

    await fields[0].setValue('08')
    await flush()

    expect(value.value.startsWith('08')).toBe(true)
  })

  it('automatically advances focus from hours to minutes after two digits', async () => {
    const wrapper = render(TimePicker, {})
    await flush()
    const fields = wrapper.findAll('input[role="spinbutton"]')

    ;(fields[0].element as HTMLInputElement).focus()
    await fields[0].setValue('12')
    await flush()

    expect(document.activeElement).toBe(fields[1].element)
  })

  it('rejects nonnumeric characters in segmented time fields', async () => {
    const wrapper = render(TimePicker, {})
    await flush()
    const hours = wrapper.get('input[role="spinbutton"]')

    await hours.setValue('abc')
    await flush()

    expect((hours.element as HTMLInputElement).value).toBe('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it.each([
    ['hours', 0, ['', '34', '56']],
    ['minutes', 1, ['12', '', '56']],
    ['seconds', 2, ['12', '34', '']],
  ] as const)('clears only the %s field on Backspace', async (_name, index, expected) => {
    const changes: string[] = []
    const wrapper = render(TimePicker, {
      defaultValue: '12:34:56',
      withSeconds: true,
      'onUpdate:modelValue': (next: string) => changes.push(next),
    })
    await flush()
    const fields = wrapper.findAll('input[role="spinbutton"]')

    await fields[index].trigger('keydown', { key: 'Backspace' })
    await flush()

    expect(fields.map((field) => (field.element as HTMLInputElement).value)).toEqual(expected)
    expect(changes).toEqual([''])
  })

  it('clears only AM/PM on Backspace and then moves focus to the previous field', async () => {
    const wrapper = render(TimePicker, { defaultValue: '12:34 PM', format: '12h' })
    await flush()
    const fields = wrapper.findAll('input[role="spinbutton"]')
    const amPm = wrapper.get('select[data-am-pm]')

    await amPm.trigger('keydown', { key: 'Backspace' })
    await flush()

    expect(fields.map((field) => (field.element as HTMLInputElement).value)).toEqual(['12', '34'])
    expect((amPm.element as HTMLSelectElement).value).toBe('')

    await amPm.trigger('keydown', { key: 'Backspace' })
    expect(document.activeElement).toBe(fields[1].element)
  })
})

describe('@mantine-vue/dates dropdown dismissal', () => {
  /**
   * `Popover` reports a dismissal through `update:opened`. While the pickers still listened
   * for a `change` prop that `Popover` no longer has, a controlled dropdown had no way back
   * to closed and stayed open on Escape and on click outside.
   */
  it('closes the DatePickerInput dropdown on Escape', async () => {
    const wrapper = render(DatePickerInput, { popoverProps: { withinPortal: false } })
    await flush()
    expect(document.querySelector('.mantine-Popover-dropdown')).toBeNull()

    await wrapper.find('button').trigger('click')
    await flush()
    const dropdown = document.querySelector('.mantine-Popover-dropdown')
    expect(dropdown).not.toBeNull()

    dropdown!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flush()

    expect(document.querySelector('.mantine-Popover-dropdown')).toBeNull()
  })
})
