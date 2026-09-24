import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue'
import type { EmitsToProps } from '@mantine-vue/core'
import type {
  ViewSelectEmits,
  ViewSelectProps,
} from './components/ScheduleHeader/ViewSelect/ViewSelect.types'
import type { ScheduleLabelsOverride } from './labels'
import type {
  AnyDateValue,
  DateLabelFormat,
  DateStringValue,
  DateTimeStringValue,
  ScheduleEventData,
  ScheduleMode,
  ScheduleViewLevel,
} from './types'
import type { BusinessHoursValue } from './utils'

/**
 * Native attributes accepted by the header controls and the other button-like elements
 * a view renders on the consumer's behalf. `data-*` attributes are part of the type
 * because Vue's `HTMLAttributes` does not model them.
 */
export type NativeButtonProps = HTMLAttributes & Record<`data-${string}`, unknown>

/**
 * Props forwarded to a component a view renders internally, plus the `on*` listeners for its
 * events so a nested object can subscribe to them.
 *
 * `rootRef` is dropped because it only makes sense on the element a consumer owns, and because
 * the factory narrows it to a concrete element type that a `Partial<…Props>` cannot satisfy.
 */
export type ForwardedProps<Props, Emits = Record<never, never>> = Partial<Omit<Props, 'rootRef'>> &
  EmitsToProps<Emits>

/** Renders the body of an event, replacing the default title. */
export type RenderEventBody = (event: ScheduleEventData) => VNodeChild

/** Props `ScheduleEvent` would spread onto its root element, handed to `renderEvent`. */
export interface ScheduleEventRenderProps extends NativeButtonProps {
  /** Default event content, so a custom root can still render it. */
  children?: VNodeChild
}

/** Replaces the rendering of an event entirely, root element included. */
export type RenderEvent = (event: ScheduleEventData, props: ScheduleEventRenderProps) => VNodeChild

/** Payload of the `eventDrop` and `eventResize` events and of the matching callback props. */
export interface EventDropData {
  /** Id of the event that changed. */
  eventId: string | number

  /** New start datetime, `YYYY-MM-DD HH:mm:ss`. */
  newStart: DateTimeStringValue

  /** New end datetime, `YYYY-MM-DD HH:mm:ss`. */
  newEnd: DateTimeStringValue

  /** Event object as it was before the change. */
  event: ScheduleEventData
}

/** Payload of the `timeSlotClick` event and of the `onTimeSlotClick` prop. */
export interface TimeSlotClickData {
  /** Start datetime of the clicked slot, `YYYY-MM-DD HH:mm:ss`. */
  slotStart: DateTimeStringValue

  /** End datetime of the clicked slot, `YYYY-MM-DD HH:mm:ss`. */
  slotEnd: DateTimeStringValue

  /** Originating DOM event. */
  nativeEvent: MouseEvent
}

/**
 * Props shared by every schedule view. Not a component of its own: `DayViewOwnProps`,
 * `MonthViewOwnProps` and friends extend it, so its members appear in their props tables.
 */
export interface BaseViewOwnProps {
  /** Date displayed by the view. Accepts anything `dayjs` understands. */
  date: Date | DateStringValue

  /** Events rendered by the view. */
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
   * Interaction mode. `static` disables every event, slot and navigation interaction.
   * @default 'default'
   */
  mode?: ScheduleMode

  /**
   * If set, the navigation header is rendered above the view.
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
   * Replaces the body of every event. Can also be set with the `eventBody` slot,
   * which takes precedence over the prop.
   */
  renderEventBody?: RenderEventBody

  /**
   * Replaces every event entirely, root element included. Can also be set with the
   * `event` slot, which takes precedence over the prop.
   */
  renderEvent?: RenderEvent

  /**
   * Maximum number of instances generated per recurring series.
   * @default 2000
   */
  recurrenceExpansionLimit?: number

  /**
   * If set, background events can be focused and clicked. Combined with event resize, timed
   * background events can also be resized. Has no effect in static mode.
   * @default false
   */
  withInteractiveBackgroundEvents?: boolean
}

/**
 * Props shared by the views that lay events out on a time axis. Not a component of its own:
 * `DayViewOwnProps` and `WeekViewOwnProps` extend it.
 */
export interface TimeViewOwnProps extends BaseViewOwnProps {
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

  /** Length of one time slot in minutes. */
  intervalMinutes?: number

  /**
   * Snap interval used when events are dragged, independent of `intervalMinutes`.
   * Falls back to `intervalMinutes` when unset.
   */
  eventDragInterval?: number

  /**
   * Snap interval used when events are resized, independent of `intervalMinutes`.
   * Falls back to `intervalMinutes` when unset.
   */
  eventResizeInterval?: number

  /**
   * Format of the time slot labels.
   * @default 'HH:mm'
   */
  slotLabelFormat?: DateLabelFormat

  /** If set, a line marking the current time is displayed. */
  withCurrentTimeIndicator?: boolean

  /**
   * If set, the current time indicator carries a bubble with the current time.
   * @default true
   */
  withCurrentTimeBubble?: boolean

  /**
   * Returns the current time, called on every tick. Use it to render the indicator in
   * another timezone.
   * @default () => dayjs()
   */
  getCurrentTime?: () => AnyDateValue

  /**
   * Height of a one hour slot.
   * @default 64
   */
  slotHeight?: CSSProperties['height']

  /**
   * If set, business hours are highlighted.
   * @default false
   */
  highlightBusinessHours?: boolean

  /**
   * Business hours as an `HH:mm:ss` range shared by every day, or a record keyed by day of
   * the week (`0` – Sunday) for per-day ranges. Set a day to `null` to mark it as fully
   * outside business hours.
   * @default ['09:00:00', '17:00:00']
   */
  businessHours?: BusinessHoursValue

  /**
   * If set, events can be dragged onto another slot.
   * @default false
   */
  withEventsDragAndDrop?: boolean

  /**
   * Returns whether the given event may be dragged.
   * @default () => true
   */
  canDragEvent?: (event: ScheduleEventData) => boolean

  /**
   * If set, dragging across time slots selects a range.
   * @default false
   */
  withDragSlotSelect?: boolean

  /**
   * If set, items dragged in from outside the schedule can be dropped on a slot, which emits
   * `externalEventDrop`. Enabling event drag and drop turns this on as well.
   * @default false
   */
  withExternalEventDrop?: boolean

  /** Time the view scrolls to on the initial render, `HH:mm:ss`. */
  startScrollTime?: string

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
}

/**
 * Events emitted by every schedule view. Not a component of its own: `DayViewEmits`,
 * `MonthViewEmits` and friends extend it.
 */
export interface BaseViewEmits {
  /** Emitted when the view navigates to another date. */
  dateChange: [date: DateStringValue]

  /** Emitted when the header view select picks another view level. */
  viewChange: [view: ScheduleViewLevel]

  /** Emitted when an event is clicked. */
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]
}

/**
 * Events emitted by the views that lay events out on a time axis. Not a component of its own:
 * `DayViewEmits` and `WeekViewEmits` extend it.
 */
export interface TimeViewEmits extends BaseViewEmits {
  /** Emitted when an event is dropped on a new slot. */
  eventDrop: [data: EventDropData]

  /** Emitted when a drag of an event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a drag of an event ends. */
  eventDragEnd: []

  /** Emitted when a time slot is clicked. */
  timeSlotClick: [data: TimeSlotClickData]

  /** Emitted when an all-day slot is clicked. */
  allDaySlotClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when a time slot range is selected by dragging. */
  slotDragEnd: [rangeStart: DateTimeStringValue, rangeEnd: DateTimeStringValue]

  /** Emitted when an item from outside the schedule is dropped on a slot. */
  externalEventDrop: [dataTransfer: DataTransfer, dropDateTime: DateTimeStringValue]

  /** Emitted when an event is resized. */
  eventResize: [data: EventDropData]
}

/** Scoped slots that mirror the `renderEvent` and `renderEventBody` props. */
export interface EventSlots {
  /** Replaces the body of every event. Takes precedence over `renderEventBody`. */
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild

  /** Replaces every event entirely. Takes precedence over `renderEvent`. */
  event?: (props: ScheduleEventRenderProps & { event: ScheduleEventData }) => VNodeChild
}
