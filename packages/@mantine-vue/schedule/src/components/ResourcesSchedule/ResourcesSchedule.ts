import dayjs from 'dayjs'
import { defineComponent, h, ref, watch, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { Box } from '@mantine-vue/core'
import type { RenderEventBody } from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type {
  DateStringValue,
  ScheduleEventData,
  ScheduleMode,
  ScheduleResourceData,
  ScheduleResourceGroup,
  ScheduleViewLevel,
} from '../../types'
import { toDateString } from '../../utils'
import {
  ResourcesDayView,
  type ResourcesDayViewProps,
  type ResourcesDayViewStylesNames,
} from '../ResourcesDayView/ResourcesDayView'
import {
  ResourcesMonthView,
  type ResourcesMonthViewProps,
  type ResourcesMonthViewStylesNames,
} from '../ResourcesMonthView/ResourcesMonthView'
import {
  ResourcesWeekView,
  type ResourcesWeekViewProps,
  type ResourcesWeekViewStylesNames,
} from '../ResourcesWeekView/ResourcesWeekView'
import classes from './ResourcesSchedule.module.css'

export type ResourcesScheduleStylesNames =
  | 'root'
  | ResourcesDayViewStylesNames
  | ResourcesWeekViewStylesNames
  | ResourcesMonthViewStylesNames

export type ResourcesScheduleViewLevel = 'day' | 'week' | 'month'

type ResourcesScheduleCommonProps =
  | 'date'
  | 'onDateChange'
  | 'resources'
  | 'events'
  | 'locale'
  | 'radius'
  | 'labels'
  | 'renderEventBody'
  | 'renderResourceLabel'
  | 'withEventsDragAndDrop'
  | 'onEventDrop'
  | 'canDragEvent'
  | 'onEventDragStart'
  | 'onEventDragEnd'
  | 'onTimeSlotClick'
  | 'onEventClick'
  | 'onDayClick'
  | 'withDragSlotSelect'
  | 'onSlotDragEnd'
  | 'onViewChange'
  | 'mode'
  | 'onExternalEventDrop'
  | 'withEventResize'
  | 'onEventResize'
  | 'canResizeEvent'
  | 'recurrenceExpansionLimit'

/** View-specific props with the shared/common props removed */
export type ResourcesScheduleViewProps<T> = Partial<Omit<T, ResourcesScheduleCommonProps>>

export interface ResourcesScheduleProps {
  /** List of resources to display */
  resources: ScheduleResourceData[]

  /** Current date to display (controlled) */
  date?: Date | DateStringValue

  /** Default date (uncontrolled) */
  defaultDate?: Date | DateStringValue

  /** Called when date changes via navigation */
  onDateChange?: (date: DateStringValue) => void

  /** Current view level (controlled) */
  view?: ResourcesScheduleViewLevel

  /** Default view level (uncontrolled) @default 'day' */
  defaultView?: ResourcesScheduleViewLevel

  /** Called when view level changes */
  onViewChange?: (view: ResourcesScheduleViewLevel) => void

  /** Events to display across all views */
  events?: ScheduleEventData[]

  /** Locale for date formatting */
  locale?: string

  /** Key of theme.radius or any valid CSS value to set border-radius */
  radius?: string | number

  /** Labels override for i18n */
  labels?: ScheduleLabelsOverride

  /** Custom event body renderer */
  renderEventBody?: RenderEventBody

  /** Custom resource label renderer */
  renderResourceLabel?: (resource: ScheduleResourceData) => VNodeChild

  /** Enable drag and drop for events @default false */
  withEventsDragAndDrop?: boolean

  /** Called when event is dropped */
  onEventDrop?: ResourcesDayViewProps['onEventDrop']

  /** Function to determine if event can be dragged */
  canDragEvent?: ResourcesDayViewProps['canDragEvent']

  /** Called when any event drag starts */
  onEventDragStart?: ResourcesDayViewProps['onEventDragStart']

  /** Called when any event drag ends */
  onEventDragEnd?: ResourcesDayViewProps['onEventDragEnd']

  /** Called when time slot is clicked (day/week views) */
  onTimeSlotClick?: ResourcesDayViewProps['onTimeSlotClick']

  /** Called when day is clicked in month view */
  onDayClick?: ResourcesMonthViewProps['onDayClick']

  /** Called when event is clicked */
  onEventClick?: ResourcesDayViewProps['onEventClick']

  /** If set, enables drag-to-select slot ranges @default false */
  withDragSlotSelect?: boolean

  /** Called when a slot range is selected by dragging */
  onSlotDragEnd?: ResourcesDayViewProps['onSlotDragEnd']

  /** Interaction mode @default 'default' */
  mode?: ScheduleMode

  /** Called when an external item is dropped onto the schedule */
  onExternalEventDrop?: ResourcesDayViewProps['onExternalEventDrop']

  /** If true, events can be resized (day/week views) @default false */
  withEventResize?: boolean

  /** Called when event is resized */
  onEventResize?: ResourcesDayViewProps['onEventResize']

  /** Function to determine if event can be resized */
  canResizeEvent?: ResourcesDayViewProps['canResizeEvent']

  /** Max number of generated recurring instances @default 2000 */
  recurrenceExpansionLimit?: number

  /** Props specific to ResourcesDayView */
  dayViewProps?: ResourcesScheduleViewProps<ResourcesDayViewProps>

  /** Props specific to ResourcesWeekView */
  weekViewProps?: ResourcesScheduleViewProps<ResourcesWeekViewProps>

  /** Props specific to ResourcesMonthView */
  monthViewProps?: ResourcesScheduleViewProps<ResourcesMonthViewProps>
}

export interface ResourcesScheduleSlots {
  /** Scoped alternative to the `renderResourceLabel` prop */
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild
  /** Scoped alternative to the `renderGroupLabel` view prop */
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild
  /** Content rendered in the top-left corner of the grid */
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild
  /** Scoped alternative to the `renderEventBody` prop */
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  /** Scoped alternative to the `renderEvent` view prop */
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
}

export const ResourcesSchedule = defineComponent({
  name: 'ResourcesSchedule',
  inheritAttrs: false,
  slots: Object as SlotsType<ResourcesScheduleSlots>,
  props: {
    resources: { type: Array as PropType<ScheduleResourceData[]>, required: true },
    date: [String, Date] as PropType<Date | DateStringValue>,
    defaultDate: [String, Date] as PropType<Date | DateStringValue>,
    onDateChange: Function as PropType<(date: DateStringValue) => void>,
    view: String as PropType<ResourcesScheduleViewLevel>,
    defaultView: { type: String as PropType<ResourcesScheduleViewLevel>, default: 'day' },
    onViewChange: Function as PropType<(view: ResourcesScheduleViewLevel) => void>,
    events: Array as PropType<ScheduleEventData[]>,
    locale: String,
    radius: [String, Number] as PropType<string | number>,
    labels: Object as PropType<ScheduleLabelsOverride>,
    renderEventBody: Function as PropType<RenderEventBody>,
    renderResourceLabel: Function as PropType<ResourcesScheduleProps['renderResourceLabel']>,
    withEventsDragAndDrop: Boolean,
    onEventDrop: Function as PropType<ResourcesScheduleProps['onEventDrop']>,
    canDragEvent: Function as PropType<ResourcesScheduleProps['canDragEvent']>,
    onEventDragStart: Function as PropType<ResourcesScheduleProps['onEventDragStart']>,
    onEventDragEnd: Function as PropType<ResourcesScheduleProps['onEventDragEnd']>,
    onTimeSlotClick: Function as PropType<ResourcesScheduleProps['onTimeSlotClick']>,
    onDayClick: Function as PropType<ResourcesScheduleProps['onDayClick']>,
    onEventClick: Function as PropType<ResourcesScheduleProps['onEventClick']>,
    withDragSlotSelect: Boolean,
    onSlotDragEnd: Function as PropType<ResourcesScheduleProps['onSlotDragEnd']>,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    onExternalEventDrop: Function as PropType<ResourcesScheduleProps['onExternalEventDrop']>,
    withEventResize: Boolean,
    onEventResize: Function as PropType<ResourcesScheduleProps['onEventResize']>,
    canResizeEvent: Function as PropType<ResourcesScheduleProps['canResizeEvent']>,
    recurrenceExpansionLimit: { type: Number, default: 2000 },
    dayViewProps: Object as PropType<ResourcesScheduleViewProps<ResourcesDayViewProps>>,
    weekViewProps: Object as PropType<ResourcesScheduleViewProps<ResourcesWeekViewProps>>,
    monthViewProps: Object as PropType<ResourcesScheduleViewProps<ResourcesMonthViewProps>>,
  },
  setup(props, { attrs, slots }) {
    const currentDate = ref(toDateString(props.date ?? props.defaultDate ?? dayjs()))
    const currentView = ref<ResourcesScheduleViewLevel>(props.view ?? props.defaultView)

    watch(
      () => props.date,
      (value) => {
        if (value !== undefined) currentDate.value = toDateString(value)
      },
    )
    watch(
      () => props.view,
      (value) => {
        if (value !== undefined) currentView.value = value
      },
    )

    const changeDate = (date: DateStringValue) => {
      if (props.date === undefined) currentDate.value = date
      props.onDateChange?.(date)
    }
    const changeView = (view: ScheduleViewLevel) => {
      if (view !== 'day' && view !== 'week' && view !== 'month') return
      if (props.view === undefined) currentView.value = view
      props.onViewChange?.(view)
    }

    return () => {
      const isStatic = props.mode === 'static'
      const shared = {
        resources: props.resources,
        date: currentDate.value,
        onDateChange: changeDate,
        onViewChange: changeView,
        events: props.events,
        locale: props.locale,
        radius: props.radius,
        labels: props.labels,
        renderEventBody: props.renderEventBody,
        renderResourceLabel: props.renderResourceLabel,
        withEventsDragAndDrop: isStatic ? false : props.withEventsDragAndDrop,
        onEventDrop: props.onEventDrop,
        canDragEvent: props.canDragEvent,
        onEventDragStart: props.onEventDragStart,
        onEventDragEnd: props.onEventDragEnd,
        onEventClick: props.onEventClick,
        withDragSlotSelect: props.withDragSlotSelect,
        onSlotDragEnd: props.onSlotDragEnd,
        onExternalEventDrop: props.onExternalEventDrop,
        recurrenceExpansionLimit: props.recurrenceExpansionLimit,
        mode: props.mode,
      }

      const forwarded: Record<string, unknown> = {}
      for (const key of Object.keys(slots)) {
        const slot = (slots as Record<string, unknown>)[key]
        if (typeof slot === 'function') forwarded[key] = slot
      }
      const forwardedSlots = Object.keys(forwarded).length ? forwarded : undefined

      const content = (() => {
        switch (currentView.value) {
          case 'day':
            return h(
              ResourcesDayView,
              {
                ...shared,
                onTimeSlotClick: props.onTimeSlotClick,
                withEventResize: isStatic ? false : props.withEventResize,
                onEventResize: props.onEventResize,
                canResizeEvent: props.canResizeEvent,
                ...props.dayViewProps,
              },
              forwardedSlots,
            )
          case 'week':
            return h(
              ResourcesWeekView,
              {
                ...shared,
                onTimeSlotClick: props.onTimeSlotClick,
                withEventResize: isStatic ? false : props.withEventResize,
                onEventResize: props.onEventResize,
                canResizeEvent: props.canResizeEvent,
                ...props.weekViewProps,
              },
              forwardedSlots,
            )
          case 'month':
            return h(
              ResourcesMonthView,
              { ...shared, onDayClick: props.onDayClick, ...props.monthViewProps },
              forwardedSlots,
            )
          default:
            return null
        }
      })()

      return h(Box, { ...attrs, class: [classes.root, attrs.class], style: attrs.style }, () => [
        content,
      ])
    }
  },
})
