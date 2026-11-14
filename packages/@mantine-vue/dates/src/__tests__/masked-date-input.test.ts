import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { MaskedDateInput, buildDateString, getDaysInMonth, parseDateString } from '../index'

const wrappers: VueWrapper[] = []

function render(props: Record<string, any> = {}) {
  const wrapper = mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: () => h(MaskedDateInput, props) },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

const field = (label: string) =>
  document.querySelector<HTMLInputElement>(`[aria-label="${label}"]`)!

async function type(input: HTMLInputElement, value: string) {
  for (const character of value) {
    input.focus()
    input.value = `${input.value === input.placeholder ? '' : input.selectionStart === 0 && input.selectionEnd === input.value.length ? '' : input.value}${character}`
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
  }
}

async function typeFresh(input: HTMLInputElement, value: string) {
  input.focus()
  input.select()
  await type(input, value)
}

describe('@mantine-vue/dates masked date utils', () => {
  it('builds date strings', () => {
    const base = {
      hours: null,
      minutes: null,
      seconds: null,
      withTime: false,
      withSeconds: false,
    }
    expect(buildDateString({ ...base, day: 5, month: 3, year: 2024 })).toEqual({
      valid: true,
      value: '2024-03-05',
    })
    expect(buildDateString({ ...base, day: 31, month: 2, year: 2024 }).valid).toBe(false)
    expect(buildDateString({ ...base, day: 5, month: 3, year: 202 }).valid).toBe(false)
    expect(
      buildDateString({
        ...base,
        day: 5,
        month: 3,
        year: 2024,
        hours: 12,
        minutes: 30,
        withTime: true,
        format: '12h',
        amPm: 'AM',
      }),
    ).toEqual({ valid: true, value: '2024-03-05 00:30:00' })
  })

  it('parses date strings and returns days in month', () => {
    expect(parseDateString('2024-03-05 10:20:30')).toEqual({
      day: 5,
      month: 3,
      year: 2024,
      hours: 10,
      minutes: 20,
      seconds: 30,
    })
    expect(parseDateString('invalid').day).toBe(null)
    expect(getDaysInMonth(2, 2024)).toBe(29)
    expect(getDaysInMonth(null, 2024)).toBe(31)
  })
})

describe('@mantine-vue/dates MaskedDateInput', () => {
  it('renders day, month and year fields by default', () => {
    render()
    expect(field('Day')).toBeTruthy()
    expect(field('Month')).toBeTruthy()
    expect(field('Year')).toBeTruthy()
    expect(document.querySelector('[aria-label="Hours"]')).toBeNull()
  })

  it('renders time fields when withTime is set', () => {
    render({ withTime: true, withSeconds: true, format: '12h' })
    expect(field('Hours')).toBeTruthy()
    expect(field('Minutes')).toBeTruthy()
    expect(field('Seconds')).toBeTruthy()
    expect(document.querySelector('[aria-label="AM/PM"]')).toBeTruthy()
  })

  it('renders fields in correct order with custom separator', () => {
    render({ fieldsOrder: ['year', 'month', 'day'], dateSeparator: '-' })
    const labels = Array.from(document.querySelectorAll('[role="spinbutton"]')).map((node) =>
      node.getAttribute('aria-label'),
    )
    expect(labels).toEqual(['Year', 'Month', 'Day'])
    expect(document.body.textContent).toContain('-')
    expect(field('Year').getAttribute('tabindex')).toBeNull()
    expect(field('Day').getAttribute('tabindex')).toBe('-1')
  })

  it('advances focus and emits YYYY-MM-DD value when all fields are filled', async () => {
    const onChange = vi.fn()
    render({ onChange })
    await typeFresh(field('Day'), '15')
    expect(document.activeElement).toBe(field('Month'))
    await typeFresh(field('Month'), '03')
    expect(document.activeElement).toBe(field('Year'))
    await typeFresh(field('Year'), '2024')
    expect(onChange).toHaveBeenLastCalledWith('2024-03-15')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('emits YYYY-MM-DD HH:mm:ss value with time fields', async () => {
    const onChange = vi.fn()
    render({ onChange, withTime: true, defaultValue: '2024-03-15 10:00:00' })
    await typeFresh(field('Minutes'), '45')
    expect(onChange).toHaveBeenLastCalledWith('2024-03-15 10:45:00')
  })

  it('updates fields when controlled value changes', async () => {
    const value = ref<string | null>('2024-03-15')
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: { default: () => h(MaskedDateInput, { modelValue: value.value }) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    expect(field('Day').value).toBe('15')
    value.value = '2025-12-01'
    await nextTick()
    await nextTick()
    expect(field('Day').value).toBe('01')
    expect(field('Month').value).toBe('12')
    expect(field('Year').value).toBe('2025')
  })

  it('clamps day when month changes to a month with fewer days', async () => {
    const onChange = vi.fn()
    render({ onChange, defaultValue: '2024-01-31' })
    await typeFresh(field('Month'), '02')
    expect(onChange).toHaveBeenLastCalledWith('2024-02-29')
    expect(field('Day').value).toBe('29')
  })

  it('clears all fields and focuses the first field when clear button is clicked', async () => {
    const onChange = vi.fn()
    render({
      onChange,
      clearable: true,
      defaultValue: '2024-03-15',
      fieldsOrder: ['year', 'month', 'day'],
    })
    const clear = document.querySelector<HTMLButtonElement>('.mantine-CloseButton-root, button')!
    clear.click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(field('Day').value).toBe('')
    expect(document.activeElement).toBe(field('Year'))
  })

  it('does not emit out of range date and clamps it on blur', async () => {
    const onChange = vi.fn()
    render({ onChange, maxDate: '2024-06-30', defaultValue: '2024-06-15' })
    await typeFresh(field('Month'), '09')
    expect(onChange).not.toHaveBeenCalledWith('2024-09-15')
    expect(document.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('')
    field('Month').dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2024-06-30')
  })

  it('sets fields from a pasted value', async () => {
    const onChange = vi.fn()
    render({ onChange })
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => '2024-05-20' } })
    field('Day').dispatchEvent(event)
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2024-05-20')
    expect(field('Day').value).toBe('20')
  })

  it('ignores paste when readOnly is set', async () => {
    const onChange = vi.fn()
    render({ onChange, readOnly: true })
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => '2024-05-20' } })
    field('Day').dispatchEvent(event)
    await nextTick()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables all fields when disabled is set', () => {
    render({ disabled: true })
    expect(field('Day').disabled).toBe(true)
    expect(field('Month').disabled).toBe(true)
    expect(field('Year').disabled).toBe(true)
  })

  it('opens the calendar dropdown and selects a day', async () => {
    const onChange = vi.fn()
    render({ onChange, defaultValue: '2024-03-15' })
    field('Day').focus()
    field('Day').dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    await nextTick()
    const day = document.querySelector<HTMLButtonElement>('button[aria-label="20 March 2024"]')
    expect(day).toBeTruthy()
    expect(
      document.querySelector('button[aria-label="15 March 2024"]')!.hasAttribute('data-selected'),
    ).toBe(true)
    day!.click()
    await nextTick()
    expect(onChange).toHaveBeenLastCalledWith('2024-03-20')
  })

  it('writes value to the hidden input', () => {
    render({ name: 'date', defaultValue: '2024-03-15' })
    const hidden = document.querySelector<HTMLInputElement>('input[type="hidden"][name="date"]')!
    expect(hidden.value).toBe('2024-03-15')
  })

  it('groups the fields under the label', () => {
    render({ label: 'Birthday' })
    const group = document.querySelector('[role="group"]')!
    const label = document.getElementById(group.getAttribute('aria-labelledby')!)
    expect(label?.textContent).toContain('Birthday')
  })
})
