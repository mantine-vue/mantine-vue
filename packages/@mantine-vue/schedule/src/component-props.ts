import type { CSSProperties, HTMLAttributes, PropType, VNodeChild } from 'vue'
import type { ScheduleLabelsOverride } from './labels'
import type {
  AnyDateValue,
  DateLabelFormat,
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleMode,
  ScheduleViewLevel,
} from './types'
import type { BusinessHoursValue } from './utils'

export type NativeButtonProps = HTMLAttributes & Record<`data-${string}`, unknown>
export type RenderEventBody = (event: ScheduleEventData) => VNodeChild
export type RenderEvent = (event: ScheduleEventData, props: ScheduleEventRenderProps) => VNodeChild

export interface ScheduleEventRenderProps extends NativeButtonProps {
  children?: VNodeChild
}

export interface EventDropData {
  eventId: string | number
  newStart: DateTimeStringValue
  newEnd: DateTimeStringValue
  event: ScheduleEventData
}

export interface TimeSlotClickData {
  slotStart: DateTimeStringValue
  slotEnd: DateTimeStringValue
  nativeEvent: MouseEvent
}

export interface BaseViewProps extends HTMLAttributes {
  date: Date | DateStringValue
  onDateChange?: (date: DateStringValue) => void
  events?: ScheduleEventData[]
  locale?: string
  radius?: string | number
  labels?: ScheduleLabelsOverride
  mode?: ScheduleMode
  withHeader?: boolean
  onViewChange?: (view: ScheduleViewLevel) => void
  previousControlProps?: NativeButtonProps
  nextControlProps?: NativeButtonProps
  todayControlProps?: NativeButtonProps
  viewSelectProps?: Partial<ViewSelectProps>
  renderEventBody?: RenderEventBody
  renderEvent?: RenderEvent
  onEventClick?: (event: ScheduleEventData, nativeEvent: MouseEvent) => void
  recurrenceExpansionLimit?: number
}

export interface TimeViewProps extends BaseViewProps {
  startTime?: string
  endTime?: string
  intervalMinutes?: number
  slotLabelFormat?: DateLabelFormat
  withCurrentTimeIndicator?: boolean
  withCurrentTimeBubble?: boolean
  getCurrentTime?: () => AnyDateValue
  slotHeight?: CSSProperties['height']
  highlightBusinessHours?: boolean
  businessHours?: BusinessHoursValue
  withEventsDragAndDrop?: boolean
  onEventDrop?: (data: EventDropData) => void
  canDragEvent?: (event: ScheduleEventData) => boolean
  onEventDragStart?: (event: ScheduleEventData) => void
  onEventDragEnd?: () => void
  onTimeSlotClick?: (data: TimeSlotClickData) => void
  onAllDaySlotClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
  withDragSlotSelect?: boolean
  onSlotDragEnd?: (rangeStart: DateTimeStringValue, rangeEnd: DateTimeStringValue) => void
  startScrollTime?: string
  onExternalEventDrop?: (dataTransfer: DataTransfer, dropDateTime: DateTimeStringValue) => void
  withEventResize?: boolean
  onEventResize?: (data: EventDropData) => void
  canResizeEvent?: (event: ScheduleEventData) => boolean
}

export interface DayViewProps extends TimeViewProps {
  headerFormat?: DateLabelFormat
  withAllDaySlot?: boolean
  allDaySlotHeight?: CSSProperties['height']
  maxAllDayEvents?: number
  moreEventsProps?: Partial<MoreEventsProps>
}

export interface WeekViewProps extends TimeViewProps {
  firstDayOfWeek?: DayOfWeek
  weekdayFormat?: DateLabelFormat
  dayFormat?: DateLabelFormat
  withWeekNumber?: boolean
  withAllDaySlots?: boolean
  /** @deprecated Use withWeekNumber */
  withWeekNumbers?: boolean
  /** @deprecated Use withAllDaySlots */
  withAllDaySlot?: boolean
  allDaySlotsHeight?: CSSProperties['height']
  maxAllDayEvents?: number
  weekendDays?: DayOfWeek[]
  withWeekendDays?: boolean
  forceCurrentTimeIndicator?: boolean
  weekLabelFormat?: DateLabelFormat
  renderWeekLabel?: (input: { weekStart: DateStringValue; weekEnd: DateStringValue }) => string
}

export interface MonthViewProps extends BaseViewProps {
  firstDayOfWeek?: DayOfWeek
  weekdayFormat?: DateLabelFormat
  weekendDays?: DayOfWeek[]
  withWeekNumbers?: boolean
  withWeekDays?: boolean
  consistentWeeks?: boolean
  highlightToday?: boolean
  withOutsideDays?: boolean
  maxEventsPerDay?: number
  getDayProps?: (date: DateStringValue) => NativeButtonProps
  getWeekNumberProps?: (weekStartDate: DateStringValue) => NativeButtonProps
  onDayClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
  onWeekNumberClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
  withEventsDragAndDrop?: boolean
  onEventDrop?: (data: EventDropData) => void
  canDragEvent?: (event: ScheduleEventData) => boolean
  onEventDragStart?: (event: ScheduleEventData) => void
  onEventDragEnd?: () => void
  onExternalEventDrop?: (dataTransfer: DataTransfer, date: DateStringValue) => void
  withDragSlotSelect?: boolean
  onSlotDragEnd?: (rangeStart: DateStringValue, rangeEnd: DateStringValue) => void
}

export interface YearViewProps extends BaseViewProps {
  firstDayOfWeek?: DayOfWeek
  weekdayFormat?: DateLabelFormat
  weekendDays?: DayOfWeek[]
  withWeekNumbers?: boolean
  withWeekDays?: boolean
  consistentWeeks?: boolean
  highlightToday?: boolean
  withOutsideDays?: boolean
  monthsListFormat?: DateLabelFormat
  getDayProps?: (date: DateStringValue) => NativeButtonProps
  getWeekNumberProps?: (weekStartDate: DateStringValue) => NativeButtonProps
  onDayClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
  onMonthClick?: (month: DateStringValue) => void
  onWeekNumberClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
}

export interface MobileMonthViewProps extends MonthViewProps {
  selectedDate?: Date | DateStringValue | null
  defaultSelectedDate?: Date | DateStringValue | null
  onSelectedDateChange?: (date: DateStringValue | null) => void
  eventsHeaderFormat?: DateLabelFormat
  onYearClick?: () => void
  renderHeader?: (input: {
    mode: ScheduleMode
    date: Date | DateStringValue
    defaultHeader: VNodeChild
  }) => VNodeChild
}

export interface ViewSelectProps extends Omit<HTMLAttributes, 'onChange'> {
  views?: readonly ScheduleViewLevel[]
  value?: ScheduleViewLevel
  onChange?: (value: ScheduleViewLevel) => void
  radius?: string | number
  labels?: ScheduleLabelsOverride
}

export interface MonthYearSelectProps extends HTMLAttributes {
  locale?: string
  startYear?: number
  endYear?: number
  yearValue?: number
  monthValue?: number
  onYearChange?: (year: number) => void
  onMonthChange?: (month: number) => void
  monthsListFormat?: DateLabelFormat
  labelFormat?: DateLabelFormat
  radius?: string | number
  getYearControlProps?: (year: number) => NativeButtonProps
  getMonthControlProps?: (month: number) => NativeButtonProps
  withMonths?: boolean
  labels?: ScheduleLabelsOverride
}

export interface ScheduleHeaderProps extends HTMLAttributes {
  labels?: ScheduleLabelsOverride
}

export interface HeaderControlProps extends NativeButtonProps {
  active?: boolean
  square?: boolean
  radius?: string | number
  interactive?: boolean
  labels?: ScheduleLabelsOverride
}

export interface ScheduleEventProps extends NativeButtonProps {
  event: ScheduleEventData
  radius?: string | number
  nowrap?: boolean
  autoSize?: boolean
  size?: 'sm' | 'md' | (string & {})
  renderEventBody?: RenderEventBody
  renderEvent?: RenderEvent
  hanging?: 'start' | 'end' | 'both' | 'none'
  draggable?: boolean
  onEventDragStart?: (event: ScheduleEventData) => void
  onEventDragEnd?: () => void
  isDragging?: boolean
  mode?: ScheduleMode
  withResize?: boolean
  onResizeStart?: (edge: 'top' | 'bottom', event: PointerEvent) => void
  isResizing?: boolean
}

export type MoreEventsDropdownType = 'popover' | 'modal'
export interface MoreEventsProps extends NativeButtonProps {
  events: ScheduleEventData[]
  moreEventsCount: number
  radius?: string | number
  modalTitle?: string
  dropdownType?: MoreEventsDropdownType
  popoverProps?: Record<string, unknown>
  modalProps?: Record<string, unknown>
  onDropdownClose?: () => void
  renderEventBody?: RenderEventBody
  renderEvent?: RenderEvent
  labels?: ScheduleLabelsOverride
  mode?: ScheduleMode
  onEventClick?: (event: ScheduleEventData, nativeEvent: MouseEvent) => void
}

export interface CurrentTimeIndicatorProps extends HTMLAttributes {
  color?: string
  startOffset?: string
  endOffset?: string
  topOffset?: string
  timeBubbleStartOffset?: string
  withTimeBubble?: boolean
  withThumb?: boolean
  currentTimeFormat?: DateLabelFormat
  locale?: string
  startTime?: string
  endTime?: string
  intervalMinutes?: number
  getCurrentTime?: () => AnyDateValue
}

export interface ScheduleProps extends HTMLAttributes {
  date?: Date | DateStringValue
  defaultDate?: Date | DateStringValue
  onDateChange?: (date: DateStringValue) => void
  view?: ScheduleViewLevel
  defaultView?: ScheduleViewLevel
  onViewChange?: (view: ScheduleViewLevel) => void
  events?: ScheduleEventData[]
  locale?: string
  radius?: string | number
  labels?: ScheduleLabelsOverride
  renderEventBody?: RenderEventBody
  withEventsDragAndDrop?: boolean
  onEventDrop?: (data: EventDropData) => void
  canDragEvent?: (event: ScheduleEventData) => boolean
  onEventDragStart?: (event: ScheduleEventData) => void
  onEventDragEnd?: () => void
  onTimeSlotClick?: (data: TimeSlotClickData) => void
  onAllDaySlotClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
  onEventClick?: (event: ScheduleEventData, nativeEvent: MouseEvent) => void
  onDayClick?: (date: DateStringValue, nativeEvent: MouseEvent) => void
  onMonthClick?: (month: DateStringValue) => void
  withDragSlotSelect?: boolean
  onSlotDragEnd?: (rangeStart: string, rangeEnd: string) => void
  mode?: ScheduleMode
  onExternalEventDrop?: (dataTransfer: DataTransfer, dateTime: string) => void
  withEventResize?: boolean
  onEventResize?: (data: EventDropData) => void
  canResizeEvent?: (event: ScheduleEventData) => boolean
  recurrenceExpansionLimit?: number
  layout?: 'default' | 'responsive'
  dayViewProps?: Partial<DayViewProps>
  weekViewProps?: Partial<WeekViewProps>
  monthViewProps?: Partial<MonthViewProps>
  yearViewProps?: Partial<YearViewProps>
  mobileMonthViewProps?: Partial<MobileMonthViewProps>
}

export const objectProp = Object as PropType<Record<string, unknown>>
