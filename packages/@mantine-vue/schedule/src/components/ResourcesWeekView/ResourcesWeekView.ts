import dayjs from 'dayjs'
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  type CSSProperties,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { Box, ScrollArea, UnstyledButton, useSafeMantineTheme } from '@mantine-vue/core'
import type {
  EventDropData,
  NativeButtonProps,
  RenderEvent,
  RenderEventBody,
  ViewSelectProps,
} from '../../component-props'
import { getLabel, type ScheduleLabelsOverride } from '../../labels'
import type {
  AnyDateValue,
  DateLabelFormat,
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleMode,
  ScheduleResourceData,
  ScheduleResourceGroup,
  ScheduleViewLevel,
} from '../../types'
import {
  formatDate,
  getBusinessHoursMod,
  getCurrentTimePosition,
  getDayTimeIntervals,
  getGroupToResourceIdMap,
  getOrderedResources,
  getWeekDays,
  handleResourcesGridKeyDown,
  isInTimeRange,
  type ResourceGroupInfo,
  type ResourcesGridControls,
} from '../../utils'
import { useHorizontalEventResize } from '../../hooks/use-horizontal-event-resize'
import { MoreEvents } from '../MoreEvents/MoreEvents'
import { ScheduleEvent } from '../ScheduleEvent/ScheduleEvent'
import { ScheduleHeaderBase } from '../ScheduleHeader/ScheduleHeaderBase'
import { forwardEventSlots, getDropEvent, moveEventTo, resolveScheduleRadius } from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { getWeekLabel } from '../WeekView/get-week-label/get-week-label'
import { getOverlapClusters } from '../ResourcesDayView/get-overlap-clusters/get-overlap-clusters'
import type { ResourceViewDropData } from '../ResourcesDayView/ResourcesDayView'
import { getResourcesWeekViewEvents } from './get-resources-week-view-events/get-resources-week-view-events'
import classes from './ResourcesWeekView.module.css'

export interface ResourcesWeekViewProps {
  date: Date | string
  onDateChange?: (value: DateStringValue) => void
  resources: ScheduleResourceData[]
  startTime?: string
  endTime?: string
  intervalMinutes?: number
  slotLabelFormat?: DateLabelFormat
  radius?: string | number
  startScrollDateTime?: string
  scrollAreaProps?: Record<string, unknown>
  locale?: string
  withCurrentTimeIndicator?: boolean
  withCurrentTimeBubble?: boolean
  getCurrentTime?: () => AnyDateValue
  withHeader?: boolean
  onViewChange?: (view: ScheduleViewLevel) => void
  previousControlProps?: NativeButtonProps
  nextControlProps?: NativeButtonProps
  todayControlProps?: NativeButtonProps
  viewSelectProps?: Partial<ViewSelectProps>
  weekLabelFormat?: DateLabelFormat
  renderWeekLabel?: (params: { weekStart: DateStringValue; weekEnd: DateStringValue }) => VNodeChild
  events?: ScheduleEventData[]
  slotWidth?: CSSProperties['width']
  rowHeight?: CSSProperties['height']
  labels?: ScheduleLabelsOverride
  highlightBusinessHours?: boolean
  businessHours?: [string, string]
  renderEventBody?: RenderEventBody
  renderEvent?: RenderEvent
  renderResourceLabel?: (resource: ScheduleResourceData) => VNodeChild
  groups?: ScheduleResourceGroup[]
  renderGroupLabel?: (group: ScheduleResourceGroup) => VNodeChild
  groupLabelWidth?: CSSProperties['width']
  withEventsDragAndDrop?: boolean
  onEventDrop?: (data: ResourceViewDropData) => void
  canDragEvent?: (event: ScheduleEventData) => boolean
  onEventDragStart?: (event: ScheduleEventData) => void
  onEventDragEnd?: () => void
  onTimeSlotClick?: (data: {
    slotStart: DateTimeStringValue
    slotEnd: DateTimeStringValue
    nativeEvent: MouseEvent
    resourceId?: string | number
  }) => void
  onEventClick?: (event: ScheduleEventData, nativeEvent: MouseEvent) => void
  withDragSlotSelect?: boolean
  onSlotDragEnd?: (data: {
    rangeStart: DateTimeStringValue
    rangeEnd: DateTimeStringValue
    resourceId?: string | number
  }) => void
  mode?: ScheduleMode
  onExternalEventDrop?: (data: {
    dataTransfer: DataTransfer
    dropDateTime: DateTimeStringValue
    resourceId?: string | number
  }) => void
  withEventResize?: boolean
  onEventResize?: (data: EventDropData) => void
  canResizeEvent?: (event: ScheduleEventData) => boolean
  recurrenceExpansionLimit?: number
  maxEventsPerTimeSlot?: number
  moreEventsProps?: Record<string, unknown>
  firstDayOfWeek?: DayOfWeek
  weekendDays?: DayOfWeek[]
  withWeekendDays?: boolean
  weekdayFormat?: DateLabelFormat
  highlightToday?: boolean
}

export interface ResourcesWeekViewSlots {
  header?: (props: {
    weekStart: DateStringValue
    weekEnd: DateStringValue
    label: VNodeChild
  }) => VNodeChild
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild
  dayLabel?: (props: { date: DateStringValue; label: VNodeChild }) => VNodeChild
  timeLabel?: (props: {
    date: DateStringValue
    label: VNodeChild
    startTime: string
    endTime: string
  }) => VNodeChild
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild
  timeSlot?: (props: {
    resource: ScheduleResourceData
    date: DateStringValue
    startTime: string
    endTime: string
  }) => VNodeChild
  backgroundEvent?: (props: { event: ScheduleEventData; date: DateStringValue }) => VNodeChild
  allDayEvent?: (props: {
    event: ScheduleEventData
    startDayIndex: number
    endDayIndex: number
  }) => VNodeChild
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
  moreEvents?: (props: {
    events: ScheduleEventData[]
    hiddenCount: number
    date: DateStringValue
  }) => VNodeChild
  currentTimeIndicator?: (props: {
    time: VNodeChild
    offset: number
    date: DateStringValue
  }) => VNodeChild
}

function cssSize(value: CSSProperties['width']): string | undefined {
  return typeof value === 'number' ? `${value}px` : value
}

export const ResourcesWeekView = defineComponent({
  name: 'ResourcesWeekView',
  inheritAttrs: false,
  slots: Object as SlotsType<ResourcesWeekViewSlots>,
  props: {
    date: { type: [String, Date] as PropType<Date | string>, required: true },
    onDateChange: Function as PropType<ResourcesWeekViewProps['onDateChange']>,
    resources: { type: Array as PropType<ScheduleResourceData[]>, required: true },
    startTime: { type: String, default: '00:00:00' },
    endTime: { type: String, default: '23:59:59' },
    intervalMinutes: { type: Number, default: 60 },
    slotLabelFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'HH:mm' },
    radius: [String, Number] as PropType<string | number>,
    startScrollDateTime: String,
    scrollAreaProps: Object as PropType<Record<string, unknown>>,
    locale: String,
    withCurrentTimeIndicator: { type: Boolean, default: undefined },
    withCurrentTimeBubble: { type: Boolean, default: true },
    getCurrentTime: Function as PropType<() => AnyDateValue>,
    withHeader: { type: Boolean, default: true },
    onViewChange: Function as PropType<ResourcesWeekViewProps['onViewChange']>,
    previousControlProps: Object as PropType<NativeButtonProps>,
    nextControlProps: Object as PropType<NativeButtonProps>,
    todayControlProps: Object as PropType<NativeButtonProps>,
    viewSelectProps: Object as PropType<Partial<ViewSelectProps>>,
    weekLabelFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'MMM DD' },
    renderWeekLabel: Function as PropType<ResourcesWeekViewProps['renderWeekLabel']>,
    events: Array as PropType<ScheduleEventData[]>,
    slotWidth: { type: [String, Number] as PropType<CSSProperties['width']>, default: 60 },
    rowHeight: { type: [String, Number] as PropType<CSSProperties['height']>, default: 64 },
    labels: Object as PropType<ScheduleLabelsOverride>,
    highlightBusinessHours: Boolean,
    businessHours: {
      type: Array as unknown as PropType<[string, string]>,
      default: () => ['09:00:00', '17:00:00'],
    },
    renderEventBody: Function as PropType<RenderEventBody>,
    renderEvent: Function as PropType<RenderEvent>,
    renderResourceLabel: Function as PropType<ResourcesWeekViewProps['renderResourceLabel']>,
    groups: Array as PropType<ScheduleResourceGroup[]>,
    renderGroupLabel: Function as PropType<ResourcesWeekViewProps['renderGroupLabel']>,
    groupLabelWidth: { type: [String, Number] as PropType<CSSProperties['width']>, default: 80 },
    withEventsDragAndDrop: Boolean,
    onEventDrop: Function as PropType<ResourcesWeekViewProps['onEventDrop']>,
    canDragEvent: Function as PropType<ResourcesWeekViewProps['canDragEvent']>,
    onEventDragStart: Function as PropType<ResourcesWeekViewProps['onEventDragStart']>,
    onEventDragEnd: Function as PropType<ResourcesWeekViewProps['onEventDragEnd']>,
    onTimeSlotClick: Function as PropType<ResourcesWeekViewProps['onTimeSlotClick']>,
    onEventClick: Function as PropType<ResourcesWeekViewProps['onEventClick']>,
    withDragSlotSelect: Boolean,
    onSlotDragEnd: Function as PropType<ResourcesWeekViewProps['onSlotDragEnd']>,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    onExternalEventDrop: Function as PropType<ResourcesWeekViewProps['onExternalEventDrop']>,
    withEventResize: Boolean,
    onEventResize: Function as PropType<ResourcesWeekViewProps['onEventResize']>,
    canResizeEvent: Function as PropType<ResourcesWeekViewProps['canResizeEvent']>,
    recurrenceExpansionLimit: { type: Number, default: 2000 },
    maxEventsPerTimeSlot: { type: Number, default: 2 },
    moreEventsProps: Object as PropType<Record<string, unknown>>,
    firstDayOfWeek: { type: Number as PropType<DayOfWeek>, default: 1 },
    weekendDays: { type: Array as PropType<DayOfWeek[]>, default: () => [0, 6] },
    withWeekendDays: { type: Boolean, default: true },
    weekdayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'ddd D' },
    highlightToday: { type: Boolean, default: true },
  },
  setup(props, { attrs, slots }) {
    const theme = useSafeMantineTheme()
    const controls: ResourcesGridControls = []
    const rootElement = ref<HTMLElement | null>(null)
    const rowContainers = new Map<number, HTMLElement>()
    const dropTarget = ref<{ resourceId: string | number; flatIndex: number } | null>(null)
    const scrolledX = ref(false)
    const intervals = computed(() =>
      getDayTimeIntervals({
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
      }),
    )
    const weekdays = computed(() =>
      getWeekDays({
        week: props.date,
        firstDayOfWeek: props.firstDayOfWeek,
        weekendDays: props.weekendDays,
        withWeekendDays: props.withWeekendDays,
      }).map((day) => dayjs(day).format('YYYY-MM-DD')),
    )
    const ordered = computed(() => getOrderedResources(props.resources, props.groups))
    const resourceIdMap = computed(() => getGroupToResourceIdMap(props.resources))
    const weekEvents = computed(() =>
      getResourcesWeekViewEvents({
        events: props.events,
        resources: props.resources,
        weekdays: weekdays.value,
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
        expansionLimit: props.recurrenceExpansionLimit,
      }),
    )

    onMounted(async () => {
      if (!props.startScrollDateTime) return
      await nextTick()
      const target = dayjs(props.startScrollDateTime)
      const dayIndex = weekdays.value.findIndex((day) => dayjs(day).isSame(target, 'day'))
      if (dayIndex < 0) return
      const targetTime = target.format('HH:mm:ss')
      const intervalIndex = intervals.value.findIndex(
        (interval) => interval.startTime >= targetTime,
      )
      if (intervalIndex < 0) return
      const flatIndex = dayIndex * intervals.value.length + intervalIndex
      const targetSlot = controls[0]?.[flatIndex]
      const viewport = rootElement.value?.querySelector<HTMLElement>('.mantine-ScrollArea-viewport')
      if (targetSlot && viewport) {
        viewport.scrollLeft = targetSlot.offsetLeft
        requestAnimationFrame(() => (viewport.scrollLeft = targetSlot.offsetLeft))
      }
    })
    const slotSelect = useSlotDragSelect({
      enabled: () => props.withDragSlotSelect && props.mode !== 'static',
      onDragEnd: () => (start, end, group) => {
        const count = intervals.value.length
        const startDay = Math.floor(start / count)
        const endDay = Math.floor(end / count)
        const first = intervals.value[start % count]
        const last = intervals.value[end % count]
        if (first && last && weekdays.value[startDay] && weekdays.value[endDay]) {
          props.onSlotDragEnd?.({
            rangeStart: `${dayjs(weekdays.value[startDay]).format('YYYY-MM-DD')} ${first.startTime}`,
            rangeEnd: `${dayjs(weekdays.value[endDay]).format('YYYY-MM-DD')} ${last.endTime}`,
            resourceId: resourceIdMap.value.get(group),
          })
        }
      },
    })
    const resize = useHorizontalEventResize({
      enabled: () => props.withEventResize,
      mode: () => props.mode,
      startTime: () => props.startTime,
      endTime: () => props.endTime,
      intervalMinutes: () => props.intervalMinutes,
      onEventResize: () => props.onEventResize,
      canResizeEvent: () => props.canResizeEvent,
    })
    const emitDrop = (nativeEvent: DragEvent, resourceId: string | number, flatIndex: number) => {
      nativeEvent.preventDefault()
      dropTarget.value = null
      const count = intervals.value.length
      const day = weekdays.value[Math.floor(flatIndex / count)]
      const interval = intervals.value[flatIndex % count]
      if (!day || !interval) return
      const target = `${dayjs(day).format('YYYY-MM-DD')} ${interval.startTime}`
      const event = getDropEvent(props.events, nativeEvent.dataTransfer)
      if (event) props.onEventDrop?.({ ...moveEventTo(event, target), resourceId })
      else if (nativeEvent.dataTransfer)
        props.onExternalEventDrop?.({
          dataTransfer: nativeEvent.dataTransfer,
          dropDateTime: target,
          resourceId,
        })
    }
    const getFlatIndexAtPoint = (nativeEvent: DragEvent, resourceIndex: number) => {
      const container = rowContainers.get(resourceIndex)
      const count = intervals.value.length * weekdays.value.length
      if (!container || count === 0) return -1
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0) return -1
      return Math.max(
        0,
        Math.min(count - 1, Math.floor(((nativeEvent.clientX - rect.left) / rect.width) * count)),
      )
    }
    const groupCell = (info: ResourceGroupInfo | null | undefined) => {
      if (info === undefined) return null
      if (info === null) return h(Box, { class: classes.resourcesWeekViewGroupColumnEmpty })
      const starts = info.position === 'first' || info.position === 'only'
      return h(
        Box,
        { class: classes.resourcesWeekViewGroupColumn, 'data-group-position': info.position },
        () =>
          starts
            ? h(
                'span',
                {
                  style:
                    info.count > 1
                      ? {
                          transform: `translateY(calc((${info.count - 1} * (var(--resources-week-view-row-height) + 1px)) / 2))`,
                        }
                      : undefined,
                },
                slots.groupLabel?.({ group: info.group }) ??
                  props.renderGroupLabel?.(info.group) ??
                  info.group.label ??
                  undefined,
              )
            : null,
      )
    }

    return () => {
      const dayCount = weekdays.value.length
      const slotsPerDay = intervals.value.length
      const hasGroups = ordered.value.groupRanges.length > 0
      const now = dayjs(props.getCurrentTime?.() ?? new Date())
      const todayIndex = weekdays.value.findIndex((day) => dayjs(day).isSame(now, 'day'))
      const showIndicator =
        (props.withCurrentTimeIndicator ?? todayIndex !== -1) &&
        todayIndex !== -1 &&
        isInTimeRange({ date: now.toDate(), startTime: props.startTime, endTime: props.endTime })
      const timeOffset = getCurrentTimePosition({
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
        now,
      })
      const indicatorOffset = ((todayIndex + timeOffset / 100) / dayCount) * 100
      const currentTime = formatDate({
        date: now,
        locale: props.locale || 'en',
        format: props.slotLabelFormat,
      })

      const dayLabels = weekdays.value.map((day) => {
        const label = formatDate({
          date: day,
          locale: props.locale || 'en',
          format: props.weekdayFormat,
        })
        return h(
          Box,
          {
            key: day,
            class: classes.resourcesWeekViewDayLabel,
            style: { flex: `0 0 calc(var(--resources-week-view-slot-width) * ${slotsPerDay})` },
            'data-weekend': props.weekendDays.includes(dayjs(day).day() as DayOfWeek) || undefined,
            'data-today': (props.highlightToday && dayjs(day).isSame(now, 'day')) || undefined,
          },
          () => slots.dayLabel?.({ date: day, label }) ?? label,
        )
      })
      const timeLabels = weekdays.value.flatMap((day) =>
        intervals.value.map((interval) => {
          const label = formatDate({
            date: `${day} ${interval.startTime}`,
            locale: props.locale || 'en',
            format: props.slotLabelFormat,
          })
          const mod = getBusinessHoursMod({
            time: interval.startTime,
            businessHours: props.businessHours,
            highlightBusinessHours: props.highlightBusinessHours,
            dayOfWeek: dayjs(day).day() as DayOfWeek,
          })
          return h(
            Box,
            {
              key: `${day}-${interval.startTime}`,
              class: classes.resourcesWeekViewTimeLabel,
              'data-business-hours': mod['business-hours'] || undefined,
              'data-non-business-hours': mod['non-business-hours'] || undefined,
            },
            () =>
              slots.timeLabel?.({
                date: day,
                label,
                startTime: interval.startTime,
                endTime: interval.endTime,
              }) ?? label,
          )
        }),
      )

      const rows = ordered.value.orderedResources.map((resource, resourceIndex) => {
        const background: VNodeChild[] = []
        const regular: VNodeChild[] = []
        const more: VNodeChild[] = []
        weekdays.value.forEach((day, dayIndex) => {
          const data = weekEvents.value.byDay[day]
          const dayOffset = (dayIndex / dayCount) * 100
          const dayWidth = 100 / dayCount
          ;[
            ...(data.backgroundTimedEvents[resource.id] || []),
            ...(data.backgroundAllDayEvents[resource.id] || []),
          ].forEach((event) => {
            const colors = theme.value.variantColorResolver({
              color: event.color || theme.value.primaryColor,
              theme: theme.value,
              variant: 'light',
              autoContrast: true,
            })
            background.push(
              slots.backgroundEvent?.({ event, date: day }) ??
                h(
                  Box,
                  {
                    key: `bg-${day}-${event.id}`,
                    class: classes.resourcesWeekViewBackgroundEvent,
                    style: {
                      left: `${dayOffset + (event.position.top / 100) * dayWidth}%`,
                      width: `${(event.position.height / 100) * dayWidth}%`,
                      top: 0,
                      height: '100%',
                      '--bg-event-bg': colors.background,
                      '--bg-event-color': colors.color,
                    },
                  },
                  () =>
                    props.renderEventBody?.(event) ?? slots.eventBody?.({ event }) ?? event.title,
                ),
            )
          })
          const allRegular = data.regularEvents[resource.id] || []
          allRegular
            .filter((event) => event.position.column < Math.max(1, props.maxEventsPerTimeSlot))
            .forEach((event) => {
              const colors = theme.value.variantColorResolver({
                color: event.color || theme.value.primaryColor,
                theme: theme.value,
                variant: event.variant || 'light',
                autoContrast: true,
              })
              const position = resize.getResizePosition(event.id)
              const relativeLeft = position?.left ?? event.position.top
              const relativeWidth = position?.width ?? event.position.height
              const isResizable = resize.isResizableEvent(event)
              regular.push(
                h(
                  Box,
                  {
                    key: `${day}-${event.id}`,
                    class: classes.resourcesWeekViewEventWrapper,
                    'data-resizing': position !== null || undefined,
                    style: {
                      '--event-color': colors.color,
                      left: `calc(${dayOffset + (relativeLeft / 100) * dayWidth}% + 1px)`,
                      width: `calc(${(relativeWidth / 100) * dayWidth}% - 2px)`,
                      top: `${event.position.offset}%`,
                      height: `${event.position.width}%`,
                    },
                  },
                  () => [
                    h(
                      ScheduleEvent,
                      {
                        event,
                        autoSize: true,
                        nowrap: true,
                        radius: props.radius,
                        mode: props.mode,
                        renderEvent: props.renderEvent,
                        renderEventBody: props.renderEventBody,
                        draggable:
                          props.withEventsDragAndDrop &&
                          props.mode !== 'static' &&
                          (props.canDragEvent?.(event) ?? true),
                        onEventDragStart: props.onEventDragStart,
                        onEventDragEnd: props.onEventDragEnd,
                        onClick:
                          props.mode === 'static'
                            ? undefined
                            : (nativeEvent: MouseEvent) => {
                                if (!resize.wasResizing()) props.onEventClick?.(event, nativeEvent)
                              },
                        style: { width: '100%', height: '100%' },
                      },
                      forwardEventSlots(slots),
                    ),
                    isResizable
                      ? ['start', 'end'].map((edge) =>
                          h('div', {
                            class: classes.resourcesWeekViewResizeHandle,
                            'data-edge': edge,
                            'data-active': resize.state.value?.edge === edge || undefined,
                            'aria-label': `${edge === 'start' ? 'Resize event start' : 'Resize event end'} ${event.title}`,
                            onDragstart: (nativeEvent: DragEvent) => nativeEvent.preventDefault(),
                            onPointerdown: (pointerEvent: PointerEvent) => {
                              const container = rowContainers.get(resourceIndex)
                              if (container)
                                resize.handleResizeStart({
                                  event,
                                  edge: edge as 'start' | 'end',
                                  container,
                                  originalLeft: event.position.top,
                                  originalWidth: event.position.height,
                                  eventDate: dayjs(day).format('YYYY-MM-DD'),
                                  dayIndex,
                                  dayCount,
                                  pointerEvent,
                                })
                            },
                          }),
                        )
                      : null,
                  ],
                ),
              )
            })
          getOverlapClusters(allRegular)
            .filter((cluster) =>
              cluster.some((event) => event.position.column >= props.maxEventsPerTimeSlot),
            )
            .forEach((cluster) => {
              const hiddenCount = cluster.filter(
                (event) => event.position.column >= props.maxEventsPerTimeSlot,
              ).length
              const left = Math.min(...cluster.map((event) => event.position.top))
              const right = Math.max(
                ...cluster.map((event) => event.position.top + event.position.height),
              )
              more.push(
                slots.moreEvents?.({ events: cluster, hiddenCount, date: day }) ??
                  h(
                    MoreEvents,
                    {
                      ...props.moreEventsProps,
                      key: `more-${day}-${cluster[0].id}`,
                      events: cluster,
                      moreEventsCount: hiddenCount,
                      mode: props.mode,
                      labels: props.labels,
                      renderEventBody: props.renderEventBody,
                      renderEvent: props.renderEvent,
                      onEventClick: props.onEventClick,
                      style: {
                        position: 'absolute',
                        left: `calc(${dayOffset + (left / 100) * dayWidth}% + 1px)`,
                        width: `calc(${((right - left) / 100) * dayWidth}% - 2px)`,
                        bottom: 0,
                        height: '22px',
                        zIndex: 4,
                      },
                    },
                    forwardEventSlots(slots),
                  ),
              )
            })
        })
        const allDayBars = weekEvents.value.allDayBars[resource.id] || []
        const allDay = allDayBars.map((bar) =>
          h(
            Box,
            {
              key: `all-${bar.event.id}`,
              class: classes.resourcesWeekViewAllDayEvent,
              style: {
                left: `calc(${(bar.startDayIndex / dayCount) * 100}% + 1px)`,
                width: `calc(${((bar.endDayIndex - bar.startDayIndex + 1) / dayCount) * 100}% - 2px)`,
                top: `calc(${bar.row} * (var(--resources-week-view-all-day-height) + 2px) + 2px)`,
              },
            },
            () =>
              slots.allDayEvent?.({
                event: bar.event,
                startDayIndex: bar.startDayIndex,
                endDayIndex: bar.endDayIndex,
              }) ??
              h(
                ScheduleEvent,
                {
                  event: bar.event,
                  autoSize: true,
                  nowrap: true,
                  radius: props.radius,
                  mode: props.mode,
                  renderEvent: props.renderEvent,
                  renderEventBody: props.renderEventBody,
                  onClick:
                    props.mode === 'static'
                      ? undefined
                      : (nativeEvent: MouseEvent) => props.onEventClick?.(bar.event, nativeEvent),
                  style: { width: '100%', height: '100%' },
                },
                forwardEventSlots(slots),
              ),
          ),
        )
        const slotGroup = String(resource.id)
        const buttons = weekdays.value.flatMap((day, dayIndex) =>
          intervals.value.map((interval, slotIndex) => {
            const flatIndex = dayIndex * slotsPerDay + slotIndex
            const mod = getBusinessHoursMod({
              time: interval.startTime,
              businessHours: props.businessHours,
              highlightBusinessHours: props.highlightBusinessHours,
              dayOfWeek: dayjs(day).day() as DayOfWeek,
            })
            return h(
              UnstyledButton,
              {
                key: `${day}-${interval.startTime}`,
                ref: (element: unknown) => {
                  const button = (element as { $el?: HTMLButtonElement } | null)?.$el ?? element
                  controls[resourceIndex] ||= []
                  controls[resourceIndex][flatIndex] =
                    button instanceof HTMLButtonElement ? button : undefined
                },
                class: classes.resourcesWeekViewRowSlot,
                'data-business-hours': mod['business-hours'] || undefined,
                'data-non-business-hours': mod['non-business-hours'] || undefined,
                'data-drop-target':
                  dropTarget.value?.resourceId === resource.id &&
                  dropTarget.value.flatIndex === flatIndex
                    ? true
                    : undefined,
                'data-drag-selected': slotSelect.isSlotSelected(flatIndex, slotGroup) || undefined,
                'data-static': props.mode === 'static' || undefined,
                'data-drag-slot-index': props.withDragSlotSelect ? flatIndex : undefined,
                'data-drag-slot-group': props.withDragSlotSelect ? slotGroup : undefined,
                'aria-label': `${getLabel('resourceSlot', props.labels)} ${String(resource.label)} ${day} ${interval.startTime} - ${interval.endTime}`,
                tabindex:
                  props.mode === 'static' ? -1 : resourceIndex === 0 && flatIndex === 0 ? 0 : -1,
                onKeydown: (event: KeyboardEvent) =>
                  handleResourcesGridKeyDown({
                    controls,
                    resourceIndex,
                    slotIndex: flatIndex,
                    event,
                  }),
                onPointerdown:
                  props.mode === 'static'
                    ? undefined
                    : (event: PointerEvent) =>
                        slotSelect.handleSlotPointerDown(event, flatIndex, slotGroup),
                onClick:
                  props.mode === 'static'
                    ? undefined
                    : (nativeEvent: MouseEvent) =>
                        props.onTimeSlotClick?.({
                          slotStart: `${day} ${interval.startTime}`,
                          slotEnd: `${day} ${interval.endTime}`,
                          nativeEvent,
                          resourceId: resource.id,
                        }),
              },
              () =>
                slots.timeSlot?.({
                  resource,
                  date: day,
                  startTime: interval.startTime,
                  endTime: interval.endTime,
                }),
            )
          }),
        )
        const info = hasGroups ? ordered.value.resourceGroupMap[resourceIndex] : undefined
        const allDayRows = allDayBars.length ? Math.max(...allDayBars.map((bar) => bar.row)) + 1 : 0
        return h(Box, { key: resource.id, class: classes.resourcesWeekViewRow }, () => [
          groupCell(info),
          h(
            Box,
            {
              class: classes.resourcesWeekViewResourceLabel,
              'data-scrolled-x': scrolledX.value || undefined,
              'data-has-groups': info !== undefined || undefined,
            },
            () =>
              slots.resourceLabel?.({ resource }) ??
              props.renderResourceLabel?.(resource) ??
              resource.label,
          ),
          h(
            Box,
            {
              class: classes.resourcesWeekViewRowSlots,
              ref: (element: unknown) => {
                const node = (element as { $el?: HTMLElement } | null)?.$el ?? element
                if (node instanceof HTMLElement) rowContainers.set(resourceIndex, node)
              },
              style: allDayRows
                ? {
                    minHeight: `max(var(--resources-week-view-row-height), calc(${allDayRows} * (var(--resources-week-view-all-day-height) + 2px) + 4px))`,
                  }
                : undefined,
              onDragover:
                props.withEventsDragAndDrop || props.onExternalEventDrop
                  ? (nativeEvent: DragEvent) => {
                      if (props.mode === 'static') return
                      nativeEvent.preventDefault()
                      const flatIndex = getFlatIndexAtPoint(nativeEvent, resourceIndex)
                      if (
                        flatIndex >= 0 &&
                        (dropTarget.value?.resourceId !== resource.id ||
                          dropTarget.value.flatIndex !== flatIndex)
                      ) {
                        dropTarget.value = { resourceId: resource.id, flatIndex }
                      }
                    }
                  : undefined,
              onDragleave:
                props.withEventsDragAndDrop || props.onExternalEventDrop
                  ? (nativeEvent: DragEvent) => {
                      const related = nativeEvent.relatedTarget
                      const current = nativeEvent.currentTarget
                      if (
                        !(related instanceof Node) ||
                        !(current instanceof HTMLElement) ||
                        !current.contains(related)
                      ) {
                        dropTarget.value = null
                      }
                    }
                  : undefined,
              onDrop:
                props.withEventsDragAndDrop || props.onExternalEventDrop
                  ? (nativeEvent: DragEvent) => {
                      const flatIndex = getFlatIndexAtPoint(nativeEvent, resourceIndex)
                      if (flatIndex >= 0) emitDrop(nativeEvent, resource.id, flatIndex)
                    }
                  : undefined,
            },
            () => [...background, ...allDay, ...regular, ...more, ...buttons],
          ),
        ])
      })

      const weekStart = dayjs(weekdays.value[0]).format('YYYY-MM-DD')
      const weekEnd = dayjs(weekdays.value.at(-1)).format('YYYY-MM-DD')
      const headerLabel =
        props.renderWeekLabel?.({ weekStart, weekEnd }) ??
        getWeekLabel({
          weekdays: weekdays.value,
          locale: props.locale || 'en',
          weekLabelFormat: props.weekLabelFormat,
        })
      const header = props.withHeader
        ? (slots.header?.({ weekStart, weekEnd, label: headerLabel }) ??
          h(ScheduleHeaderBase, {
            view: 'week',
            navigationHandlers: {
              previous: () => dayjs(props.date).subtract(1, 'week').format('YYYY-MM-DD'),
              next: () => dayjs(props.date).add(1, 'week').format('YYYY-MM-DD'),
              today: () => now.format('YYYY-MM-DD'),
            },
            control: { title: headerLabel },
            labels: props.labels,
            onDateChange: props.onDateChange,
            onViewChange: props.onViewChange,
            previousControlProps: props.previousControlProps,
            nextControlProps: props.nextControlProps,
            todayControlProps: props.todayControlProps,
            viewSelectProps: { views: ['day', 'week', 'month'], ...props.viewSelectProps },
          }))
        : null
      const indicator = showIndicator
        ? (slots.currentTimeIndicator?.({
            time: currentTime,
            offset: indicatorOffset,
            date: weekdays.value[todayIndex],
          }) ??
          h(
            Box,
            {
              class: classes.resourcesWeekViewCurrentTimeIndicator,
              style: {
                '--indicator-left-offset': hasGroups
                  ? `calc(var(--resources-week-view-resource-label-width) + var(--resources-week-view-group-label-width) + (100% - var(--resources-week-view-resource-label-width) - var(--resources-week-view-group-label-width)) * ${indicatorOffset} / 100)`
                  : `calc(var(--resources-week-view-resource-label-width) + (100% - var(--resources-week-view-resource-label-width)) * ${indicatorOffset} / 100)`,
                '--_time-bubble-width': String(currentTime).toLowerCase().includes('m')
                  ? '64px'
                  : '46px',
              },
            },
            () => [
              props.withCurrentTimeBubble
                ? h(
                    'div',
                    { class: classes.resourcesWeekViewCurrentTimeIndicatorTimeBubble },
                    currentTime,
                  )
                : h('div', { class: classes.resourcesWeekViewCurrentTimeIndicatorThumb }),
              h('div', { class: classes.resourcesWeekViewCurrentTimeIndicatorLine }),
            ],
          ))
        : null

      return h(
        Box,
        {
          ...attrs,
          ref: (element: unknown) => {
            const node = (element as { $el?: HTMLElement } | null)?.$el ?? element
            rootElement.value = node instanceof HTMLElement ? node : null
          },
          class: [classes.resourcesWeekView, attrs.class],
          style: [
            {
              '--resources-week-view-radius': resolveScheduleRadius(props.radius),
              '--resources-week-view-slot-width': cssSize(props.slotWidth),
              '--resources-week-view-row-height': cssSize(props.rowHeight),
              '--resources-week-view-group-label-width': cssSize(props.groupLabelWidth),
            },
            attrs.style,
          ],
          'data-resizing': resize.state.value ? true : undefined,
          'data-event-interaction': resize.state.value ? true : undefined,
        },
        () => [
          header,
          h(Box, { class: classes.resourcesWeekViewRoot }, () =>
            h(
              ScrollArea,
              {
                scrollbarSize: 4,
                ...props.scrollAreaProps,
                class: classes.resourcesWeekViewScrollArea,
                onScrollPositionChange: (position: { x: number }) =>
                  (scrolledX.value = position.x !== 0),
              },
              () =>
                h('div', { class: classes.resourcesWeekViewInner }, [
                  h(Box, { class: classes.resourcesWeekViewHeaderRows }, () => [
                    h(
                      'div',
                      {
                        class: classes.resourcesWeekViewCorner,
                        style: hasGroups
                          ? {
                              flexBasis:
                                'calc(var(--resources-week-view-resource-label-width) + var(--resources-week-view-group-label-width))',
                              minWidth:
                                'calc(var(--resources-week-view-resource-label-width) + var(--resources-week-view-group-label-width))',
                            }
                          : undefined,
                      },
                      slots.corner?.({ resources: ordered.value.orderedResources }) ??
                        getLabel('resources', props.labels),
                    ),
                    h('div', { class: classes.resourcesWeekViewHeaderContent }, [
                      h('div', { class: classes.resourcesWeekViewDayLabelsRow }, dayLabels),
                      h('div', { class: classes.resourcesWeekViewTimeLabelsRow }, timeLabels),
                    ]),
                  ]),
                  ...rows,
                  indicator,
                ]),
            ),
          ),
        ],
      )
    }
  },
})

export type ResourcesWeekViewStylesNames = keyof typeof classes
