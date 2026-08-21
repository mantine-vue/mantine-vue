import type { CSSProperties, VNodeChild } from 'vue'
import type { BoxProps, Factory, ScrollAreaProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  EventDropData,
  EventSlots,
  ForwardedProps,
  NativeButtonProps,
  RenderEvent,
  RenderEventBody,
} from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type {
  AnyDateValue,
  DateLabelFormat,
  DateStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleMode,
  ScheduleResourceData,
  ScheduleResourceGroup,
  ScheduleViewLevel,
} from '../../types'
import type { BusinessHoursValue } from '../../utils'
import type {
  MoreEventsEmits,
  MoreEventsProps,
  MoreEventsStylesNames,
} from '../MoreEvents/MoreEvents.types'
import type { ScheduleEventStylesNames } from '../ScheduleEvent/ScheduleEvent.types'
import type { CombinedScheduleHeaderStylesNames } from '../ScheduleHeader/ScheduleHeader.types'
import type {
  ViewSelectEmits,
  ViewSelectProps,
} from '../ScheduleHeader/ViewSelect/ViewSelect.types'
import type {
  ResourceExternalDropData,
  ResourceSlotDragEndData,
  ResourceTimeSlotClickData,
  ResourceViewDropData,
} from '../ResourcesDayView/ResourcesDayView.types'
import type { WeekLabelPayload } from '../WeekView/WeekView.types'

export type ResourcesWeekViewOwnStylesNames =
  | 'resourcesWeekView'
  | 'resourcesWeekViewRoot'
  | 'resourcesWeekViewInner'
  | 'resourcesWeekViewScrollArea'
  | 'resourcesWeekViewHeaderRows'
  | 'resourcesWeekViewHeaderContent'
  | 'resourcesWeekViewDayLabelsRow'
  | 'resourcesWeekViewDayLabel'
  | 'resourcesWeekViewTimeLabelsRow'
  | 'resourcesWeekViewTimeLabel'
  | 'resourcesWeekViewCorner'
  | 'resourcesWeekViewResourceLabel'
  | 'resourcesWeekViewRow'
  | 'resourcesWeekViewRowSlot'
  | 'resourcesWeekViewRowSlots'
  | 'resourcesWeekViewBackgroundEvent'
  | 'resourcesWeekViewAllDayEvent'
  | 'resourcesWeekViewEventWrapper'
  | 'resourcesWeekViewResizeHandle'
  | 'resourcesWeekViewGroupColumn'
  | 'resourcesWeekViewGroupColumnEmpty'
  | 'resourcesWeekViewCurrentTimeIndicator'
  | 'resourcesWeekViewCurrentTimeIndicatorLine'
  | 'resourcesWeekViewCurrentTimeIndicatorThumb'
  | 'resourcesWeekViewCurrentTimeIndicatorTimeBubble'

/**
 * `ResourcesWeekView` forwards `classNames` and `styles` to the components it renders, so
 * their selectors are part of its Styles API.
 */
export type ResourcesWeekViewStylesNames =
  | ResourcesWeekViewOwnStylesNames
  | MoreEventsStylesNames
  | ScheduleEventStylesNames
  | CombinedScheduleHeaderStylesNames

export type ResourcesWeekViewCssVariables = {
  resourcesWeekView:
    | '--resources-week-view-radius'
    | '--resources-week-view-slot-width'
    | '--resources-week-view-row-height'
    | '--resources-week-view-group-label-width'
}

export interface ResourcesWeekViewSlots extends EventSlots {
  /** Replaces the navigation header. */
  header?: (props: WeekLabelPayload & { label: VNodeChild }) => VNodeChild

  /** Content of the top-left corner of the grid. */
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild

  /** Replaces the label of a day column group. */
  dayLabel?: (props: { date: DateStringValue; label: VNodeChild }) => VNodeChild

  /** Replaces the label of a time column. */
  timeLabel?: (props: {
    date: DateStringValue
    label: VNodeChild
    startTime: string
    endTime: string
  }) => VNodeChild

  /** Replaces the label of a resource row. Takes precedence over `renderResourceLabel`. */
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild

  /** Replaces the label of a resource group. Takes precedence over `renderGroupLabel`. */
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild

  /** Content rendered inside every time slot. */
  timeSlot?: (props: {
    resource: ScheduleResourceData
    date: DateStringValue
    startTime: string
    endTime: string
  }) => VNodeChild

  /** Replaces a background event. */
  backgroundEvent?: (props: { event: ScheduleEventData; date: DateStringValue }) => VNodeChild

  /** Replaces an all-day event bar. */
  allDayEvent?: (props: {
    event: ScheduleEventData
    startDayIndex: number
    endDayIndex: number
  }) => VNodeChild

  /** Replaces the "more events" control of an overlap cluster. */
  moreEvents?: (props: {
    events: ScheduleEventData[]
    hiddenCount: number
    date: DateStringValue
  }) => VNodeChild

  /** Replaces the current time indicator. */
  currentTimeIndicator?: (props: {
    time: VNodeChild
    offset: number
    date: DateStringValue
  }) => VNodeChild
}

/**
 * Props declared by `ResourcesWeekView` itself. See `ResourcesWeekViewProps` for the full
 * public type.
 */
export interface ResourcesWeekViewOwnProps extends StylesApiProps<ResourcesWeekViewFactory> {
  /** Week displayed by the view. Any day inside the week works. */
  date: Date | DateStringValue

  /** Resources rendered as rows, in the given order. */
  resources: ScheduleResourceData[]

  /** Groups the resources are bucketed into, rendered as a leading column. */
  groups?: ScheduleResourceGroup[]

  /**
   * First visible time of the day, `HH:mm:ss`.
   * @default '00:00:00'
   */
  startTime?: string

  /**
   * Last visible time of the day, `HH:mm:ss`.
   * @default '23:59:59'
   */
  endTime?: string

  /**
   * Length of one time slot in minutes.
   * @default 60
   */
  intervalMinutes?: number

  /**
   * Format of the time column labels.
   * @default 'HH:mm'
   */
  slotLabelFormat?: DateLabelFormat

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Datetime the view scrolls to on the initial render, `YYYY-MM-DD HH:mm:ss`. */
  startScrollDateTime?: string

  /** Props passed to the `ScrollArea` that wraps the grid. */
  scrollAreaProps?: ForwardedProps<ScrollAreaProps>

  /**
   * Locale passed down to `dayjs` when formatting labels.
   * @default 'en'
   */
  locale?: string

  /** If set, a line marking the current time is displayed. */
  withCurrentTimeIndicator?: boolean

  /**
   * If set, the current time indicator carries a bubble with the current time.
   * @default true
   */
  withCurrentTimeBubble?: boolean

  /**
   * Returns the current time, called on every render. Use it to render the indicator in
   * another timezone.
   * @default () => dayjs()
   */
  getCurrentTime?: () => AnyDateValue

  /**
   * If set, the navigation header is rendered above the grid.
   * @default true
   */
  withHeader?: boolean

  /** Props passed to the previous control of the header. */
  previousControlProps?: NativeButtonProps

  /** Props passed to the next control of the header. */
  nextControlProps?: NativeButtonProps

  /** Props passed to the today control of the header. */
  todayControlProps?: NativeButtonProps

  /** Props passed to the view select of the header. */
  viewSelectProps?: ForwardedProps<ViewSelectProps, ViewSelectEmits>

  /**
   * Format of the week label shown in the header.
   * @default 'MMM DD'
   */
  weekLabelFormat?: DateLabelFormat

  /** Replaces the label shown between the navigation controls. */
  renderWeekLabel?: (payload: WeekLabelPayload) => VNodeChild

  /** Events rendered by the view. */
  events?: ScheduleEventData[]

  /**
   * Width of one time column.
   * @default 60
   */
  slotWidth?: CSSProperties['width']

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

  /** Overrides for the built-in labels, used for i18n and accessible names. */
  labels?: ScheduleLabelsOverride

  /**
   * If set, business hours are highlighted.
   * @default false
   */
  highlightBusinessHours?: boolean

  /**
   * Business hours as an `HH:mm:ss` range shared by every day, or a record keyed by day of
   * the week (`0` – Sunday) for per-day ranges.
   * @default ['09:00:00', '17:00:00']
   */
  businessHours?: BusinessHoursValue

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
   * If set, items dragged in from outside the schedule can be dropped on a slot, which emits
   * `externalEventDrop`. Enabling event drag and drop turns this on as well.
   * @default false
   */
  withExternalEventDrop?: boolean

  /**
   * If set, dragging across time slots selects a range.
   * @default false
   */
  withDragSlotSelect?: boolean

  /**
   * Interaction mode. `static` disables every event and slot interaction.
   * @default 'default'
   */
  mode?: ScheduleMode

  /**
   * If set, events can be resized by dragging their edges.
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

  /**
   * Number of overlapping events shown per slot before the rest collapse into a "more" control.
   * @default 2
   */
  maxEventsPerTimeSlot?: number

  /** Props passed to the `MoreEvents` control of an overlap cluster. */
  moreEventsProps?: ForwardedProps<MoreEventsProps, MoreEventsEmits>

  /**
   * Day the week starts on, `0` – Sunday.
   * @default 1
   */
  firstDayOfWeek?: DayOfWeek

  /**
   * Days marked as weekend, `0` – Sunday.
   * @default [0, 6]
   */
  weekendDays?: DayOfWeek[]

  /**
   * If set, weekend days are part of the week.
   * @default true
   */
  withWeekendDays?: boolean

  /**
   * Format of the day column labels.
   * @default 'ddd D'
   */
  weekdayFormat?: DateLabelFormat

  /**
   * If set, today is highlighted.
   * @default true
   */
  highlightToday?: boolean
}

export interface ResourcesWeekViewProps
  extends Omit<BoxProps, keyof ResourcesWeekViewOwnProps>, ResourcesWeekViewOwnProps {}

export interface ResourcesWeekViewEmits {
  /** Emitted when the view navigates to another week. */
  dateChange: [date: DateStringValue]

  /** Emitted when the header view select picks another view level. */
  viewChange: [view: ScheduleViewLevel]

  /** Emitted when an event is clicked. */
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]

  /** Emitted when an event is dropped. */
  eventDrop: [data: ResourceViewDropData]

  /** Emitted when a drag of an event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a drag of an event ends. */
  eventDragEnd: []

  /** Emitted when a time slot is clicked. */
  timeSlotClick: [data: ResourceTimeSlotClickData]

  /** Emitted when a slot range is selected by dragging. */
  slotDragEnd: [data: ResourceSlotDragEndData]

  /** Emitted when an item from outside the schedule is dropped. */
  externalEventDrop: [data: ResourceExternalDropData]

  /** Emitted when an event is resized. */
  eventResize: [data: EventDropData]
}

export type ResourcesWeekViewFactory = Factory<{
  props: Omit<ResourcesWeekViewProps, 'rootRef'>
  slots: ResourcesWeekViewSlots
  emits: ResourcesWeekViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ResourcesWeekViewStylesNames
  vars: ResourcesWeekViewCssVariables
}>
