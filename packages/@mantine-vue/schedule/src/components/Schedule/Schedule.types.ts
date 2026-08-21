import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  EventDropData,
  EventSlots,
  ForwardedProps,
  RenderEventBody,
  TimeSlotClickData,
} from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type {
  DateStringValue,
  DateTimeStringValue,
  ScheduleEventData,
  ScheduleMode,
  ScheduleViewLevel,
} from '../../types'
import type { DayViewEmits, DayViewProps, DayViewStylesNames } from '../DayView/DayView.types'
import type {
  MobileMonthViewHeaderPayload,
  MobileMonthViewEmits,
  MobileMonthViewProps,
  MobileMonthViewStylesNames,
} from '../MobileMonthView/MobileMonthView.types'
import type {
  MonthViewEmits,
  MonthViewProps,
  MonthViewStylesNames,
} from '../MonthView/MonthView.types'
import type {
  WeekLabelPayload,
  WeekViewEmits,
  WeekViewProps,
  WeekViewStylesNames,
} from '../WeekView/WeekView.types'
import type { YearViewEmits, YearViewProps, YearViewStylesNames } from '../YearView/YearView.types'

/**
 * How `Schedule` lays its views out: `default` renders the selected view alone, `responsive`
 * also renders a mobile-friendly view that CSS swaps in on narrow screens.
 */
export type ScheduleLayout = 'default' | 'responsive'

export type ScheduleOwnStylesNames = 'root' | 'desktopView' | 'mobileView'

/** `Schedule` forwards `classNames` and `styles` to the view it renders. */
export type ScheduleStylesNames =
  | ScheduleOwnStylesNames
  | DayViewStylesNames
  | WeekViewStylesNames
  | MonthViewStylesNames
  | YearViewStylesNames
  | MobileMonthViewStylesNames

export interface ScheduleSlots extends EventSlots {
  /** Replaces the week label in `WeekView`. Takes precedence over its `renderWeekLabel` prop. */
  weekLabel?: (props: WeekLabelPayload) => VNodeChild

  /** Replaces the header of `MobileMonthView`. Takes precedence over its `renderHeader` prop. */
  header?: (props: MobileMonthViewHeaderPayload) => VNodeChild
}

/** Props declared by `Schedule` itself. See `ScheduleProps` for the full public type. */
export interface ScheduleOwnProps extends StylesApiProps<ScheduleFactory> {
  /** Date displayed by the active view, bound with `v-model:date`. */
  date?: Date | DateStringValue

  /** Date displayed on the first render when `date` is not set. @default today */
  defaultDate?: Date | DateStringValue

  /** Active view level, bound with `v-model:view`. */
  view?: ScheduleViewLevel

  /**
   * View level shown on the first render when `view` is not set.
   * @default 'week'
   */
  defaultView?: ScheduleViewLevel

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
   * If set, events can be dragged onto another slot or day.
   * @default false
   */
  withEventsDragAndDrop?: boolean

  /**
   * Returns whether the given event may be dragged.
   * @default () => true
   */
  canDragEvent?: (event: ScheduleEventData) => boolean

  /**
   * If set, items dragged in from outside the schedule can be dropped on a slot or day, which emits
   * `externalEventDrop`. Enabling event drag and drop turns this on as well.
   * @default false
   */
  withExternalEventDrop?: boolean

  /**
   * If set, dragging across slots or days selects a range.
   * @default false
   */
  withDragSlotSelect?: boolean

  /**
   * Interaction mode. `static` disables every event, slot and navigation interaction.
   * @default 'default'
   */
  mode?: ScheduleMode

  /**
   * If set, events can be resized by dragging their edges in the time-axis views.
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
   * `responsive` additionally renders a mobile-friendly view that CSS swaps in on narrow screens.
   * @default 'default'
   */
  layout?: ScheduleLayout

  /** Props passed to `DayView`. */
  dayViewProps?: ForwardedProps<DayViewProps, DayViewEmits>

  /** Props passed to `WeekView`. */
  weekViewProps?: ForwardedProps<WeekViewProps, WeekViewEmits>

  /** Props passed to `MonthView`. */
  monthViewProps?: ForwardedProps<MonthViewProps, MonthViewEmits>

  /** Props passed to `YearView`. */
  yearViewProps?: ForwardedProps<YearViewProps, YearViewEmits>

  /** Props passed to `MobileMonthView`, used only when `layout` is `responsive`. */
  mobileMonthViewProps?: ForwardedProps<MobileMonthViewProps, MobileMonthViewEmits>
}

export interface ScheduleProps extends Omit<BoxProps, keyof ScheduleOwnProps>, ScheduleOwnProps {}

export interface ScheduleEmits {
  /** Emitted when the active view navigates to another date, bound with `v-model:date`. */
  'update:date': [date: DateStringValue]

  /** Emitted when another view level is selected, bound with `v-model:view`. */
  'update:view': [view: ScheduleViewLevel]

  /** Emitted when the active view navigates to another date. */
  dateChange: [date: DateStringValue]

  /** Emitted when another view level is selected. */
  viewChange: [view: ScheduleViewLevel]

  /** Emitted when an event is clicked. */
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]

  /** Emitted when an event is dropped in a new position. */
  eventDrop: [data: EventDropData]

  /** Emitted when a drag of an event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a drag of an event ends. */
  eventDragEnd: []

  /** Emitted when a time slot is clicked. */
  timeSlotClick: [data: TimeSlotClickData]

  /** Emitted when an all-day slot is clicked. */
  allDaySlotClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when a day is clicked in the month or year view. */
  dayClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when a month caption is clicked in the year view. */
  monthClick: [month: DateStringValue]

  /** Emitted when a range is selected by dragging. */
  slotDragEnd: [rangeStart: DateTimeStringValue, rangeEnd: DateTimeStringValue]

  /** Emitted when an item from outside the schedule is dropped. */
  externalEventDrop: [dataTransfer: DataTransfer, dateTime: DateTimeStringValue]

  /** Emitted when an event is resized. */
  eventResize: [data: EventDropData]
}

export type ScheduleFactory = Factory<{
  props: Omit<ScheduleProps, 'rootRef'>
  slots: ScheduleSlots
  emits: ScheduleEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ScheduleStylesNames
}>
