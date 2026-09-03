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
  DateTimeStringValue,
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

export type ResourcesDayViewOwnStylesNames =
  | 'resourcesDayView'
  | 'resourcesDayViewRoot'
  | 'resourcesDayViewInner'
  | 'resourcesDayViewScrollArea'
  | 'resourcesDayViewTimeLabelsRow'
  | 'resourcesDayViewTimeLabel'
  | 'resourcesDayViewCorner'
  | 'resourcesDayViewResourceLabel'
  | 'resourcesDayViewRow'
  | 'resourcesDayViewRowSlot'
  | 'resourcesDayViewRowSlots'
  | 'resourcesDayViewBackgroundEvent'
  | 'resourcesDayViewAllDayEvent'
  | 'resourcesDayViewEventWrapper'
  | 'resourcesDayViewResizeHandle'
  | 'resourcesDayViewGroupColumn'
  | 'resourcesDayViewGroupColumnEmpty'
  | 'resourcesDayViewCurrentTimeIndicator'
  | 'resourcesDayViewCurrentTimeIndicatorLine'
  | 'resourcesDayViewCurrentTimeIndicatorThumb'
  | 'resourcesDayViewCurrentTimeIndicatorTimeBubble'

/**
 * `ResourcesDayView` forwards `classNames` and `styles` to the components it renders, so
 * their selectors are part of its Styles API.
 */
export type ResourcesDayViewStylesNames =
  | ResourcesDayViewOwnStylesNames
  | MoreEventsStylesNames
  | ScheduleEventStylesNames
  | CombinedScheduleHeaderStylesNames

export type ResourcesDayViewCssVariables = {
  resourcesDayView:
    | '--resources-day-view-radius'
    | '--resources-day-view-slot-width'
    | '--resources-day-view-row-height'
    | '--resources-day-view-group-label-width'
}

/** Payload of the drop events of the resource views, extended with the target resource. */
export interface ResourceViewDropData extends EventDropData {
  /** Resource the event was dropped on. */
  resourceId?: string | number
}

/** Payload of the `timeSlotClick` event of the resource views. */
export interface ResourceTimeSlotClickData {
  /** Start datetime of the clicked slot, `YYYY-MM-DD HH:mm:ss`. */
  slotStart: DateTimeStringValue

  /** End datetime of the clicked slot, `YYYY-MM-DD HH:mm:ss`. */
  slotEnd: DateTimeStringValue

  /** Originating DOM event. */
  nativeEvent: MouseEvent

  /** Resource the slot belongs to. */
  resourceId?: string | number
}

/** Payload of the `slotDragEnd` event of the resource views. */
export interface ResourceSlotDragEndData {
  /** Start of the selected range. */
  rangeStart: DateTimeStringValue

  /** End of the selected range. */
  rangeEnd: DateTimeStringValue

  /** Resource the range belongs to. */
  resourceId?: string | number
}

/** Payload of the `externalEventDrop` event of the resource views. */
export interface ResourceExternalDropData {
  /** Payload of the native drag. */
  dataTransfer: DataTransfer

  /** Datetime the item was dropped on, `YYYY-MM-DD HH:mm:ss`. */
  dropDateTime: DateTimeStringValue

  /** Resource the item was dropped on. */
  resourceId?: string | number
}

export interface ResourcesDayViewSlots extends EventSlots {
  /** Replaces the navigation header. */
  header?: (props: { date: DateStringValue; label: VNodeChild }) => VNodeChild

  /** Content of the top-left corner of the grid. */
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild

  /** Replaces the label of a time column. */
  timeLabel?: (props: { label: VNodeChild; startTime: string; endTime: string }) => VNodeChild

  /** Replaces the label of a resource row. Takes precedence over `renderResourceLabel`. */
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild

  /** Replaces the label of a resource group. Takes precedence over `renderGroupLabel`. */
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild

  /** Content rendered inside every time slot. */
  timeSlot?: (props: {
    resource: ScheduleResourceData
    startTime: string
    endTime: string
  }) => VNodeChild

  /** Replaces a background event. */
  backgroundEvent?: (props: { event: ScheduleEventData }) => VNodeChild

  /** Replaces an all-day event bar. */
  allDayEvent?: (props: { event: ScheduleEventData }) => VNodeChild

  /** Replaces the "more events" control of an overlap cluster. */
  moreEvents?: (props: { events: ScheduleEventData[]; hiddenCount: number }) => VNodeChild

  /** Replaces the current time indicator. */
  currentTimeIndicator?: (props: { time: VNodeChild; offset: number }) => VNodeChild
}

/**
 * Props declared by `ResourcesDayView` itself. See `ResourcesDayViewProps` for the full
 * public type.
 */
export interface ResourcesDayViewOwnProps extends StylesApiProps<ResourcesDayViewFactory> {
  /** Day displayed by the view. Accepts anything `dayjs` understands. */
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

  /** Snap interval used when events are dragged, independent of `intervalMinutes`. */
  eventDragInterval?: number

  /** Snap interval used when events are resized, independent of `intervalMinutes`. */
  eventResizeInterval?: number

  /**
   * Format of the time column labels.
   * @default 'HH:mm'
   */
  slotLabelFormat?: DateLabelFormat

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Time the view scrolls to on the initial render, `HH:mm:ss`. */
  startScrollTime?: string

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
   * Format of the date shown in the header.
   * @default 'MMMM D, YYYY'
   */
  headerFormat?: DateLabelFormat

  /** Events rendered by the view. */
  events?: ScheduleEventData[]

  /**
   * Width of one time column.
   * @default 80
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

  /** If set, background events can be focused and clicked. */
  withInteractiveBackgroundEvents?: boolean

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
}

export interface ResourcesDayViewProps
  extends Omit<BoxProps, keyof ResourcesDayViewOwnProps>, ResourcesDayViewOwnProps {}

export interface ResourcesDayViewEmits {
  /** Emitted when the view navigates to another date. */
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

export type ResourcesDayViewFactory = Factory<{
  props: Omit<ResourcesDayViewProps, 'rootRef'>
  slots: ResourcesDayViewSlots
  emits: ResourcesDayViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ResourcesDayViewStylesNames
  vars: ResourcesDayViewCssVariables
}>
