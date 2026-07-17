import { defineComponent, h, inject, provide, ref, type InjectionKey, type PropType } from 'vue'
import {
  AccordionChevron,
  Box,
  createScopedKeydownHandler,
  Popover,
  UnstyledButton,
  useDirection,
} from '@mantine-vue/core'
import { getLabel, type ScheduleLabelsOverride } from '../../labels'
import type { ScheduleViewLevel } from '../../types'
import type {
  HeaderControlProps,
  MonthYearSelectProps,
  ScheduleHeaderProps,
  ViewSelectProps,
} from '../../component-props'
import { formatDate, getMonthsList, getYearsList } from '../../utils'
import classes from './ScheduleHeader.module.css'
import controlClasses from './HeaderControl/HeaderControl.module.css'
import viewClasses from './ViewSelect/ViewSelect.module.css'
import monthYearClasses from './MonthYearSelect/MonthYearSelect.module.css'

const labelsKey: InjectionKey<ScheduleLabelsOverride | undefined> = Symbol('schedule-header-labels')

const commonControlProps = {
  active: Boolean,
  square: Boolean,
  radius: [String, Number] as PropType<string | number>,
  interactive: { type: Boolean, default: true },
  labels: Object as PropType<ScheduleLabelsOverride>,
}

function resolveRadius(radius: string | number | undefined) {
  if (radius == null) return undefined
  if (typeof radius === 'number') return `${radius}px`
  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(radius)
    ? `var(--mantine-radius-${radius})`
    : radius
}

export const HeaderControl = defineComponent({
  name: 'HeaderControl',
  inheritAttrs: false,
  props: commonControlProps,
  setup(props, { attrs, slots }) {
    return () =>
      h(
        UnstyledButton,
        {
          ...attrs,
          class: [controlClasses.headerControl, attrs.class],
          style: [
            props.radius == null ? undefined : { '--control-radius': resolveRadius(props.radius) },
            attrs.style,
          ],
          tabindex: props.interactive ? (attrs as { tabindex?: number }).tabindex : -1,
          mod: {
            active: props.active,
            square: props.square,
            interactive: props.interactive,
          },
        },
        () => slots.default?.(),
      )
  },
})

function directionalControl(name: string, type: 'next' | 'previous') {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: commonControlProps,
    setup(props, { attrs }) {
      const inherited = inject(labelsKey, undefined)
      const { dir } = useDirection()
      return () =>
        h(
          HeaderControl,
          {
            ...attrs,
            ...props,
            square: true,
            'data-type': type,
            'aria-label': getLabel(type, props.labels || inherited),
          },
          () =>
            h(AccordionChevron, {
              style: {
                transform: `rotate(${type === 'next' ? (dir.value === 'rtl' ? 90 : -90) : dir.value === 'rtl' ? -90 : 90}deg)`,
              },
            }),
        )
    },
  })
}

export const ScheduleHeaderNext = directionalControl('ScheduleHeaderNext', 'next')
export const ScheduleHeaderPrevious = directionalControl('ScheduleHeaderPrevious', 'previous')

export const ScheduleHeaderToday = defineComponent({
  name: 'ScheduleHeaderToday',
  inheritAttrs: false,
  props: commonControlProps,
  setup(props, { attrs }) {
    const inherited = inject(labelsKey, undefined)
    return () =>
      h(
        HeaderControl,
        {
          ...attrs,
          ...props,
          'data-type': 'today',
          'aria-label': getLabel('today', props.labels || inherited),
        },
        () => getLabel('today', props.labels || inherited),
      )
  },
})

export const ViewSelect = defineComponent({
  name: 'ViewSelect',
  inheritAttrs: false,
  props: {
    views: {
      type: Array as PropType<readonly ScheduleViewLevel[]>,
      default: () => ['day', 'week', 'month', 'year'],
    },
    value: String as PropType<ScheduleViewLevel>,
    onChange: Function as PropType<(view: ScheduleViewLevel) => void>,
    radius: [String, Number] as PropType<string | number>,
    labels: Object as PropType<ScheduleLabelsOverride>,
  },
  setup(props, { attrs }) {
    const inherited = inject(labelsKey, undefined)
    const switchLabels: Record<ScheduleViewLevel, keyof import('../../labels').ScheduleLabels> = {
      day: 'switchToDayView',
      week: 'switchToWeekView',
      month: 'switchToMonthView',
      year: 'switchToYearView',
    }
    const onKeydown = (event: KeyboardEvent, index: number) => {
      const controls = (
        event.currentTarget as HTMLElement
      ).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      if (!controls?.length) return
      let next = index
      if (event.key === 'ArrowRight') next = (index + 1) % controls.length
      else if (event.key === 'ArrowLeft') next = (index - 1 + controls.length) % controls.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = controls.length - 1
      else return
      event.preventDefault()
      controls[next]?.focus()
    }
    return () => {
      const labels = props.labels || inherited
      return h(
        Box,
        {
          ...attrs,
          class: [viewClasses.viewSelect, attrs.class],
          role: 'tablist',
          'aria-label': getLabel('viewSelectLabel', labels),
        },
        () =>
          props.views.map((view, index) =>
            h(
              HeaderControl,
              {
                active: view === props.value,
                radius: props.radius,
                role: 'tab',
                'data-type': view,
                'aria-selected': view === props.value,
                'aria-label': getLabel(switchLabels[view], labels),
                tabindex: view === props.value ? 0 : -1,
                onClick: () => props.onChange?.(view),
                onKeydown: (event: KeyboardEvent) => onKeydown(event, index),
              },
              () => getLabel(view, labels),
            ),
          ),
      )
    }
  },
})

export const MonthYearSelect = defineComponent({
  name: 'MonthYearSelect',
  inheritAttrs: false,
  props: {
    locale: String,
    startYear: Number,
    endYear: Number,
    yearValue: Number,
    monthValue: Number,
    onYearChange: Function as PropType<(year: number) => void>,
    onMonthChange: Function as PropType<(month: number) => void>,
    monthsListFormat: [String, Function] as PropType<MonthYearSelectProps['monthsListFormat']>,
    labelFormat: [String, Function] as PropType<MonthYearSelectProps['labelFormat']>,
    radius: [String, Number] as PropType<string | number>,
    getYearControlProps: Function as PropType<MonthYearSelectProps['getYearControlProps']>,
    getMonthControlProps: Function as PropType<MonthYearSelectProps['getMonthControlProps']>,
    withMonths: { type: Boolean, default: true },
    labels: Object as PropType<ScheduleLabelsOverride>,
  },
  setup(props, { attrs }) {
    const inherited = inject(labelsKey, undefined)
    const opened = ref(false)
    const today = new Date()
    return () => {
      const labels = props.labels || inherited
      const startYear = props.startYear ?? today.getFullYear() - 5
      const endYear = props.endYear ?? today.getFullYear() + 5
      const selected = new Date(
        props.yearValue ?? today.getFullYear(),
        props.monthValue ?? today.getMonth(),
        1,
      )
      const hasActiveYear =
        props.yearValue !== undefined && props.yearValue >= startYear && props.yearValue <= endYear

      const months = props.withMonths
        ? getMonthsList({
            locale: props.locale || 'en',
            format: props.monthsListFormat || 'MMMM',
          }).map((month) => {
            const extra = props.getMonthControlProps?.(month.month) || {}
            return h(
              UnstyledButton,
              {
                ...extra,
                class: [monthYearClasses.monthYearSelectControl, extra.class],
                mod: { type: 'month', active: month.month === props.monthValue },
                tabindex: month.month === props.monthValue ? 0 : -1,
                'aria-label': `${getLabel('selectMonth', labels)} ${month.name}`,
                onKeydown: createScopedKeydownHandler({
                  siblingSelector: '[data-type="month"]:not(:disabled)',
                  parentSelector: '[data-list]',
                  activateOnFocus: false,
                  loop: true,
                  orientation: 'vertical',
                  onKeydown: extra.onKeydown,
                }),
                onClick: () => {
                  props.onMonthChange?.(month.month)
                },
              },
              () => month.name,
            )
          })
        : []

      const years = getYearsList({ startYear, endYear }).map((year, index) => {
        const extra = props.getYearControlProps?.(year) || {}
        return h(
          UnstyledButton,
          {
            ...extra,
            class: [monthYearClasses.monthYearSelectControl, extra.class],
            mod: { type: 'year', active: year === props.yearValue },
            tabindex: hasActiveYear ? (year === props.yearValue ? 0 : -1) : index === 0 ? 0 : -1,
            'aria-label': `${getLabel('selectYear', labels)} ${year}`,
            onKeydown: createScopedKeydownHandler({
              siblingSelector: '[data-type="year"]:not(:disabled)',
              parentSelector: '[data-list]',
              activateOnFocus: false,
              loop: true,
              orientation: 'vertical',
              onKeydown: extra.onKeydown,
            }),
            onClick: () => {
              props.onYearChange?.(year)
              if (!props.withMonths) opened.value = false
            },
          },
          () => String(year),
        )
      })

      return h(
        Popover,
        {
          position: 'bottom-start',
          trapFocus: true,
          transitionProps: { transition: 'pop', duration: 120 },
          radius: props.radius || 'var(--schedule-radius, var(--mantine-radius-default))',
          shadow: 'md',
          offset: 3,
          width: props.withMonths ? undefined : 'target',
          opened: opened.value,
          onChange: (value: boolean) => {
            opened.value = value
          },
        },
        () => [
          h(Popover.Target, null, () =>
            h(
              HeaderControl,
              {
                ...attrs,
                class: [monthYearClasses.monthYearSelectTarget, attrs.class],
                radius: props.radius,
                'data-with-months': props.withMonths || undefined,
                onClick: () => {
                  opened.value = !opened.value
                },
              },
              () =>
                formatDate({
                  date: selected,
                  locale: props.locale || 'en',
                  format: props.labelFormat || (props.withMonths ? 'MMMM YYYY' : 'YYYY'),
                }),
            ),
          ),
          h(
            Popover.Dropdown,
            {
              class: monthYearClasses.monthYearSelectDropdown,
              'data-with-months': props.withMonths || undefined,
            },
            () => [
              props.withMonths
                ? h(Box, { class: monthYearClasses.monthYearSelectList, 'data-list': true }, () => [
                    h(Box, { class: monthYearClasses.monthYearSelectLabel }, () =>
                      getLabel('month', labels),
                    ),
                    ...months,
                  ])
                : null,
              h(Box, { class: monthYearClasses.monthYearSelectList, 'data-list': true }, () => [
                props.withMonths
                  ? h(Box, { class: monthYearClasses.monthYearSelectLabel }, () =>
                      getLabel('year', labels),
                    )
                  : null,
                ...years,
              ]),
            ],
          ),
        ],
      )
    }
  },
})

const ScheduleHeaderBaseComponent = defineComponent({
  name: 'ScheduleHeader',
  inheritAttrs: false,
  props: { labels: Object as PropType<ScheduleLabelsOverride> },
  setup(props, { attrs, slots }) {
    provide(labelsKey, props.labels)
    return () => h(Box, { ...attrs, class: [classes.header, attrs.class] }, () => slots.default?.())
  },
})

export const ScheduleHeader = Object.assign(ScheduleHeaderBaseComponent, {
  Control: HeaderControl,
  Next: ScheduleHeaderNext,
  Previous: ScheduleHeaderPrevious,
  Today: ScheduleHeaderToday,
  ViewSelect,
  MonthYearSelect,
})

export type { HeaderControlProps, MonthYearSelectProps, ScheduleHeaderProps, ViewSelectProps }
export type HeaderControlStylesNames = 'headerControl'
export type ViewSelectStylesNames = 'viewSelect'
export type MonthYearSelectStylesNames =
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'
export type ScheduleHeaderStylesNames = 'header'
export type CombinedScheduleHeaderStylesNames =
  | ScheduleHeaderStylesNames
  | HeaderControlStylesNames
  | ViewSelectStylesNames
  | MonthYearSelectStylesNames

void ({} as HeaderControlProps)
void ({} as ViewSelectProps)
void ({} as ScheduleHeaderProps)
