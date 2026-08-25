import type { CSSProperties, VNodeChild } from 'vue'
import type { BoxProps, Factory, ScrollAreaProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  EventSlots,
  EventDropData,
  ForwardedProps,
  NativeButtonProps,
  RenderEvent,
  RenderEventBody,
} from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type {
  DateLabelFormat,
  DateStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleMode,
  ScheduleResourceData,
  ScheduleResourceGroup,
  ScheduleViewLevel,
} from '../../types'
import type {
  MoreEventsEmits,
  MoreEventsProps,
  MoreEventsStylesNames,
} from '../MoreEvents/MoreEvents.types'
import type { ScheduleEventStylesNames } from '../ScheduleEvent/ScheduleEvent.types'
import type { CombinedScheduleHeaderStylesNames } from '../ScheduleHeader/ScheduleHeader.types'
import type {
  MonthYearSelectEmits,
  MonthYearSelectProps,
} from '../ScheduleHeader/MonthYearSelect/MonthYearSelect.types'
import type {
  ViewSelectEmits,
  ViewSelectProps,
} from '../ScheduleHeader/ViewSelect/ViewSelect.types'
import type {
  ResourceExternalDropData,
  ResourceSlotDragEndData,
  ResourceViewDropData,
} from '../ResourcesDayView/ResourcesDayView.types'

export type ResourcesMonthViewOwnStylesNames =
  | 'resourcesMonthView'
  | 'resourcesMonthViewRoot'
  | 'resourcesMonthViewInner'
  | 'resourcesMonthViewScrollArea'
  | 'resourcesMonthViewDayLabelsRow'
  | 'resourcesMonthViewDayLabel'
  | 'resourcesMonthViewDayLabelWeekday'
  | 'resourcesMonthViewDayLabelNumber'
  | 'resourcesMonthViewCorner'
  | 'resourcesMonthViewResourceLabel'
  | 'resourcesMonthViewRow'
  | 'resourcesMonthViewRowSlots'
  | 'resourcesMonthViewCell'
  | 'resourcesMonthViewEventWrapper'
  | 'resourcesMonthViewResizeHandle'
  | 'resourcesMonthViewGroupColumn'
  | 'resourcesMonthViewGroupColumnEmpty'

/**
 * `ResourcesMonthView` forwards `classNames` and `styles` to the components it renders, so
 * their selectors are part of its Styles API.
 */
export type ResourcesMonthViewStylesNames =
  | ResourcesMonthViewOwnStylesNames
  | MoreEventsStylesNames
  | ScheduleEventStylesNames
  | CombinedScheduleHeaderStylesNames

export type ResourcesMonthViewCssVariables = {
  resourcesMonthView:
    | '--resources-month-view-radius'
    | '--resources-month-view-day-width'
    | '--resources-month-view-row-height'
    | '--resources-month-view-group-label-width'
}

/** Payload of the `dayClick` event of `ResourcesMonthView`. */
export interface ResourcesMonthViewDayClickData {
  /** Day that was clicked, `YYYY-MM-DD`. */
  date: DateStringValue

  /** Originating DOM event. */
  nativeEvent: MouseEvent

  /** Resource the cell belongs to. */
  resourceId?: string | number
}

export interface ResourcesMonthViewSlots extends EventSlots {
  /** Replaces the navigation header. */
  header?: (props: { month: DateStringValue }) => VNodeChild

  /** Content of the top-left corner of the grid. */
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild

  /** Replaces the label of a day column. */
  dayLabel?: (props: { date: DateStringValue; weekday: VNodeChild; day: number }) => VNodeChild

  /** Replaces the label of a resource row. Takes precedence over `renderResourceLabel`. */
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild

  /** Replaces the label of a resource group. Takes precedence over `renderGroupLabel`. */
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild

  /** Content rendered inside every day cell. */
  dayCell?: (props: { resource: ScheduleResourceData; date: DateStringValue }) => VNodeChild

  /** Replaces the "more events" control of a day cell. */
  moreEvents?: (props: {
    events: ScheduleEventData[]
    hiddenCount: number
    resource: ScheduleResourceData
    date: DateStringValue
  }) => VNodeChild
}

/**
 * Props declared by `ResourcesMonthView` itself. See `ResourcesMonthViewProps` for the full
 * public type.
 */
export interface ResourcesMonthViewOwnProps extends StylesApiProps<ResourcesMonthViewFactory> {
  /** Month displayed by the view. Any day inside the month works. */
  date: Date | DateStringValue

  /** Resources rendered as rows, in the given order. */
  resources: ScheduleResourceData[]

  /** Groups the resources are bucketed into, rendered as a leading column. */
  groups?: ScheduleResourceGroup[]

  /**
   * Locale passed down to `dayjs` when formatting labels.
   * @default 'en'
   */
  locale?: string

  /**
   * Format of the weekday part of the day column labels.
   * @default 'ddd'
   */
  weekdayFormat?: DateLabelFormat

  /**
   * Days marked as weekend, `0` – Sunday.
   * @default [0, 6]
   */
  weekendDays?: DayOfWeek[]

  /**
   * If set, weekend days get a column of their own.
   * @default true
   */
  withWeekendDays?: boolean

  /** Day the view scrolls to on the initial render, `YYYY-MM-DD`. */
  startScrollDate?: string

  /**
   * If set, today is highlighted.
   * @default true
   */
  highlightToday?: boolean

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /**
   * If set, the navigation header is rendered above the grid.
   * @default true
   */
  withHeader?: boolean

  /** Props passed to the month/year select in the header. */
  monthYearSelectProps?: ForwardedProps<MonthYearSelectProps, MonthYearSelectEmits>

  /** Props passed to the previous control of the header. */
  previousControlProps?: NativeButtonProps

  /** Props passed to the next control of the header. */
  nextControlProps?: NativeButtonProps

  /** Props passed to the today control of the header. */
  todayControlProps?: NativeButtonProps

  /** Props passed to the view select of the header. */
  viewSelectProps?: ForwardedProps<ViewSelectProps, ViewSelectEmits>

  /** Events rendered by the view. */
  events?: ScheduleEventData[]

  /**
   * Width of one day column.
   * @default 80
   */
  dayWidth?: CSSProperties['width']

  /**
   * Height of one resource row.
   * @default 64
   */
  rowHeight?: CSSProperties['height']

  /**
   * Width of the group column.
   * @default 80
   */
  groupLabelWidth?: CSSProperties['width']

  /**
   * Replaces the body of every event. Can also be set with the `eventBody` slot,
   * which takes precedence over the prop.
   */
  renderEventBody?: RenderEventBody

  /**
   * Replaces every event entirely. Can also be set with the `event` slot, which takes
   * precedence over the prop.
   */
  renderEvent?: RenderEvent

  /**
   * Replaces the label of every resource row. Can also be set with the `resourceLabel` slot,
   * which takes precedence over the prop.
   */
  renderResourceLabel?: (resource: ScheduleResourceData) => VNodeChild

  /**
   * Replaces the label of every resource group. Can also be set with the `groupLabel` slot,
   * which takes precedence over the prop.
   */
  renderGroupLabel?: (group: ScheduleResourceGroup) => VNodeChild

  /**
   * If set, events can be dragged onto another day or resource.
   * @default false
   */
  withEventsDragAndDrop?: boolean

  /**
   * Returns whether the given event may be dragged.
   * @default () => true
   */
  canDragEvent?: (event: ScheduleEventData) => boolean

  /** If set, event start and end edges can be dragged across day cells. @default false */
  withEventResize?: boolean

  /** Returns whether the given event may be resized. @default () => true */
  canResizeEvent?: (event: ScheduleEventData) => boolean

  /**
   * If set, items dragged in from outside the schedule can be dropped on a day cell, which emits
   * `externalEventDrop`. Enabling event drag and drop turns this on as well.
   * @default false
   */
  withExternalEventDrop?: boolean

  /**
   * If set, dragging across day cells selects a range.
   * @default false
   */
  withDragSlotSelect?: boolean

  /** Overrides for the built-in labels, used for i18n and accessible names. */
  labels?: ScheduleLabelsOverride

  /**
   * Interaction mode. `static` disables every event and cell interaction.
   * @default 'default'
   */
  mode?: ScheduleMode

  /** Props passed to the `ScrollArea` that wraps the grid. */
  scrollAreaProps?: ForwardedProps<ScrollAreaProps>

  /**
   * Number of event rows a day cell shows before the rest collapse into a "more" control.
   * Clamped to the `1` – `10` range.
   * @default 2
   */
  maxEventsPerTimeSlot?: number

  /** Props passed to the `MoreEvents` control of a day cell. */
  moreEventsProps?: ForwardedProps<MoreEventsProps, MoreEventsEmits>

  /**
   * Maximum number of instances generated per recurring series.
   * @default 2000
   */
  recurrenceExpansionLimit?: number
}

export interface ResourcesMonthViewProps
  extends Omit<BoxProps, keyof ResourcesMonthViewOwnProps>, ResourcesMonthViewOwnProps {}

export interface ResourcesMonthViewEmits {
  /** Emitted when the view navigates to another month. */
  dateChange: [date: DateStringValue]

  /** Emitted when the header view select picks another view level. */
  viewChange: [view: ScheduleViewLevel]

  /** Emitted when a day cell is clicked. */
  dayClick: [data: ResourcesMonthViewDayClickData]

  /** Emitted when an event is clicked. */
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]

  /** Emitted when an event is dropped. */
  eventDrop: [data: ResourceViewDropData]

  /** Emitted when a drag of an event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a drag of an event ends. */
  eventDragEnd: []

  /** Emitted when a day range is selected by dragging. */
  slotDragEnd: [data: ResourceSlotDragEndData]

  /** Emitted when an item from outside the schedule is dropped. */
  externalEventDrop: [data: ResourceExternalDropData]

  /** Emitted when an event resize gesture completes. */
  eventResize: [data: EventDropData]
}

export type ResourcesMonthViewFactory = Factory<{
  props: Omit<ResourcesMonthViewProps, 'rootRef'>
  slots: ResourcesMonthViewSlots
  emits: ResourcesMonthViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ResourcesMonthViewStylesNames
  vars: ResourcesMonthViewCssVariables
}>
