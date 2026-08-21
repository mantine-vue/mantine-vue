import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { EventDropData, EventSlots, RenderEventBody } from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type {
  DateStringValue,
  ScheduleEventData,
  ScheduleMode,
  ScheduleResourceData,
  ScheduleResourceGroup,
} from '../../types'
import type {
  ResourceExternalDropData,
  ResourceSlotDragEndData,
  ResourceTimeSlotClickData,
  ResourceViewDropData,
  ResourcesDayViewProps,
  ResourcesDayViewStylesNames,
} from '../ResourcesDayView/ResourcesDayView.types'
import type {
  ResourcesMonthViewDayClickData,
  ResourcesMonthViewProps,
  ResourcesMonthViewStylesNames,
} from '../ResourcesMonthView/ResourcesMonthView.types'
import type {
  ResourcesWeekViewProps,
  ResourcesWeekViewStylesNames,
} from '../ResourcesWeekView/ResourcesWeekView.types'

/** View levels `ResourcesSchedule` can switch between. */
export type ResourcesScheduleViewLevel = 'day' | 'week' | 'month'

export type ResourcesScheduleOwnStylesNames = 'root'

/** `ResourcesSchedule` forwards `classNames` and `styles` to the view it renders. */
export type ResourcesScheduleStylesNames =
  | ResourcesScheduleOwnStylesNames
  | ResourcesDayViewStylesNames
  | ResourcesWeekViewStylesNames
  | ResourcesMonthViewStylesNames

/** Props `ResourcesSchedule` sets on every view itself, so a view-specific object cannot. */
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
  | 'classNames'
  | 'styles'
  | 'unstyled'
  | 'rootRef'

/** View-specific props, with the ones the schedule owns removed. */
export type ResourcesScheduleViewProps<T> = Partial<Omit<T, ResourcesScheduleCommonProps>>

export interface ResourcesScheduleSlots extends EventSlots {
  /** Replaces the label of every resource row. Takes precedence over `renderResourceLabel`. */
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild

  /** Replaces the label of every resource group. */
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild

  /** Content of the top-left corner of the grid. */
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild
}

/**
 * Props declared by `ResourcesSchedule` itself. See `ResourcesScheduleProps` for the full
 * public type.
 */
export interface ResourcesScheduleOwnProps extends StylesApiProps<ResourcesScheduleFactory> {
  /** Resources rendered as rows, in the given order. */
  resources: ScheduleResourceData[]

  /** Date displayed by the active view, bound with `v-model:date`. */
  date?: Date | DateStringValue

  /** Date displayed on the first render when `date` is not set. @default today */
  defaultDate?: Date | DateStringValue

  /** Active view level, bound with `v-model:view`. */
  view?: ResourcesScheduleViewLevel

  /**
   * View level shown on the first render when `view` is not set.
   * @default 'day'
   */
  defaultView?: ResourcesScheduleViewLevel

  /** Events rendered by the active view. */
  events?: ScheduleEventData[]

  /**
   * Locale passed down to `dayjs` when formatting labels.
   * @default 'en'
   */
  locale?: string

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Overrides for the built-in labels, used for i18n and accessible names. */
  labels?: ScheduleLabelsOverride

  /**
   * Replaces the body of every event. Can also be set with the `eventBody` slot,
   * which takes precedence over the prop.
   */
  renderEventBody?: RenderEventBody

  /**
   * Replaces the label of every resource row. Can also be set with the `resourceLabel` slot,
   * which takes precedence over the prop.
   */
  renderResourceLabel?: (resource: ScheduleResourceData) => VNodeChild

  /**
   * If set, events can be dragged onto another slot or resource.
   * @default false
   */
  withEventsDragAndDrop?: boolean

  /**
   * Returns whether the given event may be dragged.
   * @default () => true
   */
  canDragEvent?: (event: ScheduleEventData) => boolean

  /**
   * If set, items dragged in from outside the schedule can be dropped on a slot or day cell, which emits
   * `externalEventDrop`. Enabling event drag and drop turns this on as well.
   * @default false
   */
  withExternalEventDrop?: boolean

  /**
   * If set, dragging across slots or day cells selects a range.
   * @default false
   */
  withDragSlotSelect?: boolean

  /**
   * Interaction mode. `static` disables every event and slot interaction, and turns
   * dragging and resizing off regardless of the other props.
   * @default 'default'
   */
  mode?: ScheduleMode

  /**
   * If set, events can be resized in the day and week views.
   * @default false
   */
  withEventResize?: boolean

  /**
   * Returns whether the given event may be resized.
   * @default () => true
   */
  canResizeEvent?: (event: ScheduleEventData) => boolean

  /**
   * Maximum number of instances generated per recurring series.
   * @default 2000
   */
  recurrenceExpansionLimit?: number

  /** Props passed to `ResourcesDayView`. */
  dayViewProps?: ResourcesScheduleViewProps<ResourcesDayViewProps>

  /** Props passed to `ResourcesWeekView`. */
  weekViewProps?: ResourcesScheduleViewProps<ResourcesWeekViewProps>

  /** Props passed to `ResourcesMonthView`. */
  monthViewProps?: ResourcesScheduleViewProps<ResourcesMonthViewProps>
}

export interface ResourcesScheduleProps
  extends Omit<BoxProps, keyof ResourcesScheduleOwnProps>, ResourcesScheduleOwnProps {}

export interface ResourcesScheduleEmits {
  /** Emitted when the active view navigates to another date, bound with `v-model:date`. */
  'update:date': [date: DateStringValue]

  /** Emitted when another view level is selected, bound with `v-model:view`. */
  'update:view': [view: ResourcesScheduleViewLevel]

  /** Emitted when the active view navigates to another date. */
  dateChange: [date: DateStringValue]

  /** Emitted when another view level is selected. */
  viewChange: [view: ResourcesScheduleViewLevel]

  /** Emitted when an event is clicked. */
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]

  /** Emitted when an event is dropped. */
  eventDrop: [data: ResourceViewDropData]

  /** Emitted when a drag of an event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a drag of an event ends. */
  eventDragEnd: []

  /** Emitted when a time slot is clicked in the day or week view. */
  timeSlotClick: [data: ResourceTimeSlotClickData]

  /** Emitted when a day cell is clicked in the month view. */
  dayClick: [data: ResourcesMonthViewDayClickData]

  /** Emitted when a range is selected by dragging. */
  slotDragEnd: [data: ResourceSlotDragEndData]

  /** Emitted when an item from outside the schedule is dropped. */
  externalEventDrop: [data: ResourceExternalDropData]

  /** Emitted when an event is resized. */
  eventResize: [data: EventDropData]
}

export type ResourcesScheduleFactory = Factory<{
  props: Omit<ResourcesScheduleProps, 'rootRef'>
  slots: ResourcesScheduleSlots
  emits: ResourcesScheduleEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ResourcesScheduleStylesNames
}>
