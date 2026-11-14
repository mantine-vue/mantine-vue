import dayjs from 'dayjs'
import { computed, ref, watch, type Ref } from 'vue'
import {
  buildDateString,
  convertTo12h,
  getDaysInMonth,
  parseDateString,
  type BuildDateStringInput,
} from './masked-date-utils'

export type MaskedDateInputField =
  | 'day'
  | 'month'
  | 'year'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'amPm'

export interface MaskedDateInputPasteResult {
  day: number | null
  month: number | null
  year: number | null
  hours?: number | null
  minutes?: number | null
  seconds?: number | null
}

interface UseMaskedDateInputInput {
  value: () => string | null | undefined
  defaultValue: string | null | undefined
  onChange: (value: string | null) => void
  minDate: () => string | undefined
  maxDate: () => string | undefined
  withTime: () => boolean
  withSeconds: () => boolean
  format: () => '24h' | '12h'
  amPmLabels: () => { am: string; pm: string }
  clearable: () => boolean
  readOnly: () => boolean
  disabled: () => boolean
  fieldsOrder: () => ('day' | 'month' | 'year')[]
  pasteSplit: () => ((value: string) => MaskedDateInputPasteResult) | undefined
}

const getElement = (target: any): HTMLElement | null => target?.$el ?? target ?? null

export function useMaskedDateInput(input: UseMaskedDateInputInput) {
  const initialValue = input.value() ?? input.defaultValue
  const initialParsed = parseDateString(initialValue)
  const initial12h =
    input.format() === '12h' ? convertTo12h(initialParsed.hours, input.amPmLabels()) : null

  const day = ref<number | null>(initialParsed.day)
  const month = ref<number | null>(initialParsed.month)
  const year = ref<number | null>(initialParsed.year)
  const hours = ref<number | null>(initial12h ? initial12h.hours12 : initialParsed.hours)
  const minutes = ref<number | null>(initialParsed.minutes)
  const seconds = ref<number | null>(initialParsed.seconds)
  const amPm = ref<string | null>(initial12h ? initial12h.amPm : null)

  const elements: Record<MaskedDateInputField, Ref<any>> = {
    day: ref(null),
    month: ref(null),
    year: ref(null),
    hours: ref(null),
    minutes: ref(null),
    seconds: ref(null),
    amPm: ref(null),
  }

  const build = (overrides: Partial<BuildDateStringInput> = {}) =>
    buildDateString({
      day: day.value,
      month: month.value,
      year: year.value,
      hours: hours.value,
      minutes: minutes.value,
      seconds: seconds.value,
      withTime: input.withTime(),
      withSeconds: input.withSeconds(),
      format: input.format(),
      amPm: amPm.value,
      amPmLabels: input.amPmLabels(),
      ...overrides,
    })

  let emittedValue: string | null | undefined
  let wasInvalidBefore = !build().valid

  const isOutOfRange = (dateString: string) => {
    const dateOnly = dateString.split(' ')[0]
    const minDate = input.minDate()
    const maxDate = input.maxDate()
    return (
      (!!minDate && dayjs(dateOnly).isBefore(minDate, 'day')) ||
      (!!maxDate && dayjs(dateOnly).isAfter(maxDate, 'day'))
    )
  }

  const emitChange = (next: string | null) => {
    emittedValue = next
    input.onChange(next)
  }

  const focus = (field: MaskedDateInputField) => {
    getElement(elements[field].value)?.focus()
  }

  const handleFieldChange = (field: MaskedDateInputField, val: any) => {
    const computedDay = field === 'day' ? val : day.value
    const computedMonth = field === 'month' ? val : month.value
    const computedYear = field === 'year' ? val : year.value
    const yearIncomplete = computedYear !== null && computedYear < 1000

    let clampedDay = computedDay
    if (
      computedDay !== null &&
      !yearIncomplete &&
      (field === 'month' || field === 'year' || field === 'day')
    ) {
      const maxDays = getDaysInMonth(computedMonth, computedYear)
      if (computedDay > maxDays) {
        clampedDay = maxDays
      }
    }

    const dateString = build({
      day: clampedDay,
      month: computedMonth,
      year: computedYear,
      hours: field === 'hours' ? val : hours.value,
      minutes: field === 'minutes' ? val : minutes.value,
      seconds: field === 'seconds' ? val : seconds.value,
      amPm: field === 'amPm' ? val : amPm.value,
    })

    if (dateString.valid) {
      wasInvalidBefore = false
      if (clampedDay !== computedDay || field === 'day') {
        day.value = clampedDay
      }

      if (!isOutOfRange(dateString.value)) {
        emitChange(dateString.value)
      }
    } else if (!wasInvalidBefore) {
      emitChange(null)
      wasInvalidBefore = true
    }
  }

  const createSetter =
    <T>(field: MaskedDateInputField, target: Ref<T>) =>
    (val: T) => {
      target.value = val
      handleFieldChange(field, val)
      focus(field)
    }

  const clear = () => {
    day.value = null
    month.value = null
    year.value = null
    hours.value = null
    minutes.value = null
    seconds.value = null
    amPm.value = null
    emitChange(null)
    wasInvalidBefore = true
    focus(input.fieldsOrder()[0])
  }

  const clampToRange = () => {
    if (input.readOnly() || input.disabled()) {
      return
    }

    const current = build()
    if (!current.valid || !isOutOfRange(current.value)) {
      return
    }

    const minDate = input.minDate()
    const maxDate = input.maxDate()
    const dateOnly = current.value.split(' ')[0]
    const clampedDate = minDate && dayjs(dateOnly).isBefore(minDate, 'day') ? minDate : maxDate!
    const clampedParsed = parseDateString(clampedDate)
    day.value = clampedParsed.day
    month.value = clampedParsed.month
    year.value = clampedParsed.year

    const next = build()
    if (next.valid) {
      wasInvalidBefore = false
      emitChange(next.value)
    }
  }

  const setFromDateString = (dateString: string) => {
    const parsed = parseDateString(dateString)
    day.value = parsed.day
    month.value = parsed.month
    year.value = parsed.year

    if (parsed.hours !== null || parsed.minutes !== null || parsed.seconds !== null) {
      hours.value = parsed.hours
      minutes.value = parsed.minutes
      seconds.value = parsed.seconds
    }

    const next = build()
    wasInvalidBefore = !next.valid
    if (next.valid) {
      emitChange(next.value)
    }
  }

  const onPaste = (event: ClipboardEvent) => {
    if (input.readOnly() || input.disabled()) {
      return
    }

    const pastedValue = event.clipboardData?.getData('text') ?? ''
    const pasteSplit = input.pasteSplit()
    const parsed: MaskedDateInputPasteResult = pasteSplit
      ? pasteSplit(pastedValue)
      : parseDateString(pastedValue)

    if (parsed.day === null || parsed.month === null || parsed.year === null) {
      return
    }

    event.preventDefault()

    let resolvedHours = parsed.hours ?? null
    let resolvedAmPm = amPm.value

    if (input.format() === '12h' && resolvedHours !== null) {
      const converted = convertTo12h(resolvedHours, input.amPmLabels())
      resolvedHours = converted.hours12
      resolvedAmPm = converted.amPm
    }

    const dateString = build({
      day: parsed.day,
      month: parsed.month,
      year: parsed.year,
      hours: resolvedHours,
      minutes: parsed.minutes ?? null,
      seconds: parsed.seconds ?? null,
      amPm: resolvedAmPm,
    })

    if (dateString.valid && !isOutOfRange(dateString.value)) {
      day.value = parsed.day
      month.value = parsed.month
      year.value = parsed.year
      hours.value = resolvedHours
      minutes.value = parsed.minutes ?? null
      seconds.value = parsed.seconds ?? null
      amPm.value = resolvedAmPm
      wasInvalidBefore = false
      emitChange(dateString.value)
    }
  }

  const isClearable = computed(
    () =>
      input.clearable() &&
      !input.readOnly() &&
      !input.disabled() &&
      (day.value !== null ||
        month.value !== null ||
        year.value !== null ||
        hours.value !== null ||
        minutes.value !== null ||
        seconds.value !== null ||
        amPm.value !== null),
  )

  const hiddenInputValue = computed(() => {
    const result = build()
    return result.valid && !isOutOfRange(result.value) ? result.value : ''
  })

  watch(input.value, (value) => {
    const normalizedValue = value === '' ? null : value
    const isEcho = normalizedValue === emittedValue
    emittedValue = undefined

    if (isEcho || normalizedValue === undefined) {
      return
    }

    if (normalizedValue === null) {
      day.value = null
      month.value = null
      year.value = null
      hours.value = null
      minutes.value = null
      seconds.value = null
      amPm.value = null
      wasInvalidBefore = true
      return
    }

    const parsed = parseDateString(normalizedValue)
    const converted =
      input.format() === '12h' ? convertTo12h(parsed.hours, input.amPmLabels()) : null
    day.value = parsed.day
    month.value = parsed.month
    year.value = parsed.year
    hours.value = converted ? converted.hours12 : parsed.hours
    amPm.value = converted ? converted.amPm : null
    minutes.value = parsed.minutes
    seconds.value = parsed.seconds
    wasInvalidBefore = !build().valid
  })

  return {
    elements,
    values: { day, month, year, hours, minutes, seconds, amPm },
    setDay: createSetter('day', day),
    setMonth: createSetter('month', month),
    setYear: createSetter('year', year),
    setHours: createSetter('hours', hours),
    setMinutes: createSetter('minutes', minutes),
    setSeconds: createSetter('seconds', seconds),
    setAmPm: createSetter('amPm', amPm),
    focus,
    clear,
    clampToRange,
    onPaste,
    setFromDateString,
    isClearable,
    hiddenInputValue,
  }
}
