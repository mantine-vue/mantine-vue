<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { cssSize, resolveScheduleRadius } from '../shared'
import type { ResourcesWeekViewOwnProps } from './ResourcesWeekView.types'

const defaultProps = {
  startTime: '00:00:00',
  endTime: '23:59:59',
  intervalMinutes: 60,
  slotLabelFormat: 'HH:mm',
  withCurrentTimeBubble: true,
  withHeader: true,
  weekLabelFormat: 'MMM DD',
  slotWidth: 60,
  rowHeight: 64,
  groupLabelWidth: 80,
  businessHours: ['09:00:00', '17:00:00'],
  mode: 'default',
  recurrenceExpansionLimit: 2000,
  maxEventsPerTimeSlot: 2,
  firstDayOfWeek: 1,
  weekendDays: [0, 6],
  withWeekendDays: true,
  weekdayFormat: 'ddd D',
  highlightToday: true,
} satisfies Partial<ResourcesWeekViewOwnProps>

/** View levels the header offers – a resource schedule has no year view. */
const RESOURCE_VIEWS = ['day', 'week', 'month'] as const

const varsResolver = createVarsResolver<any>(
  (_theme, { radius, slotWidth, rowHeight, groupLabelWidth }) => ({
    resourcesWeekView: {
      '--resources-week-view-radius': resolveScheduleRadius(radius),
      '--resources-week-view-slot-width': cssSize(slotWidth),
      '--resources-week-view-row-height': cssSize(rowHeight),
      '--resources-week-view-group-label-width': cssSize(groupLabelWidth),
    },
  }),
)

export { defaultProps, varsResolver, RESOURCE_VIEWS }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, ref, shallowRef, useAttrs, useSlots } from 'vue'
import {
  Box,
  ScrollArea,
  UnstyledButton,
  useProps,
  useSafeMantineTheme,
  useStyles,
} from '@mantine-vue/core'
import { useHorizontalEventResize } from '../../hooks/use-horizontal-event-resize'
import { getLabel } from '../../labels'
import type {
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
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
  clampIntervalMinutes,
  parseTimeString,
  type ResourceGroupInfo,
  type ResourcesGridControls,
} from '../../utils'
import { provideScheduleDragState } from '../DragContext'
import { MoreEvents } from '../MoreEvents'
import { getOverlapClusters } from '../ResourcesDayView/get-overlap-clusters/get-overlap-clusters'
import { ScheduleBackgroundEvent } from '../ScheduleBackgroundEvent'
import { ScheduleEvent } from '../ScheduleEvent'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import {
  getDropEvent,
  moveEventTo,
  rafThrottle,
  resolveEventRenderers,
  scheduleViewportProps,
  scrollSlotIntoView,
  useStaticStyles,
} from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { getWeekLabel } from '../WeekView/get-week-label/get-week-label'
import { getResourcesWeekViewEvents } from './get-resources-week-view-events/get-resources-week-view-events'
import type { ResourcesWeekViewEmits, ResourcesWeekViewSlots } from './ResourcesWeekView.types'
import classes from './ResourcesWeekView.module.css'

defineOptions({
  name: 'ResourcesWeekView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ResourcesWeekViewOwnProps>(), {
  groups: undefined,
  startTime: undefined,
  endTime: undefined,
  intervalMinutes: undefined,
  eventDragInterval: undefined,
  eventResizeInterval: undefined,
  slotLabelFormat: undefined,
  radius: undefined,
  startScrollDateTime: undefined,
  scrollAreaProps: undefined,
  locale: undefined,
  withCurrentTimeIndicator: undefined,
  withCurrentTimeBubble: undefined,
  getCurrentTime: undefined,
  withHeader: undefined,
  previousControlProps: undefined,
  nextControlProps: undefined,
  todayControlProps: undefined,
  viewSelectProps: undefined,
  weekLabelFormat: undefined,
  renderWeekLabel: undefined,
  events: undefined,
  slotWidth: undefined,
  rowHeight: undefined,
  groupLabelWidth: undefined,
  labels: undefined,
  businessHours: undefined,
  renderEventBody: undefined,
  renderEvent: undefined,
  withInteractiveBackgroundEvents: undefined,
  renderResourceLabel: undefined,
  renderGroupLabel: undefined,
  canDragEvent: undefined,
  mode: undefined,
  canResizeEvent: undefined,
  recurrenceExpansionLimit: undefined,
  maxEventsPerTimeSlot: undefined,
  moreEventsProps: undefined,
  firstDayOfWeek: undefined,
  weekendDays: undefined,
  withWeekendDays: undefined,
  weekdayFormat: undefined,
  highlightToday: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ResourcesWeekViewSlots>()

const emit = defineEmits<ResourcesWeekViewEmits>()

const slots = useSlots()
const attrs = useAttrs()
const theme = useSafeMantineTheme()

const props = useProps('ResourcesWeekView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'ResourcesWeekView',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  rootSelector: 'resourcesWeekView',
})

/**
 * Cached per selector: a resource grid renders one cell per resource and slot, and rebuilding
 * the same class list for each of them is what makes a drag re-render expensive.
 */
const staticStyles = useStaticStyles(getStyles)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const eventRenderers = computed(() => resolveEventRenderers(props, slots))

const controls: ResourcesGridControls = []
const rowContainers = new Map<number, HTMLElement>()

const rootElement = ref<HTMLElement | null>(null)
const setRootElement = (node: Element | null) => {
  rootElement.value = node instanceof HTMLElement ? node : null
}

const dropTarget = shallowRef<{ resourceId: string | number; flatIndex: number } | null>(null)
const scrolledX = ref(false)

const isStatic = computed(() => props.mode === 'static')

const intervals = computed(() =>
  getDayTimeIntervals({
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
  }),
)

const weekdays = computed(() =>
  getWeekDays({
    week: props.date,
    firstDayOfWeek: props.firstDayOfWeek,
    weekendDays: props.weekendDays,
    withWeekendDays: props.withWeekendDays,
  }).map((day) => dayjs(day).format('YYYY-MM-DD') as DateStringValue),
)

const slotsPerDay = computed(() => intervals.value.length)
const dayCount = computed(() => weekdays.value.length)

const ordered = computed(() => getOrderedResources(props.resources, props.groups))
const resourceIdMap = computed(() => getGroupToResourceIdMap(props.resources))
const hasGroups = computed(() => ordered.value.groupRanges.length > 0)

const weekEvents = computed(() =>
  getResourcesWeekViewEvents({
    events: props.events,
    resources: props.resources,
    weekdays: weekdays.value,
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
    expansionLimit: props.recurrenceExpansionLimit!,
  }),
)

const now = computed(() => dayjs(props.getCurrentTime?.() ?? new Date()))

const todayIndex = computed(() =>
  weekdays.value.findIndex((day) => dayjs(day).isSame(now.value, 'day')),
)

const showIndicator = computed(
  () =>
    (props.withCurrentTimeIndicator ?? todayIndex.value !== -1) &&
    todayIndex.value !== -1 &&
    isInTimeRange({
      date: now.value.toDate(),
      startTime: props.startTime!,
      endTime: props.endTime!,
    }),
)

const indicatorOffset = computed(() => {
  const timeOffset = getCurrentTimePosition({
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
    now: now.value,
  })

  return ((todayIndex.value + timeOffset / 100) / dayCount.value) * 100
})

const currentTime = computed(() =>
  formatDate({ date: now.value, locale: props.locale || 'en', format: props.slotLabelFormat! }),
)

const weekStart = computed(() => weekdays.value[0])
const weekEnd = computed(() => weekdays.value.at(-1)!)

const headerLabel = computed(
  () =>
    props.renderWeekLabel?.({ weekStart: weekStart.value, weekEnd: weekEnd.value }) ??
    getWeekLabel({
      weekdays: weekdays.value,
      locale: props.locale || 'en',
      weekLabelFormat: props.weekLabelFormat!,
    }),
)

const businessHoursMods = computed(() =>
  weekdays.value.map((day) =>
    intervals.value.map((interval) =>
      getBusinessHoursMod({
        time: interval.startTime,
        businessHours: props.businessHours,
        highlightBusinessHours: props.highlightBusinessHours,
        dayOfWeek: dayjs(day).day() as DayOfWeek,
      }),
    ),
  ),
)

const slotSelect = useSlotDragSelect({
  enabled: () => Boolean(props.withDragSlotSelect) && !isStatic.value,
  onDragEnd: (start, end, group) => {
    const count = slotsPerDay.value
    const startDay = weekdays.value[Math.floor(start / count)]
    const endDay = weekdays.value[Math.floor(end / count)]
    const first = intervals.value[start % count]
    const last = intervals.value[end % count]

    if (first && last && startDay && endDay) {
      emit('slotDragEnd', {
        rangeStart: `${startDay} ${first.startTime}` as DateTimeStringValue,
        rangeEnd: `${endDay} ${last.endTime}` as DateTimeStringValue,
        resourceId: resourceIdMap.value.get(group),
      })
    }
  },
})

const resize = useHorizontalEventResize({
  enabled: () => Boolean(props.withEventResize),
  mode: () => props.mode!,
  startTime: () => props.startTime!,
  endTime: () => props.endTime!,
  intervalMinutes: () => props.intervalMinutes!,
  resizeIntervalMinutes: () => props.eventResizeInterval,
  onEventResize: (data) => emit('eventResize', data),
  canResizeEvent: () => props.canResizeEvent,
})

onMounted(async () => {
  if (!props.startScrollDateTime) {
    return
  }

  await nextTick()

  const target = dayjs(props.startScrollDateTime)
  const dayIndex = weekdays.value.findIndex((day) => dayjs(day).isSame(target, 'day'))

  if (dayIndex < 0) {
    return
  }

  const targetTime = target.format('HH:mm:ss')
  const intervalIndex = intervals.value.findIndex((interval) => interval.startTime >= targetTime)

  if (intervalIndex < 0) {
    return
  }

  const flatIndex = dayIndex * slotsPerDay.value + intervalIndex

  scrollSlotIntoView(controls[0]?.[flatIndex], 'x')
})

const setControl = (resourceIndex: number, flatIndex: number) => (element: unknown) => {
  const button = (element as { $el?: HTMLButtonElement } | null)?.$el ?? element
  controls[resourceIndex] ||= []
  controls[resourceIndex][flatIndex] = button instanceof HTMLButtonElement ? button : undefined
}

const setRowContainer = (resourceIndex: number) => (element: unknown) => {
  const node = (element as { $el?: HTMLElement } | null)?.$el ?? element

  if (node instanceof HTMLElement) {
    rowContainers.set(resourceIndex, node)
  }
}

const withDragHandlers = computed(
  () => Boolean(props.withEventsDragAndDrop) || Boolean(props.withExternalEventDrop),
)

const getFlatIndexAtPoint = (nativeEvent: DragEvent, resourceIndex: number) => {
  const container = rowContainers.get(resourceIndex)
  const count = slotsPerDay.value * dayCount.value

  if (!container || count === 0) {
    return -1
  }

  const rect = container.getBoundingClientRect()

  if (rect.width <= 0) {
    return -1
  }

  return Math.max(
    0,
    Math.min(count - 1, Math.floor(((nativeEvent.clientX - rect.left) / rect.width) * count)),
  )
}

const emitDrop = (nativeEvent: DragEvent, resourceId: string | number, flatIndex: number) => {
  nativeEvent.preventDefault()
  // Drop the pending frame first, so a stale highlight cannot land after the drop.
  resolveDropTarget.cancel()
  setDropTarget(null)
  const count = slotsPerDay.value
  const day = weekdays.value[Math.floor(flatIndex / count)]
  const interval = intervals.value[flatIndex % count]

  if (!day || !interval) {
    return
  }

  const target = getSnappedDropTarget(nativeEvent, day, flatIndex, interval.startTime)
  const event = getDropEvent(props.events, nativeEvent.dataTransfer)

  if (event) {
    emit('eventDrop', { ...moveEventTo(event, target), resourceId })
  } else if (nativeEvent.dataTransfer) {
    emit('externalEventDrop', {
      dataTransfer: nativeEvent.dataTransfer,
      dropDateTime: target,
      resourceId,
    })
  }
}

const getSnappedDropTarget = (
  nativeEvent: DragEvent,
  day: DateStringValue,
  flatIndex: number,
  slotStartTime: string,
) => {
  if (props.eventDragInterval == null) {
    return `${day} ${slotStartTime}` as DateTimeStringValue
  }

  const container =
    nativeEvent.currentTarget instanceof HTMLElement ? nativeEvent.currentTarget : null
  const rect = container?.getBoundingClientRect()
  const totalSlots = slotsPerDay.value * dayCount.value
  const slotSize = rect && rect.width > 0 ? rect.width / totalSlots : 0
  const slotOffset = rect ? nativeEvent.clientX - rect.left - flatIndex * slotSize : 0
  const parsed = parseTimeString(slotStartTime)
  const dragInterval = clampIntervalMinutes(props.eventDragInterval)
  const raw =
    parsed.hours * 60 +
    parsed.minutes +
    (slotSize > 0 ? slotOffset / slotSize : 0) * props.intervalMinutes!
  const start = parseTimeString(props.startTime!)
  const end = parseTimeString(props.endTime!)
  const min = Math.ceil((start.hours * 60 + start.minutes) / dragInterval) * dragInterval
  const max = Math.floor((end.hours * 60 + end.minutes - 1) / dragInterval) * dragInterval
  const minutes =
    min > max
      ? start.hours * 60 + start.minutes
      : Math.max(min, Math.min(max, Math.round(raw / dragInterval) * dragInterval))
  return `${day} ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:00` as DateTimeStringValue
}

const setDropTarget = (next: { resourceId: string | number; flatIndex: number } | null) => {
  const current = dropTarget.value

  if (current === next) {
    return
  }

  if (
    current &&
    next &&
    current.resourceId === next.resourceId &&
    current.flatIndex === next.flatIndex
  ) {
    return
  }

  dropTarget.value = next
}

/**
 * Coalesced to one animation frame: `dragover` fires several times per frame, and resolving the
 * target measures the row, so handling every event would read layout and re-render the grid
 * faster than the browser can paint.
 */
const resolveDropTarget = rafThrottle(
  (nativeEvent: DragEvent, resourceId: string | number, resourceIndex: number) => {
    const flatIndex = getFlatIndexAtPoint(nativeEvent, resourceIndex)
    setDropTarget(flatIndex < 0 ? null : { resourceId, flatIndex })
  },
)

const handleRowDragOver = (
  nativeEvent: DragEvent,
  resource: { id: string | number },
  resourceIndex: number,
) => {
  if (isStatic.value) {
    return
  }

  // `preventDefault` stays synchronous: the browser reads it as the handler returns.
  nativeEvent.preventDefault()
  resolveDropTarget(nativeEvent, resource.id, resourceIndex)
}

const handleRowDragLeave = (nativeEvent: DragEvent) => {
  const related = nativeEvent.relatedTarget
  const current = nativeEvent.currentTarget

  if (
    !(related instanceof Node) ||
    !(current instanceof HTMLElement) ||
    !current.contains(related)
  ) {
    resolveDropTarget.cancel()
    setDropTarget(null)
  }
}

const handleRowDrop = (
  nativeEvent: DragEvent,
  resource: { id: string | number },
  resourceIndex: number,
) => {
  const flatIndex = getFlatIndexAtPoint(nativeEvent, resourceIndex)

  if (flatIndex >= 0) {
    emitDrop(nativeEvent, resource.id, flatIndex)
  }
}

const groupInfo = (resourceIndex: number) =>
  hasGroups.value ? ordered.value.resourceGroupMap[resourceIndex] : undefined

const groupStarts = (info: ResourceGroupInfo) =>
  info.position === 'first' || info.position === 'only'

const groupCellStyle = (info: ResourceGroupInfo) =>
  info.count > 1
    ? {
        transform: `translateY(calc((${info.count - 1} * (var(--resources-week-view-row-height) + 1px)) / 2))`,
      }
    : undefined

const dayOffset = (dayIndex: number) => (dayIndex / dayCount.value) * 100
const dayWidth = computed(() => 100 / dayCount.value)

const backgroundEvents = (resourceId: string | number) =>
  weekdays.value.flatMap((day, dayIndex) => {
    const data = weekEvents.value.byDay[day]

    return [
      ...(data.backgroundTimedEvents[resourceId] || []),
      ...(data.backgroundAllDayEvents[resourceId] || []),
    ].map((event) => ({ event, day, dayIndex }))
  })

const backgroundEventStyle = (event: ScheduleEventData & { position: any }, dayIndex: number) => {
  const colors = theme.value.variantColorResolver({
    color: event.color || theme.value.primaryColor,
    theme: theme.value,
    variant: 'light',
    autoContrast: true,
  })
  return {
    left: `${dayOffset(dayIndex) + (event.position.top / 100) * dayWidth.value}%`,
    right: `${
      100 -
      dayOffset(dayIndex) -
      ((event.position.top + event.position.height) / 100) * dayWidth.value
    }%`,
    minWidth: '1px',
    top: 0,
    height: '100%',
    '--bg-event-bg': colors.background,
    '--bg-event-color': colors.color,
  }
}

const regularEvents = (resourceId: string | number) =>
  weekdays.value.flatMap((day, dayIndex) =>
    (weekEvents.value.byDay[day].regularEvents[resourceId] || [])
      .filter((event) => event.position.column < Math.max(1, props.maxEventsPerTimeSlot!))
      .map((event) => ({ event, day, dayIndex })),
  )

const eventWrapperStyle = (event: ScheduleEventData & { position: any }, dayIndex: number) => {
  const position = resize.getResizePosition(event.id)
  const relativeLeft = position?.left ?? event.position.top
  const relativeWidth = position?.width ?? event.position.height
  const colors = theme.value.variantColorResolver({
    color: event.color || theme.value.primaryColor,
    theme: theme.value,
    variant: event.variant || 'light',
    autoContrast: true,
  })

  return {
    '--event-color': colors.color,
    left: `calc(${dayOffset(dayIndex) + (relativeLeft / 100) * dayWidth.value}% + 1px)`,
    width: `calc(${(relativeWidth / 100) * dayWidth.value}% - 2px)`,
    top: `${event.position.offset}%`,
    height: `${event.position.width}%`,
  }
}

const moreClusters = (resourceId: string | number) =>
  weekdays.value.flatMap((day, dayIndex) =>
    getOverlapClusters(weekEvents.value.byDay[day].regularEvents[resourceId] || [])
      .filter((cluster) =>
        cluster.some((event) => event.position.column >= props.maxEventsPerTimeSlot!),
      )
      .map((cluster) => {
        const left = Math.min(...cluster.map((event) => event.position.top))
        const right = Math.max(
          ...cluster.map((event) => event.position.top + event.position.height),
        )

        return {
          cluster,
          day,
          hiddenCount: cluster.filter(
            (event) => event.position.column >= props.maxEventsPerTimeSlot!,
          ).length,
          style: {
            position: 'absolute' as const,
            left: `calc(${dayOffset(dayIndex) + (left / 100) * dayWidth.value}% + 1px)`,
            width: `calc(${((right - left) / 100) * dayWidth.value}% - 2px)`,
            bottom: 0,
            height: '22px',
            zIndex: 4,
          },
        }
      }),
  )

const allDayBars = (resourceId: string | number) => weekEvents.value.allDayBars[resourceId] || []

const allDayBarStyle = (bar: { startDayIndex: number; endDayIndex: number; row: number }) => ({
  left: `calc(${(bar.startDayIndex / dayCount.value) * 100}% + 1px)`,
  width: `calc(${((bar.endDayIndex - bar.startDayIndex + 1) / dayCount.value) * 100}% - 2px)`,
  top: `calc(${bar.row} * (var(--resources-week-view-all-day-height) + 2px) + 2px)`,
})

const rowMinHeight = (resourceId: string | number) => {
  const bars = allDayBars(resourceId)
  const rows = bars.length ? Math.max(...bars.map((bar) => bar.row)) + 1 : 0

  return rows
    ? {
        minHeight: `max(var(--resources-week-view-row-height), calc(${rows} * (var(--resources-week-view-all-day-height) + 2px) + 4px))`,
      }
    : undefined
}

const cornerStyle = computed(() =>
  hasGroups.value
    ? {
        flexBasis:
          'calc(var(--resources-week-view-resource-label-width) + var(--resources-week-view-group-label-width))',
        minWidth:
          'calc(var(--resources-week-view-resource-label-width) + var(--resources-week-view-group-label-width))',
      }
    : undefined,
)

const dayLabelStyle = computed(() => ({
  flex: `0 0 calc(var(--resources-week-view-slot-width) * ${slotsPerDay.value})`,
}))

const indicatorStyle = computed(() => ({
  '--indicator-left-offset': hasGroups.value
    ? `calc(var(--resources-week-view-resource-label-width) + var(--resources-week-view-group-label-width) + (100% - var(--resources-week-view-resource-label-width) - var(--resources-week-view-group-label-width)) * ${indicatorOffset.value} / 100)`
    : `calc(var(--resources-week-view-resource-label-width) + (100% - var(--resources-week-view-resource-label-width)) * ${indicatorOffset.value} / 100)`,
  '--_time-bubble-width': String(currentTime.value).toLowerCase().includes('m') ? '64px' : '46px',
}))

const isDraggableEvent = (event: ScheduleEventData) =>
  Boolean(props.withEventsDragAndDrop) && !isStatic.value && (props.canDragEvent?.(event) ?? true)

/** A click that ends a resize gesture must not be reported as an event click. */
const clickEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) => {
  if (!resize.wasResizing()) {
    emit('eventClick', event, nativeEvent)
  }
}

const startResize = (
  event: ScheduleEventData & { position: any },
  day: DateStringValue,
  dayIndex: number,
  resourceIndex: number,
  edge: 'start' | 'end',
  pointerEvent: PointerEvent,
) => {
  const container = rowContainers.get(resourceIndex)

  if (!container) {
    return
  }

  resize.handleResizeStart({
    event,
    edge,
    container,
    originalLeft: event.position.top,
    originalWidth: event.position.height,
    eventDate: day,
    dayIndex,
    dayCount: dayCount.value,
    pointerEvent,
  })
}

const dragState = provideScheduleDragState({
  dragOverTarget: () => {
    const target = dropTarget.value

    if (!target) {
      return null
    }

    const count = slotsPerDay.value
    const day = weekdays.value[Math.floor(target.flatIndex / count)]

    return day
      ? {
          date: day,
          slotIndex: target.flatIndex % count,
          time: intervals.value[target.flatIndex % count]?.startTime,
        }
      : null
  },
  isSlotDragging: () => slotSelect.isDragging(),
  onDragEnd: () => {
    resolveDropTarget.cancel()
    setDropTarget(null)
    emit('eventDragEnd')
  },
})

const dragStart = (event: ScheduleEventData) => {
  dragState.startEventDrag(event)
  emit('eventDragStart', event)
}

const dragEnd = () => dragState.endEventDrag()

const changeDate = (value: DateStringValue) => emit('dateChange', value)
const changeView = (view: ScheduleViewLevel) => emit('viewChange', view)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('resourcesWeekView') }"
    :root-ref="setRootElement"
    :data-resizing="resize.state.value ? true : undefined"
    :data-event-interaction="resize.state.value ? true : undefined"
  >
    <template v-if="props.withHeader">
      <slot name="header" :week-start="weekStart" :week-end="weekEnd" :label="headerLabel">
        <ScheduleHeaderBase
          view="week"
          :navigation-handlers="createHeaderNavigation(props.date, 'week')"
          :control="{ title: headerLabel }"
          :labels="props.labels"
          :previous-control-props="props.previousControlProps"
          :next-control-props="props.nextControlProps"
          :today-control-props="props.todayControlProps"
          :view-select-props="{ views: RESOURCE_VIEWS, ...props.viewSelectProps }"
          v-bind="stylesApi"
          @date-change="changeDate"
          @view-change="changeView"
        />
      </slot>
    </template>

    <Box v-bind="getStyles('resourcesWeekViewRoot')">
      <ScrollArea
        :scrollbar-size="4"
        v-bind="{ ...props.scrollAreaProps, ...getStyles('resourcesWeekViewScrollArea') }"
        :viewport-props="{ ...scheduleViewportProps, ...props.scrollAreaProps?.viewportProps }"
        @scroll-position-change="(position) => (scrolledX = position.x !== 0)"
      >
        <div v-bind="getStyles('resourcesWeekViewInner')">
          <Box v-bind="getStyles('resourcesWeekViewHeaderRows')">
            <div v-bind="getStyles('resourcesWeekViewCorner', { style: cornerStyle })">
              <slot name="corner" :resources="ordered.orderedResources">
                {{ getLabel('resources', props.labels) }}
              </slot>
            </div>

            <div v-bind="getStyles('resourcesWeekViewHeaderContent')">
              <div v-bind="getStyles('resourcesWeekViewDayLabelsRow')">
                <Box
                  v-for="day in weekdays"
                  :key="day"
                  v-bind="getStyles('resourcesWeekViewDayLabel', { style: dayLabelStyle })"
                  :data-weekend="
                    props.weekendDays!.includes(dayjs(day).day() as DayOfWeek) || undefined
                  "
                  :data-today="(props.highlightToday && dayjs(day).isSame(now, 'day')) || undefined"
                >
                  <slot
                    name="dayLabel"
                    :date="day"
                    :label="
                      formatDate({
                        date: day,
                        locale: props.locale || 'en',
                        format: props.weekdayFormat!,
                      })
                    "
                  >
                    {{
                      formatDate({
                        date: day,
                        locale: props.locale || 'en',
                        format: props.weekdayFormat!,
                      })
                    }}
                  </slot>
                </Box>
              </div>

              <div v-bind="getStyles('resourcesWeekViewTimeLabelsRow')">
                <template v-for="(day, dayIndex) in weekdays" :key="day">
                  <Box
                    v-for="(interval, slotIndex) in intervals"
                    :key="`${day}-${interval.startTime}`"
                    v-bind="staticStyles('resourcesWeekViewTimeLabel')"
                    :data-business-hours="
                      businessHoursMods[dayIndex][slotIndex]['business-hours'] || undefined
                    "
                    :data-non-business-hours="
                      businessHoursMods[dayIndex][slotIndex]['non-business-hours'] || undefined
                    "
                  >
                    <slot
                      name="timeLabel"
                      :date="day"
                      :label="
                        formatDate({
                          date: `${day} ${interval.startTime}`,
                          locale: props.locale || 'en',
                          format: props.slotLabelFormat!,
                        })
                      "
                      :start-time="interval.startTime"
                      :end-time="interval.endTime"
                    >
                      {{
                        formatDate({
                          date: `${day} ${interval.startTime}`,
                          locale: props.locale || 'en',
                          format: props.slotLabelFormat!,
                        })
                      }}
                    </slot>
                  </Box>
                </template>
              </div>
            </div>
          </Box>

          <Box
            v-for="(resource, resourceIndex) in ordered.orderedResources"
            :key="resource.id"
            v-bind="staticStyles('resourcesWeekViewRow')"
          >
            <template v-if="groupInfo(resourceIndex) !== undefined">
              <Box
                v-if="groupInfo(resourceIndex) === null"
                v-bind="staticStyles('resourcesWeekViewGroupColumnEmpty')"
              />
              <Box
                v-else
                v-bind="staticStyles('resourcesWeekViewGroupColumn')"
                :data-group-position="groupInfo(resourceIndex)!.position"
              >
                <span
                  v-if="groupStarts(groupInfo(resourceIndex)!)"
                  :style="groupCellStyle(groupInfo(resourceIndex)!)"
                >
                  <slot name="groupLabel" :group="groupInfo(resourceIndex)!.group">
                    <component
                      :is="() => props.renderGroupLabel!(groupInfo(resourceIndex)!.group)"
                      v-if="props.renderGroupLabel"
                    />
                    <template v-else>{{ groupInfo(resourceIndex)!.group.label }}</template>
                  </slot>
                </span>
              </Box>
            </template>

            <Box
              v-bind="staticStyles('resourcesWeekViewResourceLabel')"
              :data-scrolled-x="scrolledX || undefined"
              :data-has-groups="groupInfo(resourceIndex) !== undefined || undefined"
            >
              <slot name="resourceLabel" :resource="resource">
                <component
                  :is="() => props.renderResourceLabel!(resource)"
                  v-if="props.renderResourceLabel"
                />
                <template v-else>{{ resource.label }}</template>
              </slot>
            </Box>

            <Box
              :ref="setRowContainer(resourceIndex)"
              v-bind="getStyles('resourcesWeekViewRowSlots', { style: rowMinHeight(resource.id) })"
              @dragover="
                withDragHandlers ? handleRowDragOver($event, resource, resourceIndex) : undefined
              "
              @dragleave="withDragHandlers ? handleRowDragLeave($event) : undefined"
              @drop="withDragHandlers ? handleRowDrop($event, resource, resourceIndex) : undefined"
            >
              <template
                v-for="entry in backgroundEvents(resource.id)"
                :key="`bg-${entry.day}-${entry.event.id}`"
              >
                <slot name="backgroundEvent" :event="entry.event" :date="entry.day">
                  <ScheduleBackgroundEvent
                    :event="entry.event"
                    :interactive="Boolean(props.withInteractiveBackgroundEvents) && !isStatic"
                    v-bind="{
                      ...eventRenderers,
                      ...getStyles('resourcesWeekViewBackgroundEvent'),
                    }"
                    :style="backgroundEventStyle(entry.event, entry.dayIndex)"
                    @event-click="clickEvent"
                  />
                </slot>
              </template>

              <template v-for="bar in allDayBars(resource.id)" :key="`all-${bar.event.id}`">
                <Box
                  v-bind="getStyles('resourcesWeekViewAllDayEvent', { style: allDayBarStyle(bar) })"
                >
                  <slot
                    name="allDayEvent"
                    :event="bar.event"
                    :start-day-index="bar.startDayIndex"
                    :end-day-index="bar.endDayIndex"
                  >
                    <ScheduleEvent
                      :event="bar.event"
                      auto-size
                      nowrap
                      :radius="props.radius"
                      :mode="props.mode"
                      :style="{ width: '100%', height: '100%' }"
                      v-bind="{ ...eventRenderers, ...stylesApi }"
                      @click="
                        isStatic ? undefined : emit('eventClick', bar.event, $event as MouseEvent)
                      "
                    />
                  </slot>
                </Box>
              </template>

              <Box
                v-for="entry in regularEvents(resource.id)"
                :key="`${entry.day}-${entry.event.id}`"
                v-bind="
                  getStyles('resourcesWeekViewEventWrapper', {
                    style: eventWrapperStyle(entry.event, entry.dayIndex),
                  })
                "
                :data-resizing="resize.getResizePosition(entry.event.id) !== null || undefined"
              >
                <ScheduleEvent
                  :event="entry.event"
                  auto-size
                  nowrap
                  :radius="props.radius"
                  :mode="props.mode"
                  :draggable="isDraggableEvent(entry.event)"
                  :style="{ width: '100%', height: '100%' }"
                  v-bind="{ ...eventRenderers, ...stylesApi }"
                  @event-drag-start="dragStart"
                  @event-drag-end="dragEnd"
                  @click="isStatic ? undefined : clickEvent(entry.event, $event as MouseEvent)"
                />

                <template v-if="resize.isResizableEvent(entry.event)">
                  <div
                    v-for="edge in ['start', 'end'] as const"
                    :key="edge"
                    v-bind="staticStyles('resourcesWeekViewResizeHandle')"
                    :data-edge="edge"
                    :data-active="resize.state.value?.edge === edge || undefined"
                    :aria-label="`${
                      edge === 'start' ? 'Resize event start' : 'Resize event end'
                    } ${entry.event.title}`"
                    @dragstart.prevent
                    @pointerdown="
                      startResize(
                        entry.event,
                        entry.day,
                        entry.dayIndex,
                        resourceIndex,
                        edge,
                        $event,
                      )
                    "
                  />
                </template>
              </Box>

              <template
                v-for="entry in moreClusters(resource.id)"
                :key="`more-${entry.day}-${entry.cluster[0].id}`"
              >
                <slot
                  name="moreEvents"
                  :events="entry.cluster"
                  :hidden-count="entry.hiddenCount"
                  :date="entry.day"
                >
                  <MoreEvents
                    :events="entry.cluster"
                    :more-events-count="entry.hiddenCount"
                    :mode="props.mode"
                    :labels="props.labels"
                    :style="entry.style"
                    v-bind="{ ...eventRenderers, ...stylesApi, ...props.moreEventsProps }"
                    @event-click="(event, nativeEvent) => emit('eventClick', event, nativeEvent)"
                  />
                </slot>
              </template>

              <template v-for="(day, dayIndex) in weekdays" :key="`slots-${day}`">
                <UnstyledButton
                  v-for="(interval, slotIndex) in intervals"
                  :key="`${day}-${interval.startTime}`"
                  :ref="setControl(resourceIndex, dayIndex * slotsPerDay + slotIndex)"
                  v-bind="staticStyles('resourcesWeekViewRowSlot')"
                  :data-business-hours="
                    businessHoursMods[dayIndex][slotIndex]['business-hours'] || undefined
                  "
                  :data-non-business-hours="
                    businessHoursMods[dayIndex][slotIndex]['non-business-hours'] || undefined
                  "
                  :data-drop-target="
                    (dropTarget?.resourceId === resource.id &&
                      dropTarget.flatIndex === dayIndex * slotsPerDay + slotIndex) ||
                    undefined
                  "
                  :data-drag-selected="
                    slotSelect.isSlotSelected(
                      dayIndex * slotsPerDay + slotIndex,
                      String(resource.id),
                    ) || undefined
                  "
                  :data-static="isStatic || undefined"
                  :data-drag-slot-index="
                    props.withDragSlotSelect ? dayIndex * slotsPerDay + slotIndex : undefined
                  "
                  :data-drag-slot-group="props.withDragSlotSelect ? String(resource.id) : undefined"
                  :aria-label="`${getLabel('resourceSlot', props.labels)} ${String(resource.label)} ${day} ${interval.startTime} - ${interval.endTime}`"
                  :tabindex="
                    isStatic
                      ? -1
                      : resourceIndex === 0 && dayIndex === 0 && slotIndex === 0
                        ? 0
                        : -1
                  "
                  @keydown="
                    handleResourcesGridKeyDown({
                      controls,
                      resourceIndex,
                      slotIndex: dayIndex * slotsPerDay + slotIndex,
                      event: $event,
                    })
                  "
                  @pointerdown="
                    isStatic
                      ? undefined
                      : slotSelect.handleSlotPointerDown(
                          $event,
                          dayIndex * slotsPerDay + slotIndex,
                          String(resource.id),
                        )
                  "
                  @click="
                    isStatic
                      ? undefined
                      : emit('timeSlotClick', {
                          slotStart: `${day} ${interval.startTime}` as DateTimeStringValue,
                          slotEnd: `${day} ${interval.endTime}` as DateTimeStringValue,
                          nativeEvent: $event,
                          resourceId: resource.id,
                        })
                  "
                >
                  <slot
                    name="timeSlot"
                    :resource="resource"
                    :date="day"
                    :start-time="interval.startTime"
                    :end-time="interval.endTime"
                  />
                </UnstyledButton>
              </template>
            </Box>
          </Box>

          <template v-if="showIndicator">
            <slot
              name="currentTimeIndicator"
              :time="currentTime"
              :offset="indicatorOffset"
              :date="weekdays[todayIndex]"
            >
              <Box
                v-bind="
                  getStyles('resourcesWeekViewCurrentTimeIndicator', { style: indicatorStyle })
                "
              >
                <div
                  v-if="props.withCurrentTimeBubble"
                  v-bind="getStyles('resourcesWeekViewCurrentTimeIndicatorTimeBubble')"
                >
                  {{ currentTime }}
                </div>
                <div v-else v-bind="getStyles('resourcesWeekViewCurrentTimeIndicatorThumb')" />
                <div v-bind="getStyles('resourcesWeekViewCurrentTimeIndicatorLine')" />
              </Box>
            </slot>
          </template>
        </div>
      </ScrollArea>
    </Box>
  </Box>
</template>
