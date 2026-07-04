import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  watch,
  type CSSProperties,
  type InjectionKey,
  type PropType,
  type VNodeChild,
} from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import {
  AccordionChevron,
  ActionIcon,
  Box,
  Button,
  CheckIcon,
  CloseButton,
  Group,
  InputBase,
  Modal,
  Popover,
  ScrollArea,
  SimpleGrid,
  Text,
  UnstyledButton,
  type MantineSize,
} from '@mantine-vue/core'
import classes from './Dates.module.css'

dayjs.extend(customParseFormat)

export type DateStringValue = string
export type DateValue = DateStringValue | null
export type DatesRangeValue = [DateValue, DateValue]
export type DatePickerType = 'default' | 'multiple' | 'range'
export type CalendarLevel = 'month' | 'year' | 'decade'
export type DatePickerValue<Type extends DatePickerType = 'default'> = Type extends 'range'
  ? DatesRangeValue
  : Type extends 'multiple'
    ? DateStringValue[]
    : DateValue
export type DatePickerValueType = DateValue | DateStringValue[] | DatesRangeValue
export type ControlKeydownPayload = {
  rowIndex: number
  cellIndex: number
  event: KeyboardEvent
  controlsRef: HTMLElement[][]
}
export type DateFormatter = (payload: {
  type: DatePickerType
  date: DatePickerValueType
  locale?: string
  format: string
  labelSeparator: string
}) => string

export interface DatesProviderSettings {
  locale?: string
  firstDayOfWeek?: number
  weekendDays?: number[]
  timezone?: string
  consistentWeeks?: boolean
}

const DATES_PROVIDER_DEFAULT_SETTINGS: Required<DatesProviderSettings> = {
  locale: 'en',
  firstDayOfWeek: 1,
  weekendDays: [0, 6],
  timezone: 'UTC',
  consistentWeeks: false,
}

const DatesContextKey: InjectionKey<Required<DatesProviderSettings>> = Symbol('DatesContext')

export const DatesProvider = defineComponent({
  name: 'DatesProvider',
  props: {
    settings: { type: Object as PropType<DatesProviderSettings>, default: () => ({}) },
  },
  setup(props, { slots }) {
    const settings = computed(() => ({ ...DATES_PROVIDER_DEFAULT_SETTINGS, ...props.settings }))
    provide(DatesContextKey, settings.value)
    watch(settings, (value) => provide(DatesContextKey, value))
    return () => slots.default?.()
  },
})

export function useDatesContext() {
  return inject(DatesContextKey, DATES_PROVIDER_DEFAULT_SETTINGS)
}

function normalizeDate(value: Date | string | null | undefined): DateStringValue | null {
  if (value == null || value === '') {
    return null
  }

  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
}

export function toDateString(value: Date | string | null | undefined): DateStringValue | null {
  return normalizeDate(value)
}

export function shiftTimezone<T>(direction: 'add' | 'remove', date: T, timezone?: string): T {
  void direction
  void timezone
  return date
}

export function getTimezoneOffset(date: Date | string, timezone?: string) {
  void timezone
  return new Date(date).getTimezoneOffset()
}

export function clampDate(date: DateStringValue, minDate?: Date | string, maxDate?: Date | string) {
  const value = dayjs(date)
  const min = normalizeDate(minDate)
  const max = normalizeDate(maxDate)

  if (min && value.isBefore(min, 'day')) {
    return min
  }

  if (max && value.isAfter(max, 'day')) {
    return max
  }

  return value.format('YYYY-MM-DD')
}

export function getDefaultClampedDate({
  minDate,
  maxDate,
  defaultDate,
}: {
  minDate?: Date | string
  maxDate?: Date | string
  defaultDate?: Date | string
} = {}) {
  return clampDate(normalizeDate(defaultDate) || dayjs().format('YYYY-MM-DD'), minDate, maxDate)
}

export function assignTime(date: Date | string, time: Date | string) {
  const timeValue = dayjs(time)
  return dayjs(date)
    .hour(timeValue.hour())
    .minute(timeValue.minute())
    .second(timeValue.second())
    .millisecond(timeValue.millisecond())
    .toDate()
}

export function getFormattedDate({
  date,
  format = 'MMMM D, YYYY',
  locale,
}: {
  date: Date | string
  format?: string
  locale?: string
}) {
  return dayjs(date)
    .locale(locale || 'en')
    .format(format)
}

export function isSameDate(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined,
) {
  if (!a || !b) return false
  return dayjs(a).isSame(b, 'day')
}

export function isSameMonth(a: Date | string, b: Date | string) {
  return dayjs(a).isSame(b, 'month')
}

export function isSameYear(a: Date | string, b: Date | string) {
  return dayjs(a).isSame(b, 'year')
}

export function getStartOfWeek(date: Date | string, firstDayOfWeek = 1) {
  const value = dayjs(date)
  const diff = (value.day() - firstDayOfWeek + 7) % 7
  return value.subtract(diff, 'day').format('YYYY-MM-DD')
}

export function getEndOfWeek(date: Date | string, firstDayOfWeek = 1) {
  return dayjs(getStartOfWeek(date, firstDayOfWeek)).add(6, 'day').format('YYYY-MM-DD')
}

export function getWeekNumber(date: Date | string) {
  const current = dayjs(date)
  const yearStart = dayjs(`${current.year()}-01-01`)
  return Math.ceil((current.diff(yearStart, 'day') + yearStart.day() + 1) / 7)
}

export function handleControlKeyDown({
  rowIndex,
  cellIndex,
  event,
  controlsRef,
}: ControlKeydownPayload) {
  const rows = controlsRef.length
  const cols = controlsRef[0]?.length || 0
  let nextRow = rowIndex
  let nextCell = cellIndex

  if (event.key === 'ArrowRight') nextCell += 1
  if (event.key === 'ArrowLeft') nextCell -= 1
  if (event.key === 'ArrowDown') nextRow += 1
  if (event.key === 'ArrowUp') nextRow -= 1
  if (event.key === 'Home') nextCell = 0
  if (event.key === 'End') nextCell = cols - 1

  if (nextCell < 0) {
    nextCell = cols - 1
    nextRow -= 1
  }

  if (nextCell >= cols) {
    nextCell = 0
    nextRow += 1
  }

  const next = controlsRef[(nextRow + rows) % rows]?.[(nextCell + cols) % cols]
  if (next) {
    event.preventDefault()
    next.focus()
  }
}

function focusAdjacentControl(
  refs: (HTMLElement | null | undefined)[][],
  rowIndex: number,
  cellIndex: number,
  direction: 'up' | 'down' | 'left' | 'right',
) {
  const isFocusable = (el: HTMLElement | null | undefined) =>
    !!el &&
    !(el as any).disabled &&
    !el.hasAttribute('data-hidden') &&
    !el.hasAttribute('data-outside')

  let nextRow = rowIndex
  let nextCell = cellIndex

  for (let i = 0; i < 60; i += 1) {
    if (direction === 'up') nextRow -= 1
    if (direction === 'down') nextRow += 1
    if (direction === 'left') {
      nextCell -= 1
      if (nextCell < 0) {
        nextRow -= 1
        nextCell = (refs[nextRow]?.length || 1) - 1
      }
    }
    if (direction === 'right') {
      nextCell += 1
      if (nextCell >= (refs[nextRow]?.length || 0)) {
        nextRow += 1
        nextCell = 0
      }
    }

    const row = refs[nextRow]
    if (!row) return
    const el = row[nextCell]
    if (el === undefined) return
    if (isFocusable(el)) {
      el!.focus()
      return
    }
  }
}

function keyToDirection(key: string): 'up' | 'down' | 'left' | 'right' | null {
  if (key === 'ArrowUp') return 'up'
  if (key === 'ArrowDown') return 'down'
  if (key === 'ArrowLeft') return 'left'
  if (key === 'ArrowRight') return 'right'
  return null
}

// A ref callback used on grid cells (Day/PickerControl) to capture the real
// DOM node into a [row][cell] array - components resolve to their instance
// proxy (`.$el`), not the DOM node directly.
function setGridRef(
  refs: (HTMLElement | null | undefined)[][],
  rowIndex: number,
  cellIndex: number,
  node: any,
) {
  if (!refs[rowIndex]) refs[rowIndex] = []
  refs[rowIndex][cellIndex] = node?.$el ?? node ?? undefined
}

function getMonthDays(month: DateStringValue, firstDayOfWeek: number, consistentWeeks = false) {
  const startOfMonth = dayjs(month).startOf('month')
  const start = dayjs(getStartOfWeek(startOfMonth.format('YYYY-MM-DD'), firstDayOfWeek))
  const weeks = consistentWeeks
    ? 6
    : Math.ceil((startOfMonth.daysInMonth() + startOfMonth.day()) / 7)

  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (__, day) => start.add(week * 7 + day, 'day').format('YYYY-MM-DD')),
  )
}

function isBeforeMin(date: DateStringValue, minDate?: Date | string) {
  const min = normalizeDate(minDate)
  return !!min && dayjs(date).isBefore(min, 'day')
}

function isAfterMax(date: DateStringValue, maxDate?: Date | string) {
  const max = normalizeDate(maxDate)
  return !!max && dayjs(date).isAfter(max, 'day')
}

function formatValue(
  value: DatePickerValueType,
  type: DatePickerType,
  format: string,
  locale?: string,
  labelSeparator = '–',
  valueFormatter?: DateFormatter,
) {
  if (valueFormatter) {
    return valueFormatter({ type, date: value, locale, format, labelSeparator })
  }

  if (type === 'multiple') {
    return Array.isArray(value)
      ? value
          .map((item) =>
            dayjs(item)
              .locale(locale || 'en')
              .format(format),
          )
          .join(', ')
      : ''
  }

  if (type === 'range') {
    const [start, end] = Array.isArray(value) ? (value as DatesRangeValue) : [null, null]
    if (!start && !end) return ''
    if (start && !end)
      return `${dayjs(start)
        .locale(locale || 'en')
        .format(format)} ${labelSeparator} `
    if (!start && end)
      return `${labelSeparator} ${dayjs(end)
        .locale(locale || 'en')
        .format(format)}`
    return `${dayjs(start)
      .locale(locale || 'en')
      .format(format)} ${labelSeparator} ${dayjs(end)
      .locale(locale || 'en')
      .format(format)}`
  }

  return value
    ? dayjs(value as DateStringValue)
        .locale(locale || 'en')
        .format(format)
    : ''
}

function getMonthLabel(date: DateStringValue, format = 'MMMM YYYY', locale?: string) {
  return dayjs(date)
    .locale(locale || 'en')
    .format(format)
}

function getYearRange(date: DateStringValue) {
  const year = dayjs(date).year()
  const start = year - (year % 10)
  return Array.from({ length: 10 }, (_, index) =>
    dayjs(`${start + index}-01-01`).format('YYYY-MM-DD'),
  )
}

function getDecadeLabel(date: DateStringValue) {
  const years = getYearRange(date)
  return `${dayjs(years[0]).year()} – ${dayjs(years[years.length - 1]).year()}`
}

function renderMaybe(content: VNodeChild | (() => VNodeChild)) {
  return typeof content === 'function' ? (content as () => VNodeChild)() : content
}

export const Day = defineComponent({
  name: 'Day',
  inheritAttrs: false,
  props: {
    date: { type: String, required: true },
    size: { type: [String, Number], default: 'sm' },
    static: { type: Boolean, default: false },
    weekend: Boolean,
    outside: Boolean,
    selected: Boolean,
    hidden: Boolean,
    inRange: Boolean,
    firstInRange: Boolean,
    lastInRange: Boolean,
    highlightToday: Boolean,
    fullWidth: Boolean,
    disabled: Boolean,
    renderDay: Function as PropType<(date: DateStringValue) => VNodeChild>,
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    unstyled: Boolean,
  },
  setup(props, { attrs }) {
    return () =>
      h(
        UnstyledButton,
        {
          ...attrs,
          component: props.static ? 'div' : 'button',
          class: [classes.day, (attrs as any).class],
          disabled: props.disabled,
          style: [{ display: props.hidden ? 'none' : undefined }, (attrs as any).style],
          'data-today': dayjs(props.date).isSame(new Date(), 'day') || undefined,
          'data-hidden': props.hidden || undefined,
          'data-highlight-today': props.highlightToday || undefined,
          'data-disabled': props.disabled || undefined,
          'data-weekend': (!props.disabled && !props.outside && props.weekend) || undefined,
          'data-outside': (!props.disabled && props.outside) || undefined,
          'data-selected': (!props.disabled && props.selected) || undefined,
          'data-in-range': (props.inRange && !props.disabled) || undefined,
          'data-first-in-range': (props.firstInRange && !props.disabled) || undefined,
          'data-last-in-range': (props.lastInRange && !props.disabled) || undefined,
          'data-static': props.static || undefined,
          'data-full-width': props.fullWidth || undefined,
        },
        () => props.renderDay?.(props.date) || dayjs(props.date).date(),
      )
  },
})

export const PickerControl = defineComponent({
  name: 'PickerControl',
  inheritAttrs: false,
  props: {
    selected: Boolean,
    disabled: Boolean,
    inRange: Boolean,
    firstInRange: Boolean,
    lastInRange: Boolean,
    withCellSpacing: { type: Boolean, default: true },
    fullWidth: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        UnstyledButton,
        {
          ...attrs,
          class: [classes.pickerControl, (attrs as any).class],
          disabled: props.disabled,
          'data-selected': (props.selected && !props.disabled) || undefined,
          'data-disabled': props.disabled || undefined,
          'data-in-range': (props.inRange && !props.disabled && !props.selected) || undefined,
          'data-first-in-range': (props.firstInRange && !props.disabled) || undefined,
          'data-last-in-range': (props.lastInRange && !props.disabled) || undefined,
          'data-with-cell-spacing': props.withCellSpacing || undefined,
          'data-full-width': props.fullWidth || undefined,
        },
        () => slots.default?.(),
      )
  },
})

export const CalendarHeader = defineComponent({
  name: 'CalendarHeader',
  props: {
    label: { type: String, required: true },
    hasNextLevel: { type: Boolean, default: true },
    withNext: { type: Boolean, default: true },
    withPrevious: { type: Boolean, default: true },
    nextDisabled: Boolean,
    previousDisabled: Boolean,
    nextLabel: { type: String, default: 'Next' },
    previousLabel: { type: String, default: 'Previous' },
    levelControlAriaLabel: String,
    fullWidth: Boolean,
    onNext: Function as PropType<() => void>,
    onPrevious: Function as PropType<() => void>,
    onLevelClick: Function as PropType<() => void>,
  },
  setup(props) {
    return () => {
      const previousControl = props.withPrevious
        ? h(
            UnstyledButton,
            {
              class: classes.calendarHeaderControl,
              'data-direction': 'previous',
              'aria-label': props.previousLabel,
              onClick: props.onPrevious,
              disabled: props.previousDisabled,
              'data-disabled': props.previousDisabled || undefined,
            },
            () =>
              h(AccordionChevron, {
                class: classes.calendarHeaderControlIcon,
                'data-direction': 'previous',
                size: '45%',
              }),
          )
        : null

      const levelControl = h(
        UnstyledButton,
        {
          component: props.hasNextLevel ? 'button' : 'div',
          class: classes.calendarHeaderLevel,
          onClick: props.hasNextLevel ? props.onLevelClick : undefined,
          disabled: !props.hasNextLevel,
          'data-static': !props.hasNextLevel || undefined,
          'aria-label': props.levelControlAriaLabel,
        },
        () => props.label,
      )

      const nextControl = props.withNext
        ? h(
            UnstyledButton,
            {
              class: classes.calendarHeaderControl,
              'data-direction': 'next',
              'aria-label': props.nextLabel,
              onClick: props.onNext,
              disabled: props.nextDisabled,
              'data-disabled': props.nextDisabled || undefined,
            },
            () =>
              h(AccordionChevron, {
                class: classes.calendarHeaderControlIcon,
                'data-direction': 'next',
                size: '45%',
              }),
          )
        : null

      return h(
        'div',
        { class: classes.calendarHeader, 'data-full-width': props.fullWidth || undefined },
        [previousControl, levelControl, nextControl],
      )
    }
  },
})

export const WeekdaysRow = defineComponent({
  name: 'WeekdaysRow',
  props: {
    firstDayOfWeek: Number,
    weekendDays: Array as PropType<number[]>,
    locale: String,
    weekdayFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'dd',
    },
    withWeekNumbers: Boolean,
  },
  setup(props) {
    const ctx = useDatesContext()
    return () => {
      const first = props.firstDayOfWeek ?? ctx.firstDayOfWeek
      const days = Array.from({ length: 7 }, (_, index) =>
        dayjs('2024-01-07').add((first + index) % 7, 'day'),
      )
      return h('tr', { class: classes.weekdaysRow }, [
        props.withWeekNumbers ? h('th', { class: classes.weekday }) : null,
        ...days.map((date) =>
          h(
            'th',
            {
              class: classes.weekday,
              'data-weekend':
                (props.weekendDays ?? ctx.weekendDays).includes(date.day()) || undefined,
            },
            typeof props.weekdayFormat === 'function'
              ? props.weekdayFormat(date.format('YYYY-MM-DD'))
              : date.locale(props.locale || ctx.locale).format(props.weekdayFormat),
          ),
        ),
      ])
    }
  },
})

export const Month = defineComponent({
  name: 'Month',
  props: {
    month: { type: String, default: () => dayjs().format('YYYY-MM-DD') },
    value: { type: [String, Array, null] as PropType<DatePickerValueType>, default: null },
    type: { type: String as PropType<DatePickerType>, default: 'default' },
    firstDayOfWeek: Number,
    weekendDays: Array as PropType<number[]>,
    minDate: [String, Date] as PropType<string | Date>,
    maxDate: [String, Date] as PropType<string | Date>,
    excludeDate: Function as PropType<(date: DateStringValue) => boolean>,
    renderDay: Function as PropType<(date: DateStringValue) => VNodeChild>,
    hideOutsideDates: Boolean,
    hideWeekdays: Boolean,
    getDayProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    getDayAriaLabel: Function as PropType<(date: DateStringValue) => string>,
    onDayClick: Function as PropType<(date: DateStringValue) => void>,
    onDayMouseEnter: Function as PropType<(date: DateStringValue) => void>,
    withCellSpacing: { type: Boolean, default: true },
    highlightToday: Boolean,
    withWeekNumbers: Boolean,
    static: Boolean,
    fullWidth: Boolean,
  },
  setup(props) {
    const ctx = useDatesContext()
    const hovered = ref<string | null>(null)

    const dayRefs: (HTMLElement | null | undefined)[][] = []

    const isSelected = (date: DateStringValue) => {
      if (props.type === 'multiple') return Array.isArray(props.value) && props.value.includes(date)
      if (props.type === 'range') {
        const [start, end] = Array.isArray(props.value)
          ? (props.value as DatesRangeValue)
          : [null, null]
        return isSameDate(date, start) || isSameDate(date, end)
      }
      return isSameDate(date, props.value as DateValue)
    }

    const isInRange = (date: DateStringValue) => {
      if (props.type !== 'range' || !Array.isArray(props.value)) return false
      const [start, end] = props.value as DatesRangeValue
      const rangeEnd = end || hovered.value
      if (!start || !rangeEnd) return false
      return dayjs(date).isAfter(start, 'day') && dayjs(date).isBefore(rangeEnd, 'day')
    }

    return () => {
      const first = props.firstDayOfWeek ?? ctx.firstDayOfWeek
      const rows = getMonthDays(props.month, first, ctx.consistentWeeks)

      // Only one day in the whole grid is in the tab order (roving tabindex) -
      // prefer the selected date, then today, then the first enabled date.
      const flatDates = rows.flat()
      const isEnabled = (date: DateStringValue) => {
        const outside = !dayjs(date).isSame(props.month, 'month')
        const disabled =
          isBeforeMin(date, props.minDate) ||
          isAfterMax(date, props.maxDate) ||
          props.excludeDate?.(date) ||
          props.getDayProps?.(date)?.disabled
        return !disabled && (!props.hideOutsideDates || !outside)
      }
      const enabledDates = flatDates.filter(isEnabled)
      const dateInTabOrder =
        enabledDates.find((date) => isSelected(date)) ??
        enabledDates.find((date) => dayjs().isSame(date, 'date')) ??
        enabledDates[0]

      return h('table', { class: classes.month, 'data-full-width': props.fullWidth || undefined }, [
        props.hideWeekdays
          ? null
          : h('thead', [
              h(WeekdaysRow, {
                firstDayOfWeek: first,
                weekendDays: props.weekendDays,
                withWeekNumbers: props.withWeekNumbers,
              }),
            ]),
        h(
          'tbody',
          rows.map((week, rowIndex) =>
            h('tr', { class: classes.monthRow }, [
              props.withWeekNumbers
                ? h('td', { class: classes.weekNumber }, getWeekNumber(week[0]))
                : null,
              ...week.map((date, cellIndex) => {
                const outside = !dayjs(date).isSame(props.month, 'month')
                const disabled =
                  isBeforeMin(date, props.minDate) ||
                  isAfterMax(date, props.maxDate) ||
                  props.excludeDate?.(date)
                const dayProps = props.getDayProps?.(date) || {}
                const selected = isSelected(date)
                const [start, end] =
                  props.type === 'range' && Array.isArray(props.value)
                    ? (props.value as DatesRangeValue)
                    : [null, null]

                return h(
                  'td',
                  {
                    class: classes.monthCell,
                    'data-with-spacing': props.withCellSpacing || undefined,
                  },
                  [
                    h(Day, {
                      ...dayProps,
                      date,
                      static: props.static,
                      disabled: disabled || dayProps.disabled,
                      weekend: (props.weekendDays ?? ctx.weekendDays).includes(dayjs(date).day()),
                      outside,
                      hidden: props.hideOutsideDates && outside,
                      selected,
                      inRange: isInRange(date),
                      firstInRange: isSameDate(date, start),
                      lastInRange: isSameDate(date, end),
                      highlightToday: props.highlightToday,
                      fullWidth: props.fullWidth,
                      renderDay: props.renderDay,
                      'aria-label': props.getDayAriaLabel?.(date),
                      tabindex: props.static ? undefined : date === dateInTabOrder ? 0 : -1,
                      // Lets a focus-trapped Popover (e.g. DatePickerInput's
                      // dropdown) land directly on the selected date instead
                      // of the first tabbable element.
                      'data-autofocus': selected || undefined,
                      ref: (node: any) => setGridRef(dayRefs, rowIndex, cellIndex, node),
                      onClick: (event: MouseEvent) => {
                        dayProps.onClick?.(event)
                        if (!disabled && !props.static) props.onDayClick?.(date)
                      },
                      onMouseenter: (event: MouseEvent) => {
                        hovered.value = date
                        dayProps.onMouseenter?.(event)
                        props.onDayMouseEnter?.(date)
                      },
                      onKeydown: (event: KeyboardEvent) => {
                        dayProps.onKeydown?.(event)
                        const direction = keyToDirection(event.key)
                        if (direction) {
                          event.preventDefault()
                          focusAdjacentControl(dayRefs, rowIndex, cellIndex, direction)
                        }
                      },
                    }),
                  ],
                )
              }),
            ]),
          ),
        ),
      ])
    }
  },
})

export const MonthsList = defineComponent({
  name: 'MonthsList',
  props: {
    year: { type: String, default: () => dayjs().format('YYYY-MM-DD') },
    value: [String, Array, null] as PropType<DatePickerValueType>,
    minDate: [String, Date] as PropType<string | Date>,
    maxDate: [String, Date] as PropType<string | Date>,
    locale: String,
    monthsListFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'MMM',
    },
    getMonthControlProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    onMonthSelect: Function as PropType<(date: DateStringValue) => void>,
    onMonthMouseEnter: Function as PropType<(date: DateStringValue) => void>,
    fullWidth: Boolean,
  },
  setup(props) {
    const controlRefs: (HTMLElement | null | undefined)[][] = []
    return () => {
      const months = Array.from({ length: 12 }, (_, index) =>
        dayjs(props.year).month(index).startOf('month').format('YYYY-MM-DD'),
      )
      const isEnabled = (date: DateStringValue) =>
        !(
          (props.minDate && dayjs(date).endOf('month').isBefore(props.minDate, 'day')) ||
          (props.maxDate && dayjs(date).startOf('month').isAfter(props.maxDate, 'day')) ||
          props.getMonthControlProps?.(date)?.disabled
        )
      const isSelected = (date: DateStringValue) =>
        Array.isArray(props.value)
          ? (props.value as DateStringValue[]).some((item) => dayjs(item).isSame(date, 'month'))
          : !!props.value && dayjs(props.value as any).isSame(date, 'month')
      const enabledMonths = months.filter(isEnabled)
      const monthInTabOrder =
        enabledMonths.find(isSelected) ??
        enabledMonths.find((date) => dayjs().isSame(date, 'month')) ??
        enabledMonths[0]

      return h(
        SimpleGrid,
        {
          cols: 3,
          spacing: 4,
          class: classes.controlsGrid,
          'data-full-width': props.fullWidth || undefined,
        },
        () =>
          months.map((date, index) => {
            const rowIndex = Math.floor(index / 3)
            const cellIndex = index % 3
            const disabled = !isEnabled(date)
            const controlProps = props.getMonthControlProps?.(date) || {}
            return h(
              PickerControl,
              {
                fullWidth: props.fullWidth,
                ...controlProps,
                disabled: disabled || controlProps.disabled,
                selected: isSelected(date),
                tabindex: date === monthInTabOrder ? 0 : -1,
                'data-autofocus': isSelected(date) || undefined,
                ref: (node: any) => setGridRef(controlRefs, rowIndex, cellIndex, node),
                onClick: (event: MouseEvent) => {
                  controlProps.onClick?.(event)
                  if (!disabled) props.onMonthSelect?.(date)
                },
                onMouseenter: (event: MouseEvent) => {
                  controlProps.onMouseenter?.(event)
                  props.onMonthMouseEnter?.(date)
                },
                onKeydown: (event: KeyboardEvent) => {
                  controlProps.onKeydown?.(event)
                  const direction = keyToDirection(event.key)
                  if (direction) {
                    event.preventDefault()
                    focusAdjacentControl(controlRefs, rowIndex, cellIndex, direction)
                  }
                },
              },
              () =>
                typeof props.monthsListFormat === 'function'
                  ? props.monthsListFormat(date)
                  : dayjs(date)
                      .locale(props.locale || 'en')
                      .format(props.monthsListFormat),
            )
          }),
      )
    }
  },
})

export const YearsList = defineComponent({
  name: 'YearsList',
  props: {
    decade: { type: String, default: () => dayjs().format('YYYY-MM-DD') },
    value: [String, Array, null] as PropType<DatePickerValueType>,
    minDate: [String, Date] as PropType<string | Date>,
    maxDate: [String, Date] as PropType<string | Date>,
    yearsListFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'YYYY',
    },
    getYearControlProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    onYearSelect: Function as PropType<(date: DateStringValue) => void>,
    onYearMouseEnter: Function as PropType<(date: DateStringValue) => void>,
    fullWidth: Boolean,
  },
  setup(props) {
    const controlRefs: (HTMLElement | null | undefined)[][] = []
    return () => {
      const years = getYearRange(props.decade)
      const isEnabled = (date: DateStringValue) =>
        !(
          (props.minDate && dayjs(date).endOf('year').isBefore(props.minDate, 'day')) ||
          (props.maxDate && dayjs(date).startOf('year').isAfter(props.maxDate, 'day')) ||
          props.getYearControlProps?.(date)?.disabled
        )
      const isSelected = (date: DateStringValue) =>
        Array.isArray(props.value)
          ? (props.value as DateStringValue[]).some((item) => dayjs(item).isSame(date, 'year'))
          : !!props.value && dayjs(props.value as any).isSame(date, 'year')
      const enabledYears = years.filter(isEnabled)
      const yearInTabOrder =
        enabledYears.find(isSelected) ??
        enabledYears.find((date) => dayjs().isSame(date, 'year')) ??
        enabledYears[0]

      return h(
        SimpleGrid,
        {
          cols: 3,
          spacing: 4,
          class: classes.controlsGrid,
          'data-full-width': props.fullWidth || undefined,
        },
        () =>
          years.map((date, index) => {
            const rowIndex = Math.floor(index / 3)
            const cellIndex = index % 3
            const disabled = !isEnabled(date)
            const controlProps = props.getYearControlProps?.(date) || {}
            return h(
              PickerControl,
              {
                fullWidth: props.fullWidth,
                ...controlProps,
                disabled: disabled || controlProps.disabled,
                selected: isSelected(date),
                tabindex: date === yearInTabOrder ? 0 : -1,
                'data-autofocus': isSelected(date) || undefined,
                ref: (node: any) => setGridRef(controlRefs, rowIndex, cellIndex, node),
                onClick: (event: MouseEvent) => {
                  controlProps.onClick?.(event)
                  if (!disabled) props.onYearSelect?.(date)
                },
                onMouseenter: (event: MouseEvent) => {
                  controlProps.onMouseenter?.(event)
                  props.onYearMouseEnter?.(date)
                },
                onKeydown: (event: KeyboardEvent) => {
                  controlProps.onKeydown?.(event)
                  const direction = keyToDirection(event.key)
                  if (direction) {
                    event.preventDefault()
                    focusAdjacentControl(controlRefs, rowIndex, cellIndex, direction)
                  }
                },
              },
              () =>
                typeof props.yearsListFormat === 'function'
                  ? props.yearsListFormat(date)
                  : dayjs(date).format(props.yearsListFormat),
            )
          }),
      )
    }
  },
})

function getNextLevel(level: CalendarLevel, direction: 'up' | 'down'): CalendarLevel {
  const order: CalendarLevel[] = ['month', 'year', 'decade']
  return order[
    Math.max(0, Math.min(order.length - 1, order.indexOf(level) + (direction === 'up' ? 1 : -1)))
  ]
}

function clampLevel(
  level: CalendarLevel | undefined,
  minLevel: CalendarLevel | undefined,
  maxLevel: CalendarLevel | undefined,
): CalendarLevel {
  const order: CalendarLevel[] = ['month', 'year', 'decade']
  const toNumber = (value: CalendarLevel | undefined, fallback: number) =>
    value ? order.indexOf(value) : fallback
  const clamped = Math.max(
    toNumber(minLevel, 0),
    Math.min(toNumber(maxLevel, 2), toNumber(level, 0)),
  )
  return order[clamped]
}

export const Calendar = defineComponent({
  name: 'Calendar',
  props: {
    defaultLevel: String as PropType<CalendarLevel>,
    level: String as PropType<CalendarLevel>,
    onLevelChange: Function as PropType<(level: CalendarLevel) => void>,
    maxLevel: { type: String as PropType<CalendarLevel>, default: 'decade' },
    minLevel: { type: String as PropType<CalendarLevel>, default: 'month' },
    defaultDate: [String, Date] as PropType<string | Date>,
    date: [String, Date] as PropType<string | Date>,
    onDateChange: Function as PropType<(date: DateStringValue) => void>,
    numberOfColumns: { type: Number, default: 1 },
    columnsToScroll: Number,
    type: { type: String as PropType<DatePickerType>, default: 'default' },
    value: [String, Array, null] as PropType<DatePickerValueType>,
    minDate: [String, Date] as PropType<string | Date>,
    maxDate: [String, Date] as PropType<string | Date>,
    locale: String,
    firstDayOfWeek: Number,
    weekendDays: Array as PropType<number[]>,
    renderDay: Function as PropType<(date: DateStringValue) => VNodeChild>,
    getDayProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    getDayAriaLabel: Function as PropType<(date: DateStringValue) => string>,
    getMonthControlProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    getYearControlProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    excludeDate: Function as PropType<(date: DateStringValue) => boolean>,
    hideOutsideDates: Boolean,
    hideWeekdays: Boolean,
    monthLabelFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'MMMM YYYY',
    },
    yearLabelFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'YYYY',
    },
    decadeLabelFormat: Function as PropType<
      (start: DateStringValue, end: DateStringValue) => string
    >,
    monthsListFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'MMM',
    },
    yearsListFormat: {
      type: [String, Function] as PropType<string | ((date: DateStringValue) => string)>,
      default: 'YYYY',
    },
    onYearSelect: Function as PropType<(date: DateStringValue) => void>,
    onMonthSelect: Function as PropType<(date: DateStringValue) => void>,
    onMonthMouseEnter: Function as PropType<(date: DateStringValue) => void>,
    onYearMouseEnter: Function as PropType<(date: DateStringValue) => void>,
    onDayClick: Function as PropType<(date: DateStringValue) => void>,
    withCellSpacing: { type: Boolean, default: true },
    highlightToday: Boolean,
    withWeekNumbers: Boolean,
    static: Boolean,
    fullWidth: Boolean,
  },
  setup(props, { attrs }) {
    const [_level, setLevel] = useUncontrolled<CalendarLevel>({
      value: computed(() =>
        props.level === undefined
          ? undefined
          : clampLevel(props.level, props.minLevel, props.maxLevel),
      ),
      defaultValue:
        props.defaultLevel === undefined
          ? undefined
          : clampLevel(props.defaultLevel, props.minLevel, props.maxLevel),
      finalValue: clampLevel(undefined, props.minLevel, props.maxLevel),
      onChange: (value) => props.onLevelChange?.(value),
    })
    const [_date, setDate] = useUncontrolled<DateStringValue>({
      value: computed(() => normalizeDate(props.date) || undefined),
      defaultValue: normalizeDate(props.defaultDate) || undefined,
      finalValue: getDefaultClampedDate({ minDate: props.minDate, maxDate: props.maxDate }),
      onChange: (value) => props.onDateChange?.(value),
    })

    const scroll = props.columnsToScroll || props.numberOfColumns || 1
    const updateDate = (amount: number, unit: 'month' | 'year') => {
      setDate(dayjs(_date.value).add(amount, unit).format('YYYY-MM-DD'))
    }

    return () =>
      h(
        Box,
        {
          ...attrs,
          class: [classes.calendar, (attrs as any).class],
          'data-calendar': true,
          'data-full-width': props.fullWidth || undefined,
        },
        () =>
          Array.from({ length: props.numberOfColumns || 1 }, (_, column) => {
            const currentDate = dayjs(_date.value)
              .add(
                column * scroll,
                _level.value === 'month' ? 'month' : _level.value === 'year' ? 'year' : 'year',
              )
              .format('YYYY-MM-DD')
            if (_level.value === 'month') {
              return h('div', { class: classes.calendarLevel }, [
                h(CalendarHeader, {
                  label:
                    typeof props.monthLabelFormat === 'function'
                      ? props.monthLabelFormat(currentDate)
                      : getMonthLabel(currentDate, props.monthLabelFormat, props.locale),
                  hasNextLevel: props.maxLevel !== 'month',
                  withPrevious: column === 0,
                  withNext: column === (props.numberOfColumns || 1) - 1,
                  fullWidth: props.fullWidth,
                  onPrevious: () => updateDate(-scroll, 'month'),
                  onNext: () => updateDate(scroll, 'month'),
                  onLevelClick: () => setLevel(getNextLevel(_level.value, 'up')),
                }),
                h(Month, {
                  month: currentDate,
                  value: props.value,
                  type: props.type,
                  minDate: props.minDate,
                  maxDate: props.maxDate,
                  firstDayOfWeek: props.firstDayOfWeek,
                  weekendDays: props.weekendDays,
                  renderDay: props.renderDay,
                  getDayProps: props.getDayProps,
                  getDayAriaLabel: props.getDayAriaLabel,
                  excludeDate: props.excludeDate,
                  hideOutsideDates: props.hideOutsideDates,
                  hideWeekdays: props.hideWeekdays,
                  withCellSpacing: props.withCellSpacing,
                  highlightToday: props.highlightToday,
                  withWeekNumbers: props.withWeekNumbers,
                  static: props.static,
                  fullWidth: props.fullWidth,
                  onDayClick: props.onDayClick,
                }),
              ])
            }

            if (_level.value === 'year') {
              return h('div', { class: classes.calendarLevel }, [
                h(CalendarHeader, {
                  label:
                    typeof props.yearLabelFormat === 'function'
                      ? props.yearLabelFormat(currentDate)
                      : dayjs(currentDate).format(props.yearLabelFormat),
                  hasNextLevel: props.maxLevel === 'decade',
                  withPrevious: column === 0,
                  withNext: column === (props.numberOfColumns || 1) - 1,
                  fullWidth: props.fullWidth,
                  onPrevious: () => updateDate(-scroll, 'year'),
                  onNext: () => updateDate(scroll, 'year'),
                  onLevelClick: () => setLevel(getNextLevel(_level.value, 'up')),
                }),
                h(MonthsList, {
                  year: currentDate,
                  value: props.value,
                  minDate: props.minDate,
                  maxDate: props.maxDate,
                  monthsListFormat: props.monthsListFormat,
                  getMonthControlProps: props.getMonthControlProps,
                  fullWidth: props.fullWidth,
                  onMonthMouseEnter: props.onMonthMouseEnter,
                  onMonthSelect: (date: DateStringValue) => {
                    setDate(date)
                    props.onMonthSelect?.(date)
                    // Clamp instead of forcing 'month': for MonthPicker
                    // (minLevel: 'year') this keeps the view at 'year'
                    // instead of incorrectly drilling into a day grid.
                    setLevel(clampLevel('month', props.minLevel, props.maxLevel))
                  },
                }),
              ])
            }

            const years = getYearRange(currentDate)
            return h('div', { class: classes.calendarLevel }, [
              h(CalendarHeader, {
                label: props.decadeLabelFormat
                  ? props.decadeLabelFormat(years[0], years[years.length - 1])
                  : getDecadeLabel(currentDate),
                withPrevious: column === 0,
                withNext: column === (props.numberOfColumns || 1) - 1,
                hasNextLevel: false,
                fullWidth: props.fullWidth,
                onPrevious: () => updateDate(-10 * scroll, 'year'),
                onNext: () => updateDate(10 * scroll, 'year'),
              }),
              h(YearsList, {
                decade: currentDate,
                value: props.value,
                minDate: props.minDate,
                maxDate: props.maxDate,
                yearsListFormat: props.yearsListFormat,
                getYearControlProps: props.getYearControlProps,
                fullWidth: props.fullWidth,
                onYearMouseEnter: props.onYearMouseEnter,
                onYearSelect: (date: DateStringValue) => {
                  setDate(date)
                  props.onYearSelect?.(date)
                  // Clamp instead of forcing 'year': for YearPicker
                  // (minLevel: 'decade') this keeps the view at 'decade'
                  // instead of incorrectly drilling into the months grid.
                  setLevel(clampLevel('year', props.minLevel, props.maxLevel))
                },
              }),
            ])
          }),
      )
  },
})

export const MonthLevel = Calendar
export const YearLevel = Calendar
export const DecadeLevel = Calendar
export const MonthLevelGroup = Calendar
export const YearLevelGroup = Calendar
export const DecadeLevelGroup = Calendar
export const LevelsGroup = Calendar

// Granularity-aware range check for month/year range hover-previews, where
// day-level ms precision doesn't apply - sorts the range endpoints then checks
// date falls within [min, max] inclusive at the given unit.
function isInRangeGranular(
  date: DateStringValue,
  range: [DateStringValue, DateStringValue],
  unit: 'month' | 'year',
) {
  const sorted = [...range].sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
  return !dayjs(date).isBefore(sorted[0], unit) && !dayjs(date).isAfter(sorted[1], unit)
}

function getNextPickerValue(
  value: DatePickerValueType,
  date: DateStringValue,
  type: DatePickerType,
  sortDates = true,
) {
  if (type === 'multiple') {
    const next = Array.isArray(value) ? [...(value as DateStringValue[])] : []
    const index = next.findIndex((item) => isSameDate(item, date))
    if (index >= 0) next.splice(index, 1)
    else next.push(date)
    return sortDates ? next.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf()) : next
  }

  if (type === 'range') {
    const [start, end] = Array.isArray(value) ? (value as DatesRangeValue) : [null, null]
    if (!start || (start && end) || dayjs(date).isBefore(start, 'day')) {
      return [date, null] as DatesRangeValue
    }
    return [start, date] as DatesRangeValue
  }

  return date
}

export const DatePicker = defineComponent({
  name: 'DatePicker',
  props: {
    type: { type: String as PropType<DatePickerType>, default: 'default' },
    value: [String, Array, null] as PropType<DatePickerValueType>,
    defaultValue: [String, Array, null] as PropType<DatePickerValueType>,
    onChange: Function as PropType<(value: DatePickerValueType) => void>,
    allowDeselect: { type: Boolean, default: true },
    sortDates: { type: Boolean, default: true },
    presets: Array as PropType<Array<{ value: DatePickerValueType; label: string }>>,
  },
  setup(props, { attrs }) {
    const finalValue = computed<DatePickerValueType>(() =>
      props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
    )
    const [_value, setValue] = useUncontrolled<DatePickerValueType>({
      value: computed(() => props.value),
      defaultValue: props.defaultValue,
      finalValue: finalValue.value,
      onChange: (value) => props.onChange?.(value),
    })
    const selectDate = (date: DateStringValue) => {
      if (
        props.type === 'default' &&
        props.allowDeselect &&
        isSameDate(_value.value as DateValue, date)
      ) {
        setValue(null)
      } else {
        setValue(getNextPickerValue(_value.value, date, props.type, props.sortDates))
      }
    }

    // When presets are used, selecting one must also jump the Calendar's
    // displayed date/level to the preset's month. Calendar's onDateChange/
    // onLevelChange mirror its internal navigation back into these refs even
    // while `date`/`level` stay undefined (uncontrolled) - useUncontrolled
    // always invokes onChange regardless of controlled state - so passing
    // them through is a no-op until a preset click gives them a real value.
    const calendarDate = ref<DateStringValue | undefined>(undefined)
    const calendarLevel = ref<CalendarLevel | undefined>(undefined)
    const selectPreset = (value: DatePickerValueType) => {
      const date = Array.isArray(value) ? value[0] : value
      if (date != null) {
        calendarDate.value = date
        calendarLevel.value = 'month'
      }
      setValue(value)
    }

    return () => {
      const calendar = h(Calendar, {
        ...attrs,
        type: props.type,
        value: _value.value,
        date: calendarDate.value,
        onDateChange: (date: DateStringValue) => (calendarDate.value = date),
        level: calendarLevel.value,
        onLevelChange: (level: CalendarLevel) => (calendarLevel.value = level),
        onDayClick: selectDate,
      })

      if (!props.presets?.length) return calendar

      return h('div', { class: classes.datePickerRoot }, [
        h(
          'div',
          { class: classes.presetsList },
          props.presets.map((preset, index) =>
            h(
              UnstyledButton,
              {
                key: index,
                class: classes.presetButton,
                onClick: () => selectPreset(preset.value),
                onMousedown: (event: MouseEvent) => event.preventDefault(),
              },
              () => preset.label,
            ),
          ),
        ),
        calendar,
      ])
    }
  },
})

// YearPicker/MonthPicker used to be thin wrappers around DatePicker with
// just a different minLevel/defaultLevel. That doesn't work: DatePicker only
// ever wires Calendar's `onDayClick` to update its value, but with
// minLevel="year"/"decade" the day grid is never reached at all - selection
// happens via Calendar's onMonthSelect/onYearSelect instead, which DatePicker
// never listens to. The value was therefore never updated, so nothing ever
// appeared selected. These are real, separate implementations now, each
// wiring the selection callback that actually fires at their level.
export const YearPicker = defineComponent({
  name: 'YearPicker',
  props: {
    type: { type: String as PropType<DatePickerType>, default: 'default' },
    value: [String, Array, null] as PropType<DatePickerValueType>,
    defaultValue: [String, Array, null] as PropType<DatePickerValueType>,
    onChange: Function as PropType<(value: DatePickerValueType) => void>,
    allowDeselect: { type: Boolean, default: true },
    sortDates: { type: Boolean, default: true },
    presets: Array as PropType<Array<{ value: DatePickerValueType; label: string }>>,
    onYearSelect: Function as PropType<(date: DateStringValue) => void>,
  },
  setup(props, { attrs }) {
    const finalValue = computed<DatePickerValueType>(() =>
      props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
    )
    const [_value, setValue] = useUncontrolled<DatePickerValueType>({
      value: computed(() => props.value),
      defaultValue: props.defaultValue,
      finalValue: finalValue.value,
      onChange: (value) => props.onChange?.(value),
    })
    const hoveredDate = ref<DateStringValue | null>(null)
    const selectYear = (date: DateStringValue) => {
      if (
        props.type === 'default' &&
        props.allowDeselect &&
        isSameDate(_value.value as DateValue, date)
      ) {
        setValue(null)
      } else {
        setValue(getNextPickerValue(_value.value, date, props.type, props.sortDates))
      }
      hoveredDate.value = null
      props.onYearSelect?.(date)
    }
    // For type="range", PickerControl needs inRange/firstInRange/lastInRange
    // (not just `selected`) to draw the connecting highlight between the
    // start and end year. While only the start of the range is picked,
    // hovering over other years previews the highlight up to the hovered year.
    const yearControlProps = (date: DateStringValue) => {
      const external = (attrs as any).getYearControlProps?.(date) || {}
      if (props.type !== 'range' || !Array.isArray(_value.value)) return external
      const [start, end] = _value.value as DatesRangeValue
      const hovered = start && !end ? hoveredDate.value : null
      const inRange =
        start && hovered
          ? isInRangeGranular(date, [hovered, start], 'year')
          : start && end
            ? isInRangeGranular(date, [start, end], 'year')
            : false
      const firstInRange = start
        ? dayjs(date).isSame(start, 'year') && !(hovered && dayjs(hovered).isBefore(start, 'year'))
        : false
      const lastInRange = end
        ? dayjs(date).isSame(end, 'year')
        : !!(
            start &&
            hovered &&
            dayjs(hovered).isBefore(start, 'year') &&
            dayjs(date).isSame(start, 'year')
          )
      return {
        inRange,
        firstInRange,
        lastInRange,
        ...external,
      }
    }
    const calendarDate = ref<DateStringValue | undefined>(undefined)
    const selectPreset = (value: DatePickerValueType) => {
      const date = Array.isArray(value) ? value[0] : value
      if (date != null) calendarDate.value = date
      setValue(value)
    }

    return () => {
      const calendar = h(Calendar, {
        ...attrs,
        type: props.type,
        value: _value.value,
        date: calendarDate.value,
        onDateChange: (date: DateStringValue) => (calendarDate.value = date),
        defaultLevel: 'decade',
        minLevel: 'decade',
        onYearSelect: selectYear,
        getYearControlProps: yearControlProps,
        onYearMouseEnter: (date: DateStringValue) => {
          const [start, end] = Array.isArray(_value.value)
            ? (_value.value as DatesRangeValue)
            : [null, null]
          if (props.type === 'range' && start && !end) hoveredDate.value = date
        },
        onMouseleave: () => {
          hoveredDate.value = null
        },
      })

      if (!props.presets?.length) return calendar

      return h('div', { class: classes.datePickerRoot }, [
        h(
          'div',
          { class: classes.presetsList },
          props.presets.map((preset, index) =>
            h(
              UnstyledButton,
              {
                key: index,
                class: classes.presetButton,
                onClick: () => selectPreset(preset.value),
                onMousedown: (event: MouseEvent) => event.preventDefault(),
              },
              () => preset.label,
            ),
          ),
        ),
        calendar,
      ])
    }
  },
})

export const MonthPicker = defineComponent({
  name: 'MonthPicker',
  props: {
    type: { type: String as PropType<DatePickerType>, default: 'default' },
    value: [String, Array, null] as PropType<DatePickerValueType>,
    defaultValue: [String, Array, null] as PropType<DatePickerValueType>,
    onChange: Function as PropType<(value: DatePickerValueType) => void>,
    allowDeselect: { type: Boolean, default: true },
    sortDates: { type: Boolean, default: true },
    presets: Array as PropType<Array<{ value: DatePickerValueType; label: string }>>,
    onMonthSelect: Function as PropType<(date: DateStringValue) => void>,
  },
  setup(props, { attrs }) {
    const finalValue = computed<DatePickerValueType>(() =>
      props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
    )
    const [_value, setValue] = useUncontrolled<DatePickerValueType>({
      value: computed(() => props.value),
      defaultValue: props.defaultValue,
      finalValue: finalValue.value,
      onChange: (value) => props.onChange?.(value),
    })
    const hoveredDate = ref<DateStringValue | null>(null)
    const selectMonth = (date: DateStringValue) => {
      if (
        props.type === 'default' &&
        props.allowDeselect &&
        isSameDate(_value.value as DateValue, date)
      ) {
        setValue(null)
      } else {
        setValue(getNextPickerValue(_value.value, date, props.type, props.sortDates))
      }
      hoveredDate.value = null
      props.onMonthSelect?.(date)
    }
    // For type="range", PickerControl needs inRange/firstInRange/lastInRange
    // (not just `selected`) to draw the connecting highlight between the
    // start and end month. While only the start of the range is picked,
    // hovering over other months previews the highlight up to the hovered month.
    const monthControlProps = (date: DateStringValue) => {
      const external = (attrs as any).getMonthControlProps?.(date) || {}
      if (props.type !== 'range' || !Array.isArray(_value.value)) return external
      const [start, end] = _value.value as DatesRangeValue
      const hovered = start && !end ? hoveredDate.value : null
      const inRange =
        start && hovered
          ? isInRangeGranular(date, [hovered, start], 'month')
          : start && end
            ? isInRangeGranular(date, [start, end], 'month')
            : false
      const firstInRange = start
        ? dayjs(date).isSame(start, 'month') &&
          !(hovered && dayjs(hovered).isBefore(start, 'month'))
        : false
      const lastInRange = end
        ? dayjs(date).isSame(end, 'month')
        : !!(
            start &&
            hovered &&
            dayjs(hovered).isBefore(start, 'month') &&
            dayjs(date).isSame(start, 'month')
          )
      return {
        inRange,
        firstInRange,
        lastInRange,
        ...external,
      }
    }
    const calendarDate = ref<DateStringValue | undefined>(undefined)
    const selectPreset = (value: DatePickerValueType) => {
      const date = Array.isArray(value) ? value[0] : value
      if (date != null) calendarDate.value = date
      setValue(value)
    }

    return () => {
      const calendar = h(Calendar, {
        ...attrs,
        type: props.type,
        value: _value.value,
        date: calendarDate.value,
        onDateChange: (date: DateStringValue) => (calendarDate.value = date),
        defaultLevel: 'year',
        minLevel: 'year',
        onMonthSelect: selectMonth,
        getMonthControlProps: monthControlProps,
        onMonthMouseEnter: (date: DateStringValue) => {
          const [start, end] = Array.isArray(_value.value)
            ? (_value.value as DatesRangeValue)
            : [null, null]
          if (props.type === 'range' && start && !end) hoveredDate.value = date
        },
        onMouseleave: () => {
          hoveredDate.value = null
        },
      })

      if (!props.presets?.length) return calendar

      return h('div', { class: classes.datePickerRoot }, [
        h(
          'div',
          { class: classes.presetsList },
          props.presets.map((preset, index) =>
            h(
              UnstyledButton,
              {
                key: index,
                class: classes.presetButton,
                onClick: () => selectPreset(preset.value),
                onMousedown: (event: MouseEvent) => event.preventDefault(),
              },
              () => preset.label,
            ),
          ),
        ),
        calendar,
      ])
    }
  },
})

export const PickerInputBase = defineComponent({
  name: 'PickerInputBase',
  props: {
    formattedValue: { type: String, default: '' },
    dropdownOpened: Boolean,
    dropdownType: { type: String as PropType<'popover' | 'modal'>, default: 'popover' },
    label: [String, Number, Object, Function] as PropType<any>,
    placeholder: String,
    clearable: Boolean,
    disabled: Boolean,
    required: Boolean,
    error: [String, Boolean] as PropType<any>,
    size: { type: [String, Number], default: 'sm' },
    variant: String as PropType<'default' | 'filled' | 'unstyled'>,
    onClear: Function as PropType<() => void>,
    onDropdownClose: Function as PropType<() => void>,
    onDropdownOpen: Function as PropType<() => void>,
  },
  emits: ['click'],
  inheritAttrs: false,
  setup(props, { slots, emit, attrs }) {
    const opened = ref(props.dropdownOpened)
    watch(
      () => props.dropdownOpened,
      (value) => {
        opened.value = value
      },
    )
    const close = () => {
      opened.value = false
      props.onDropdownClose?.()
    }
    const open = () => {
      if (!props.disabled) {
        opened.value = true
        props.onDropdownOpen?.()
      }
    }

    const target = () =>
      h(
        InputBase,
        {
          ...attrs,
          component: 'button',
          type: 'button',
          label: props.label,
          placeholder: props.placeholder,
          disabled: props.disabled,
          required: props.required,
          error: props.error,
          pointer: true,
          size: props.size,
          variant: props.variant,
          rightSection:
            props.clearable && props.formattedValue
              ? h(CloseButton, {
                  size: props.size,
                  onMousedown: (event: MouseEvent) => event.stopPropagation(),
                  onClick: (event: MouseEvent) => {
                    event.stopPropagation()
                    props.onClear?.()
                  },
                })
              : undefined,
          // A manually-supplied rightSection defaults to pointer-events:none
          // (it's normally just a decorative icon), so the clear button would
          // render but never receive clicks unless we explicitly re-enable
          // pointer events for it here.
          rightSectionPointerEvents: props.clearable && props.formattedValue ? 'all' : undefined,
          onClick: (event: MouseEvent) => {
            emit('click', event)
            open()
          },
        },
        () =>
          props.formattedValue
            ? h('span', props.formattedValue)
            : h('span', { class: classes.placeholder }, props.placeholder),
      )

    return () =>
      props.dropdownType === 'modal'
        ? h(Box, null, () => [
            target(),
            h(
              Modal,
              { opened: opened.value, onClose: close, title: props.label, size: 'auto' },
              () => slots.default?.({ close }),
            ),
          ])
        : h(
            Popover,
            {
              opened: opened.value,
              onChange: (value: boolean) => (value ? open() : close()),
              position: 'bottom-start',
              trapFocus: true,
              returnFocus: false,
            },
            () => [
              h(Popover.Target, null, target),
              h(Popover.Dropdown, { class: classes.dropdown }, () => slots.default?.({ close })),
            ],
          )
  },
})

function createPickerInput(
  name: string,
  Picker: any,
  defaultLevel?: CalendarLevel,
  defaultValueFormat: string = 'MMMM D, YYYY',
) {
  return defineComponent({
    name,
    props: {
      type: { type: String as PropType<DatePickerType>, default: 'default' },
      value: [String, Array, null] as PropType<DatePickerValueType>,
      defaultValue: [String, Array, null] as PropType<DatePickerValueType>,
      onChange: Function as PropType<(value: DatePickerValueType) => void>,
      valueFormat: { type: String, default: defaultValueFormat },
      labelSeparator: { type: String, default: '–' },
      locale: String,
      placeholder: String,
      label: [String, Number, Object, Function] as PropType<any>,
      clearable: Boolean,
      closeOnChange: { type: Boolean, default: true },
      sortDates: { type: Boolean, default: true },
      valueFormatter: Function as PropType<DateFormatter>,
    },
    setup(props, { attrs }) {
      const finalValue = computed<DatePickerValueType>(() =>
        props.type === 'multiple' ? [] : props.type === 'range' ? [null, null] : null,
      )
      const [_value, setValue] = useUncontrolled<DatePickerValueType>({
        value: computed(() => props.value),
        defaultValue: props.defaultValue,
        finalValue: finalValue.value,
        onChange: (value) => props.onChange?.(value),
      })
      const opened = ref(false)
      const formattedValue = computed(() =>
        formatValue(
          _value.value,
          props.type,
          props.valueFormat,
          props.locale,
          props.labelSeparator,
          props.valueFormatter,
        ),
      )
      return () =>
        h(
          PickerInputBase,
          {
            ...attrs,
            formattedValue: formattedValue.value,
            dropdownOpened: opened.value,
            label: props.label,
            placeholder: props.placeholder,
            clearable: props.clearable,
            onDropdownOpen: () => (opened.value = true),
            onDropdownClose: () => (opened.value = false),
            onClear: () => setValue(finalValue.value),
          },
          {
            default: ({ close }: any) =>
              h(Picker, {
                ...attrs,
                type: props.type,
                value: _value.value,
                sortDates: props.sortDates,
                defaultLevel,
                locale: props.locale,
                onChange: (value: DatePickerValueType) => {
                  setValue(value)
                  if (props.closeOnChange && props.type === 'default') close()
                },
              }),
          },
        )
    },
  })
}

export const DatePickerInput = createPickerInput('DatePickerInput', DatePicker)
export const MonthPickerInput = createPickerInput(
  'MonthPickerInput',
  MonthPicker,
  'year',
  'MMMM YYYY',
)
export const YearPickerInput = createPickerInput('YearPickerInput', YearPicker, 'decade', 'YYYY')

export const HiddenDatesInput = defineComponent({
  name: 'HiddenDatesInput',
  props: {
    name: String,
    value: [String, Array, null] as PropType<DatePickerValueType>,
  },
  setup(props) {
    return () => {
      const value = Array.isArray(props.value)
        ? props.value.filter(Boolean).join(',')
        : props.value || ''
      return h('input', { type: 'hidden', name: props.name, value })
    }
  },
})

export function dateStringParser(value: string, format = 'MMMM D, YYYY', locale?: string) {
  return dayjs(value, format, locale || 'en', true).format('YYYY-MM-DD')
}

export function isDateValid({
  date,
  minDate,
  maxDate,
}: {
  date: string
  minDate?: string | Date
  maxDate?: string | Date
}) {
  const parsed = dayjs(date)
  return (
    parsed.isValid() &&
    !isBeforeMin(parsed.format('YYYY-MM-DD'), minDate) &&
    !isAfterMax(parsed.format('YYYY-MM-DD'), maxDate)
  )
}

export const DateInput = defineComponent({
  name: 'DateInput',
  inheritAttrs: false,
  props: {
    value: [String, Date, null] as PropType<string | Date | null>,
    defaultValue: [String, Date, null] as PropType<string | Date | null>,
    onChange: Function as PropType<(value: DateValue) => void>,
    valueFormat: { type: String, default: 'MMMM D, YYYY' },
    dateParser: Function as PropType<(value: string) => DateStringValue | null>,
    locale: String,
    clearable: Boolean,
    minDate: [String, Date] as PropType<string | Date>,
    maxDate: [String, Date] as PropType<string | Date>,
    presets: Array as PropType<Array<{ value: DateValue; label: string }>>,
  },
  // A free-text input that also opens a Calendar dropdown (in a Popover,
  // same as DatePickerInput) on focus/click, so users can either type a
  // date or pick it from the calendar.
  setup(props, { attrs }) {
    const [_value, setValue] = useUncontrolled<DateValue>({
      // normalizeDate() coerces a missing prop to `null`, but useUncontrolled
      // relies on strict `undefined` to detect "no value prop passed" (i.e.
      // uncontrolled usage). Coercing to null here made the component always
      // look controlled-with-null, so setValue() never actually updated
      // anything without an external value/onChange binding.
      value: computed(() => (props.value === undefined ? undefined : normalizeDate(props.value))),
      defaultValue: normalizeDate(props.defaultValue),
      finalValue: null,
      onChange: (value) => props.onChange?.(value),
    })
    const formatValue = (value: DateValue) =>
      value
        ? dayjs(value)
            .locale(props.locale || 'en')
            .format(props.valueFormat)
        : ''
    const inputValue = ref(formatValue(_value.value))
    const opened = ref(false)
    watch(_value, (value) => {
      if (!opened.value) inputValue.value = formatValue(value)
    })
    const parseInput = (raw: string): DateStringValue | null => {
      const parsed =
        props.dateParser?.(raw) || dateStringParser(raw, props.valueFormat, props.locale)
      return dayjs(parsed).isValid() &&
        isDateValid({ date: parsed, minDate: props.minDate, maxDate: props.maxDate })
        ? parsed
        : null
    }
    const commit = () => {
      opened.value = false
      if (!inputValue.value.trim()) {
        if (props.clearable) setValue(null)
        else inputValue.value = formatValue(_value.value)
        return
      }
      const parsed = parseInput(inputValue.value)
      if (parsed) {
        setValue(parsed)
      } else {
        // Invalid input reverts to the last known valid value on blur.
        inputValue.value = formatValue(_value.value)
      }
    }
    const selectDay = (date: DateStringValue) => {
      setValue(date)
      inputValue.value = formatValue(date)
      opened.value = false
    }
    return () =>
      h(Box, null, () =>
        h(
          Popover,
          {
            opened: opened.value,
            onChange: (v: boolean) => (opened.value = v),
            position: 'bottom-start',
          },
          () => [
            h(Popover.Target, null, () =>
              h(InputBase, {
                ...attrs,
                value: inputValue.value,
                onInput: (event: Event) =>
                  (inputValue.value = (event.target as HTMLInputElement).value),
                onFocus: () => (opened.value = true),
                onClick: () => (opened.value = true),
                onBlur: commit,
                onKeydown: (event: KeyboardEvent) => {
                  if (event.key === 'Escape') opened.value = false
                },
                rightSection:
                  props.clearable && _value.value
                    ? h(CloseButton, {
                        onMousedown: (event: MouseEvent) => event.stopPropagation(),
                        onClick: (event: MouseEvent) => {
                          event.stopPropagation()
                          inputValue.value = ''
                          setValue(null)
                        },
                      })
                    : undefined,
                // Without this, the rightSection div defaults to
                // pointer-events:none (it's normally a decorative icon),
                // so the clear button would render but never be clickable.
                rightSectionPointerEvents: props.clearable && _value.value ? 'all' : undefined,
              }),
            ),
            h(
              Popover.Dropdown,
              { onMousedown: (event: MouseEvent) => event.preventDefault() },
              () => [
                props.presets?.length
                  ? h(Group, { gap: 4, mb: 4 }, () =>
                      props.presets?.map((preset, index) =>
                        h(
                          Button,
                          {
                            key: index,
                            size: 'xs',
                            variant: 'light',
                            onClick: () => selectDay(preset.value as DateStringValue),
                          },
                          () => preset.label,
                        ),
                      ),
                    )
                  : null,
                h(Calendar, {
                  defaultDate: _value.value || undefined,
                  minDate: props.minDate,
                  maxDate: props.maxDate,
                  locale: props.locale,
                  getDayProps: (date: DateStringValue) => ({
                    selected: isSameDate(date, _value.value),
                    onClick: () => selectDay(date),
                  }),
                }),
              ],
            ),
          ],
        ),
      )
  },
})

function splitTimeString(value = '') {
  const [time = '', period] = value.split(' ')
  const [hours = '00', minutes = '00', seconds = '00'] = time.split(':')
  return { hours, minutes, seconds, period }
}

export function padTime(value: number | string) {
  return String(value).padStart(2, '0')
}

export interface TimePickerAmPmLabels {
  am: string
  pm: string
}

const defaultAmPmLabels: TimePickerAmPmLabels = { am: 'AM', pm: 'PM' }

export function getParsedTime({
  time,
  format,
  amPmLabels = defaultAmPmLabels,
}: {
  time: string
  format: '12h' | '24h'
  amPmLabels?: TimePickerAmPmLabels
}): { hours: number | null; minutes: number | null; seconds: number | null; amPm: string | null } {
  if (!time) return { hours: null, minutes: null, seconds: null, amPm: null }
  const { hours, minutes, seconds } = splitTimeString(time)
  const h24 = Number(hours)
  const m = Number(minutes)
  const s = Number(seconds)
  if (format === '12h') {
    const amPm = h24 >= 12 ? amPmLabels.pm : amPmLabels.am
    const hour12 = h24 % 12 === 0 ? 12 : h24 % 12
    return { hours: hour12, minutes: m, seconds: s, amPm }
  }
  return { hours: h24, minutes: m, seconds: s, amPm: null }
}

export function getTimeString({
  hours,
  minutes,
  seconds,
  format = '24h',
  withSeconds = false,
  amPm = null,
  amPmLabels = defaultAmPmLabels,
}: {
  hours: number | null
  minutes: number | null
  seconds?: number | null
  format?: '12h' | '24h'
  withSeconds?: boolean
  amPm?: string | null
  amPmLabels?: TimePickerAmPmLabels
}): { valid: boolean; value: string } {
  if (hours === null || minutes === null) return { valid: false, value: '' }
  if (withSeconds && (seconds === null || seconds === undefined)) return { valid: false, value: '' }

  if (format === '24h') {
    return {
      valid: true,
      value: `${padTime(hours)}:${padTime(minutes)}${withSeconds ? `:${padTime(seconds || 0)}` : ''}`,
    }
  }

  if (amPm === null) return { valid: false, value: '' }
  let h24 = hours
  if (amPm === amPmLabels.pm && hours !== 12) h24 += 12
  else if (amPm === amPmLabels.am && hours === 12) h24 = 0
  return {
    valid: true,
    value: `${padTime(h24)}:${padTime(minutes)}${withSeconds ? `:${padTime(seconds || 0)}` : ''}`,
  }
}

export function timeToSeconds(value: string) {
  const { hours, minutes, seconds } = splitTimeString(value)
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds || 0)
}

export function isSameTime(a?: string, b?: string) {
  return !!a && !!b && timeToSeconds(a) === timeToSeconds(b)
}

export function compareTime(a: string, b: string) {
  return timeToSeconds(a) - timeToSeconds(b)
}

export function clampTime(value: string, min?: string, max?: string) {
  if (min && compareTime(value, min) < 0) return min
  if (max && compareTime(value, max) > 0) return max
  return value
}

export function getTimeRange(start: string, end: string, step = 60) {
  const result: string[] = []
  for (let current = timeToSeconds(start); current <= timeToSeconds(end); current += step) {
    const hours = Math.floor(current / 3600)
    const minutes = Math.floor((current % 3600) / 60)
    result.push(`${padTime(hours)}:${padTime(minutes)}`)
  }
  return result
}

export const TimeInput = defineComponent({
  name: 'TimeInput',
  props: {
    withSeconds: Boolean,
    value: String,
    defaultValue: String,
    onChange: Function as PropType<(event: Event) => void>,
  },
  setup(props, { attrs }) {
    return () =>
      h(InputBase, {
        ...attrs,
        type: 'time',
        step: props.withSeconds ? 1 : 60,
        value: props.value,
        defaultValue: props.defaultValue,
        onChange: props.onChange,
      })
  },
})

// TimeGrid renders its own TimeGridControl (a bordered/pill-shaped
// default-variant button) rather than reusing PickerControl (which is styled
// for square date-picker day/month/year cells).
export const TimeGrid = defineComponent({
  name: 'TimeGrid',
  props: {
    data: { type: Array as PropType<string[]>, default: () => [] },
    value: String,
    defaultValue: String,
    minTime: String,
    maxTime: String,
    allowDeselect: Boolean,
    disabled: Boolean,
    onChange: Function as PropType<(value: string | null) => void>,
    getControlProps: Function as PropType<(value: string) => Record<string, any>>,
  },
  setup(props, { attrs }) {
    const [_value, setValue] = useUncontrolled<string | null>({
      value: computed(() => props.value),
      defaultValue: props.defaultValue,
      finalValue: null,
      onChange: (value) => props.onChange?.(value),
    })
    return () =>
      h(Box, { ...attrs, class: [classes.timeGridRoot, (attrs as any).class] }, () =>
        h(SimpleGrid, { cols: 3, spacing: 'xs', class: classes.timeGrid }, () =>
          props.data.map((item) => {
            const isDisabled =
              props.disabled ||
              (props.minTime && compareTime(item, props.minTime) < 0) ||
              (props.maxTime && compareTime(item, props.maxTime) > 0)
            const controlProps = props.getControlProps?.(item) || {}
            const active = isSameTime(_value.value ?? undefined, item)
            return h(
              UnstyledButton,
              {
                ...controlProps,
                class: [classes.timeGridControl, controlProps.class],
                disabled: isDisabled || controlProps.disabled,
                'data-active': active || undefined,
                'data-disabled': isDisabled || controlProps.disabled || undefined,
                onClick: (event: MouseEvent) => {
                  controlProps.onClick?.(event)
                  if (isDisabled) return
                  const nextValue = props.allowDeselect && active ? null : item
                  if (nextValue !== _value.value) setValue(nextValue)
                },
              },
              () => item,
            )
          }),
        ),
      )
  },
})

// Real Mantine's SpinInput is a distinct component from TimeInput: a bare
// numeric text field with digit-typing, arrow-key increment/decrement, and
// auto-advance to the next field once enough digits are typed. It powers
// each hour/minute/second segment inside TimePicker.
export const SpinInput = defineComponent({
  name: 'SpinInput',
  inheritAttrs: false,
  props: {
    value: { type: Number as PropType<number | null>, default: null },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    onChange: Function as PropType<(value: number | null) => void>,
    step: { type: Number, default: 1 },
    onNextInput: Function as PropType<() => void>,
    onPreviousInput: Function as PropType<() => void>,
    allowTemporaryZero: Boolean,
    placeholder: { type: String, default: '--' },
    disableAutoAdvance: Boolean,
    disabled: Boolean,
    readOnly: Boolean,
  },
  setup(props, { attrs }) {
    const maxDigit = () => Number(props.max.toFixed(0)[0])
    const arrowsMax = () => props.max + 1 - props.step

    const handleChange = (raw: string) => {
      if (props.readOnly) return
      const clearValue = raw.replace(/\D/g, '')
      if (clearValue === '') return
      let parsedValue = 0
      for (let i = 0; i < clearValue.length; i += 1) {
        const digit = clearValue.charCodeAt(i) - 48
        const next = parsedValue * 10 + digit
        parsedValue = next > props.max ? digit : next
      }
      const clampedValue =
        props.allowTemporaryZero && parsedValue === 0 && props.min > 0
          ? 0
          : Math.min(Math.max(parsedValue, props.min), props.max)
      props.onChange?.(clampedValue)
      if (!props.disableAutoAdvance && (clampedValue > maxDigit() || raw.startsWith('00'))) {
        props.onNextInput?.()
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (props.readOnly) return
      if (event.key === '0' && props.value === 0) {
        event.preventDefault()
        props.onNextInput?.()
      }
      if (event.key === 'Home') {
        event.preventDefault()
        props.onChange?.(props.min)
      }
      if (event.key === 'End') {
        event.preventDefault()
        props.onChange?.(props.max)
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault()
        if (props.value !== null) props.onChange?.(null)
        else props.onPreviousInput?.()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        props.onNextInput?.()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        props.onPreviousInput?.()
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const newValue =
          props.value === null
            ? props.min
            : Math.min(Math.max(props.value + props.step, props.min), arrowsMax())
        props.onChange?.(newValue)
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const newValue =
          props.value === null
            ? arrowsMax()
            : Math.min(Math.max(props.value - props.step, props.min), arrowsMax())
        props.onChange?.(newValue)
      }
    }

    return () =>
      h('input', {
        ...attrs,
        type: 'text',
        role: 'spinbutton',
        'aria-valuemin': props.min,
        'aria-valuemax': props.max,
        'aria-valuenow': props.value === null ? 0 : props.value,
        'data-empty': props.value === null || undefined,
        inputmode: 'numeric',
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readOnly,
        value: props.value === null ? '' : padTime(props.value),
        onInput: (event: Event) => handleChange((event.target as HTMLInputElement).value),
        onKeydown: handleKeydown,
        onFocus: (event: FocusEvent) => (event.target as HTMLInputElement).select(),
        onClick: (event: MouseEvent) => {
          event.stopPropagation()
          ;(event.target as HTMLInputElement).select()
        },
        onMousedown: (event: MouseEvent) => event.stopPropagation(),
      })
  },
})

export const AmPmInput = defineComponent({
  name: 'AmPmInput',
  props: {
    value: { type: String as PropType<string | null>, default: null },
    labels: { type: Object as PropType<TimePickerAmPmLabels>, default: () => defaultAmPmLabels },
    onChange: Function as PropType<(value: string) => void>,
    disabled: Boolean,
    readOnly: Boolean,
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'select',
        {
          ...attrs,
          class: classes.timePickerField,
          'data-am-pm': true,
          disabled: props.disabled,
          value: props.value ?? props.labels.am,
          onChange: (event: Event) => props.onChange?.((event.target as HTMLSelectElement).value),
        },
        [
          h('option', { value: props.labels.am }, props.labels.am),
          h('option', { value: props.labels.pm }, props.labels.pm),
        ],
      )
  },
})

export const TimeControlsList = defineComponent({
  name: 'TimeControlsList',
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 },
    value: { type: Number as PropType<number | null>, default: null },
    onSelect: Function as PropType<(value: number) => void>,
    formatValue: Function as PropType<(value: number) => string>,
  },
  setup(props) {
    return () =>
      h(ScrollArea, { h: 200 }, () =>
        h(
          'div',
          { class: classes.timePickerControlsList },
          Array.from(
            { length: Math.floor((props.max - props.min) / props.step) + 1 },
            (_, index) => props.min + index * props.step,
          ).map((item) =>
            h(
              UnstyledButton,
              {
                key: item,
                class: classes.timePickerControl,
                'data-active': item === props.value || undefined,
                onClick: () => props.onSelect?.(item),
              },
              () => (props.formatValue ? props.formatValue(item) : padTime(item)),
            ),
          ),
        ),
      )
  },
})

export const TimePicker = defineComponent({
  name: 'TimePicker',
  props: {
    value: String,
    defaultValue: String,
    onChange: Function as PropType<(value: string) => void>,
    withSeconds: Boolean,
    min: String,
    max: String,
    format: { type: String as PropType<'12h' | '24h'>, default: '24h' },
    amPmLabels: {
      type: Object as PropType<TimePickerAmPmLabels>,
      default: () => defaultAmPmLabels,
    },
    hoursStep: { type: Number, default: 1 },
    minutesStep: { type: Number, default: 1 },
    secondsStep: { type: Number, default: 1 },
    clearable: Boolean,
    withDropdown: Boolean,
    disabled: Boolean,
    readOnly: Boolean,
    size: { type: [String, Number], default: 'sm' },
    presets: Array as PropType<Array<{ value: string; label: string }>>,
    // A ref object supplied by the parent (e.g. DateTimePicker) that gets
    // populated with the actual hours <input> DOM node, so the parent can
    // call .focus() on it directly to auto-focus the time input after a
    // date is picked.
    hoursRef: Object as PropType<{ value: any }>,
  },
  setup(props, { attrs }) {
    const [_value, setValue] = useUncontrolled<string>({
      value: computed(() => props.value),
      defaultValue: props.defaultValue,
      finalValue: '',
      onChange: (value) => props.onChange?.(value),
    })

    const parsed = computed(() =>
      getParsedTime({ time: _value.value, format: props.format, amPmLabels: props.amPmLabels }),
    )
    const hours = ref(parsed.value.hours)
    const minutes = ref(parsed.value.minutes)
    const seconds = ref(parsed.value.seconds)
    const amPm = ref(parsed.value.amPm)
    watch(_value, (value) => {
      const next = getParsedTime({
        time: value,
        format: props.format,
        amPmLabels: props.amPmLabels,
      })
      hours.value = next.hours
      minutes.value = next.minutes
      seconds.value = next.seconds
      amPm.value = next.amPm
    })

    // Refs to the SpinInput/AmPmInput component instances (not raw DOM
    // nodes) - see focusRef() below for how these are used to call .focus().
    const hoursRef = ref<any>()
    const minutesRef = ref<any>()
    const secondsRef = ref<any>()
    const amPmRef = ref<any>()
    // SpinInput/AmPmInput are components, so their `ref` resolves to the
    // component instance rather than the underlying DOM node - fall back to
    // `.$el` (or use the value directly if it's already an element, e.g. a
    // plain DOM ref) to actually call .focus() on the input.
    const focusRef = (target: any) => {
      const el = target?.$el ?? target
      el?.focus?.()
    }
    const focus = (field: 'hours' | 'minutes' | 'seconds' | 'amPm') => {
      focusRef(
        (field === 'hours'
          ? hoursRef
          : field === 'minutes'
            ? minutesRef
            : field === 'seconds'
              ? secondsRef
              : amPmRef
        ).value,
      )
    }
    watch(
      hoursRef,
      (val) => {
        if (props.hoursRef) props.hoursRef.value = val?.$el ?? val
      },
      { immediate: true },
    )

    const commit = () => {
      const result = getTimeString({
        hours: hours.value,
        minutes: minutes.value,
        seconds: seconds.value,
        format: props.format,
        withSeconds: props.withSeconds,
        amPm: amPm.value,
        amPmLabels: props.amPmLabels,
      })
      setValue(result.valid ? result.value : '')
    }

    const setHours = (value: number | null) => {
      let adjusted = value
      if (props.format === '12h' && typeof value === 'number' && value > 12) {
        adjusted = ((value - 1) % 12) + 1
      }
      hours.value = adjusted
      commit()
      focus('hours')
    }
    const setMinutes = (value: number | null) => {
      minutes.value = value
      commit()
      focus('minutes')
    }
    const setSeconds = (value: number | null) => {
      seconds.value = value
      commit()
      focus('seconds')
    }
    const setAmPm = (value: string | null) => {
      amPm.value = value
      commit()
      focus('amPm')
    }
    const clear = () => {
      hours.value = null
      minutes.value = null
      seconds.value = null
      amPm.value = null
      setValue('')
      focus('hours')
    }

    const isClearable = computed(
      () =>
        props.clearable &&
        !props.readOnly &&
        !props.disabled &&
        (hours.value !== null ||
          minutes.value !== null ||
          seconds.value !== null ||
          amPm.value !== null),
    )

    const opened = ref(false)

    return () =>
      h(
        Popover,
        {
          opened: props.withDropdown && opened.value,
          position: 'bottom-start',
          transitionProps: { duration: 0 },
        },
        () => [
          h(Popover.Target, null, () =>
            h(
              InputBase,
              {
                ...attrs,
                component: 'div',
                size: props.size,
                disabled: props.disabled,
                onClick: () => {
                  focus('hours')
                  if (props.withDropdown) opened.value = true
                },
                onMousedown: (event: MouseEvent) => event.preventDefault(),
                onFocusin: () => {
                  if (props.withDropdown) opened.value = true
                },
                onFocusout: () => {
                  if (props.withDropdown) opened.value = false
                },
                rightSection: isClearable.value
                  ? h(CloseButton, {
                      size: props.size,
                      onMousedown: (event: MouseEvent) => event.preventDefault(),
                      onClick: clear,
                    })
                  : undefined,
                rightSectionPointerEvents: isClearable.value ? 'all' : undefined,
              },
              () => [
                h('div', { class: classes.timePickerFieldsRoot, dir: 'ltr' }, [
                  h('div', { class: classes.timePickerFieldsGroup }, [
                    h(SpinInput, {
                      ref: hoursRef,
                      class: classes.timePickerField,
                      value: hours.value,
                      min: props.format === '12h' ? 1 : 0,
                      max: props.format === '12h' ? 12 : 23,
                      step: props.hoursStep,
                      onChange: setHours,
                      onNextInput: () => focus('minutes'),
                      allowTemporaryZero: props.format === '12h',
                      readOnly: props.readOnly,
                      disabled: props.disabled,
                      placeholder: '--',
                    }),
                    h('span', ':'),
                    h(SpinInput, {
                      ref: minutesRef,
                      class: classes.timePickerField,
                      value: minutes.value,
                      min: 0,
                      max: 59,
                      step: props.minutesStep,
                      onChange: setMinutes,
                      onPreviousInput: () => focus('hours'),
                      onNextInput: () => focus(props.withSeconds ? 'seconds' : 'amPm'),
                      readOnly: props.readOnly,
                      disabled: props.disabled,
                      placeholder: '--',
                    }),
                    props.withSeconds ? h('span', ':') : null,
                    props.withSeconds
                      ? h(SpinInput, {
                          ref: secondsRef,
                          class: classes.timePickerField,
                          value: seconds.value,
                          min: 0,
                          max: 59,
                          step: props.secondsStep,
                          onChange: setSeconds,
                          onPreviousInput: () => focus('minutes'),
                          onNextInput: () => focus('amPm'),
                          readOnly: props.readOnly,
                          disabled: props.disabled,
                          placeholder: '--',
                        })
                      : null,
                    props.format === '12h'
                      ? h(AmPmInput, {
                          ref: amPmRef,
                          value: amPm.value,
                          labels: props.amPmLabels,
                          onChange: setAmPm,
                          readOnly: props.readOnly,
                          disabled: props.disabled,
                        })
                      : null,
                  ]),
                ]),
              ],
            ),
          ),
          h(
            Popover.Dropdown,
            {
              class: classes.timePickerDropdown,
              onMousedown: (event: MouseEvent) => event.preventDefault(),
            },
            () => [
              props.presets?.length
                ? h(Group, { gap: 4, class: classes.timePickerPresetsGroup }, () =>
                    props.presets?.map((preset) =>
                      h(
                        Button,
                        { size: 'xs', variant: 'light', onClick: () => setValue(preset.value) },
                        () => preset.label,
                      ),
                    ),
                  )
                : h('div', { class: classes.timePickerControlsListGroup }, [
                    h(TimeControlsList, {
                      min: props.format === '12h' ? 1 : 0,
                      max: props.format === '12h' ? 12 : 23,
                      step: props.hoursStep,
                      value: hours.value,
                      onSelect: setHours,
                    }),
                    h(TimeControlsList, {
                      min: 0,
                      max: 59,
                      step: props.minutesStep,
                      value: minutes.value,
                      onSelect: setMinutes,
                    }),
                    props.withSeconds
                      ? h(TimeControlsList, {
                          min: 0,
                          max: 59,
                          step: props.secondsStep,
                          value: seconds.value,
                          onSelect: setSeconds,
                        })
                      : null,
                  ]),
            ],
          ),
        ],
      )
  },
})

export const TimeValue = defineComponent({
  name: 'TimeValue',
  props: {
    value: { type: [String, Date] as PropType<string | Date>, required: true },
    format: { type: String, default: 'HH:mm' },
    locale: String,
  },
  setup(props, { attrs }) {
    return () =>
      h(Text, attrs, () =>
        (props.value instanceof Date ? dayjs(props.value) : dayjs(`2024-01-01 ${props.value}`))
          .locale(props.locale || 'en')
          .format(props.format),
      )
  },
})

export const DateTimePicker = defineComponent({
  name: 'DateTimePicker',
  props: {
    value: [String, Date, null] as PropType<string | Date | null>,
    defaultValue: [String, Date, null] as PropType<string | Date | null>,
    onChange: Function as PropType<(value: Date | null) => void>,
    valueFormat: { type: String, default: 'MMMM D, YYYY h:mm A' },
    clearable: Boolean,
    withSeconds: Boolean,
    size: { type: [String, Number], default: 'sm' },
    submitButtonProps: Object as PropType<Record<string, any>>,
  },
  setup(props, { attrs }) {
    // Populated with the actual hours <input> DOM node once TimePicker
    // mounts (see TimePicker's hoursRef prop) so we can auto-focus it right
    // after a date is picked from the calendar.
    const hoursRef = ref<any>()
    const [_value, setValue] = useUncontrolled<Date | null>({
      // Must stay `undefined` (not coerced to null) when props.value isn't
      // passed at all - useUncontrolled uses strict undefined-checking to
      // decide whether the component is controlled. Coercing a missing prop
      // to null made this component permanently "controlled with null",
      // so picking a date/time in the dropdown never updated anything
      // without an external value/onChange binding - the picker looked
      // completely broken/inert.
      value: computed(() =>
        props.value === undefined ? undefined : props.value === null ? null : new Date(props.value),
      ),
      defaultValue: props.defaultValue ? new Date(props.defaultValue) : null,
      finalValue: null,
      onChange: (value) => props.onChange?.(value),
    })
    const date = computed(() => (_value.value ? dayjs(_value.value).format('YYYY-MM-DD') : null))
    const time = computed(() =>
      _value.value ? dayjs(_value.value).format(props.withSeconds ? 'HH:mm:ss' : 'HH:mm') : '',
    )
    const updateDate = (nextDate: DatePickerValueType) => {
      if (!nextDate || Array.isArray(nextDate)) return
      setValue(assignTime(nextDate, `2024-01-01 ${time.value || '00:00'}`))
      // As soon as a date is picked, move focus straight to the time input's
      // hours field.
      hoursRef.value?.focus?.()
    }
    const updateTime = (nextTime: string) => {
      if (date.value) setValue(assignTime(date.value, `2024-01-01 ${nextTime}`))
    }
    return () =>
      h(
        PickerInputBase,
        {
          ...attrs,
          formattedValue: _value.value ? dayjs(_value.value).format(props.valueFormat) : '',
          clearable: props.clearable,
          onClear: () => setValue(null),
        },
        {
          default: ({ close }: { close: () => void }) =>
            h('div', { class: classes.dateTimePicker }, [
              // fullWidth is explicitly overridden to false here -
              // fullWidth:true is only meant for a standalone
              // InlineDateTimePicker embedded directly in a page. Inside a
              // Popover dropdown (this component), the dropdown itself sizes
              // to content (width:max-content), so a fullWidth calendar has
              // nothing definite to size against and blows out to fill the
              // viewport instead, with its contents getting squashed.
              h(DatePicker, { fullWidth: false, value: date.value, onChange: updateDate }),
              h('div', { class: classes.timeWrapper }, [
                // `class` can't be passed directly to TimePicker here: its
                // render root is a Popover call, and Popover has
                // inheritAttrs:false and never even reads `attrs` in its own
                // setup(), so a class handed to TimePicker silently gets
                // dropped along that path and never reaches any real DOM
                // node. Wrapping it in a plain div instead guarantees
                // `.timeInput`'s `flex: 1` actually lands on an element
                // inside the `.timeWrapper` flex row.
                // For a plain DOM element (not a component), h()'s third
                // argument must be actual children - a bare function is only
                // auto-invoked as the default slot for component vnodes, so
                // passing one here silently rendered an empty div.
                h('div', { class: classes.timeInput }, [
                  h(TimePicker, {
                    value: time.value,
                    withSeconds: props.withSeconds,
                    size: props.size,
                    hoursRef,
                    onChange: updateTime,
                  }),
                ]),
                h(
                  ActionIcon,
                  {
                    variant: 'default',
                    size: `input-${props.size || 'sm'}`,
                    'data-mantine-stop-propagation': true,
                    ...props.submitButtonProps,
                    onClick: (event: MouseEvent) => {
                      props.submitButtonProps?.onClick?.(event)
                      close()
                    },
                  },
                  () => h(CheckIcon, { size: '30%' }),
                ),
              ]),
            ]),
        },
      )
  },
})

export const InlineDateTimePicker = DateTimePicker

export const MiniCalendar = defineComponent({
  name: 'MiniCalendar',
  props: {
    date: [String, Date] as PropType<string | Date>,
    defaultDate: [String, Date] as PropType<string | Date>,
    onDateChange: Function as PropType<(date: DateStringValue) => void>,
    value: [String, Date, null] as PropType<string | Date | null>,
    onChange: Function as PropType<(date: DateStringValue) => void>,
    maxDate: [String, Date] as PropType<string | Date>,
    minDate: [String, Date] as PropType<string | Date>,
    numberOfDays: { type: Number, default: 7 },
    monthLabelFormat: { type: String, default: 'MMM' },
    onNext: Function as PropType<() => void>,
    onPrevious: Function as PropType<() => void>,
    getDayProps: Function as PropType<(date: DateStringValue) => Record<string, any>>,
    size: { type: String as PropType<MantineSize>, default: 'sm' },
    previousControlProps: Object as PropType<Record<string, any>>,
    nextControlProps: Object as PropType<Record<string, any>>,
    locale: String,
  },
  setup(props, { attrs }) {
    const ctx = useDatesContext()
    const [_date, setDate] = useUncontrolled<DateStringValue>({
      value: computed(() => toDateString(props.date ?? null) ?? undefined),
      defaultValue: toDateString(props.defaultDate ?? null) ?? undefined,
      finalValue: toDateString(props.value ?? null) || dayjs().format('YYYY-MM-DD'),
      onChange: (value) => props.onDateChange?.(value),
    })

    const handleNext = () => {
      props.onNext?.()
      setDate(dayjs(_date.value).add(props.numberOfDays, 'days').format('YYYY-MM-DD'))
    }
    const handlePrevious = () => {
      props.onPrevious?.()
      setDate(dayjs(_date.value).subtract(props.numberOfDays, 'days').format('YYYY-MM-DD'))
    }

    return () => {
      const previousDisabled = props.minDate
        ? dayjs(_date.value).subtract(1, 'days').isBefore(dayjs(props.minDate))
        : false
      const nextDisabled = props.maxDate
        ? dayjs(_date.value).add(props.numberOfDays, 'days').isAfter(dayjs(props.maxDate))
        : false

      const range = Array.from({ length: props.numberOfDays }, (_, index) =>
        dayjs(_date.value).add(index, 'days'),
      ).map((date) => {
        const disabled =
          (props.minDate && date.isBefore(dayjs(props.minDate), 'day')) ||
          (props.maxDate && date.isAfter(dayjs(props.maxDate), 'day')) ||
          false
        const dayProps = props.getDayProps?.(toDateString(date.format('YYYY-MM-DD'))!) || {}

        return h(
          UnstyledButton,
          {
            key: date.toString(),
            disabled,
            'aria-label': date.format('YYYY-MM-DD'),
            'data-disabled': disabled || undefined,
            'data-selected': (props.value && dayjs(date).isSame(props.value, 'day')) || undefined,
            ...dayProps,
            class: [classes.miniCalendarDay, dayProps.class],
            onClick: (event: MouseEvent) => {
              dayProps.onClick?.(event)
              props.onChange?.(toDateString(date.format('YYYY-MM-DD'))!)
            },
          },
          () => [
            h(
              'span',
              { class: classes.miniCalendarDayMonth },
              date.locale(props.locale || ctx.locale).format(props.monthLabelFormat),
            ),
            h('span', { class: classes.miniCalendarDayNumber }, String(date.date())),
          ],
        )
      })

      return h(Box, { ...attrs, class: [classes.miniCalendarRoot, (attrs as any).class] }, () => [
        h(
          UnstyledButton,
          {
            onClick: handlePrevious,
            disabled: previousDisabled,
            'data-disabled': previousDisabled || undefined,
            'data-direction': 'previous',
            ...props.previousControlProps,
            class: [classes.miniCalendarControl, props.previousControlProps?.class],
          },
          () =>
            props.previousControlProps?.children ||
            h(AccordionChevron, { 'data-chevron': true, size: props.size }),
        ),
        h('div', { class: classes.miniCalendarDays }, range),
        h(
          UnstyledButton,
          {
            onClick: handleNext,
            disabled: nextDisabled,
            'data-disabled': nextDisabled || undefined,
            'data-direction': 'next',
            ...props.nextControlProps,
            class: [classes.miniCalendarControl, props.nextControlProps?.class],
          },
          () =>
            props.nextControlProps?.children ||
            h(AccordionChevron, { 'data-chevron': true, size: props.size }),
        ),
      ])
    }
  },
})

export const getFormattedTime = ({
  value,
  format = 'HH:mm',
}: {
  value: string | Date
  format?: string
}) => (value instanceof Date ? dayjs(value) : dayjs(`2024-01-01 ${value}`)).format(format)

export type DayProps = InstanceType<typeof Day>['$props']
export type CalendarProps = InstanceType<typeof Calendar>['$props']
export type DatePickerProps = InstanceType<typeof DatePicker>['$props']
export type DatePickerInputProps = InstanceType<typeof DatePickerInput>['$props']
export type DateInputProps = InstanceType<typeof DateInput>['$props']
export type TimeInputProps = InstanceType<typeof TimeInput>['$props']
export type TimePickerProps = InstanceType<typeof TimePicker>['$props']
export type TimeGridProps = InstanceType<typeof TimeGrid>['$props']
export type TimeValueProps = InstanceType<typeof TimeValue>['$props']
export type DateTimePickerProps = InstanceType<typeof DateTimePicker>['$props']
export type MiniCalendarProps = InstanceType<typeof MiniCalendar>['$props']
export type DatesStylesNames = keyof typeof classes
export type PickerBaseProps = Record<string, any>
export type ControlsGroupSettings = Record<string, any>
export type DateInputSharedProps = Record<string, any>
export type CalendarSettings = Record<string, any>
export type CalendarBaseProps = Record<string, any>
export type CalendarAriaLabels = Record<string, string>
export type MonthLevelSettings = Record<string, any>
export type YearLevelSettings = Record<string, any>
export type DecadeLevelSettings = Record<string, any>
export type TimePickerPresets = Array<{ value: string; label: string }>
export type TimeGridData = string[]
export type TimeGridStylesNames = DatesStylesNames
export type TimePickerStylesNames = DatesStylesNames
export type DatePickerStylesNames = DatesStylesNames
export type DatePickerInputStylesNames = DatesStylesNames
export type DateInputStylesNames = DatesStylesNames
export type CalendarStylesNames = DatesStylesNames

void ({} as CSSProperties)
