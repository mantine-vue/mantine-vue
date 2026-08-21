<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { cssSize, resolveScheduleRadius } from '../shared'
import type { ResourcesDayViewOwnProps } from './ResourcesDayView.types'

const defaultProps = {
  startTime: '00:00:00',
  endTime: '23:59:59',
  intervalMinutes: 60,
  slotLabelFormat: 'HH:mm',
  withCurrentTimeBubble: true,
  withHeader: true,
  headerFormat: 'MMMM D, YYYY',
  slotWidth: 80,
  rowHeight: 64,
  groupLabelWidth: 80,
  businessHours: ['09:00:00', '17:00:00'],
  mode: 'default',
  recurrenceExpansionLimit: 2000,
  maxEventsPerTimeSlot: 2,
} satisfies Partial<ResourcesDayViewOwnProps>

/** View levels the header offers – a resource schedule has no year view. */
const RESOURCE_VIEWS = ['day', 'week', 'month'] as const

const varsResolver = createVarsResolver<any>(
  (_theme, { radius, slotWidth, rowHeight, groupLabelWidth }) => ({
    resourcesDayView: {
      '--resources-day-view-radius': resolveScheduleRadius(radius),
      '--resources-day-view-slot-width': cssSize(slotWidth),
      '--resources-day-view-row-height': cssSize(rowHeight),
      '--resources-day-view-group-label-width': cssSize(groupLabelWidth),
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
  expandRecurringEvents,
  formatDate,
  getBusinessHoursMod,
  getCurrentTimePosition,
  getDayTimeIntervals,
  getGroupToResourceIdMap,
  getOrderedResources,
  handleResourcesGridKeyDown,
  isInTimeRange,
  type ResourceGroupInfo,
  type ResourcesGridControls,
} from '../../utils'
import { provideScheduleDragState } from '../DragContext'
import { MoreEvents } from '../MoreEvents'
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
import { getOverlapClusters } from './get-overlap-clusters/get-overlap-clusters'
import { getResourcesDayViewEvents } from './get-resources-day-view-events/get-resources-day-view-events'
import type { ResourcesDayViewEmits, ResourcesDayViewSlots } from './ResourcesDayView.types'
import classes from './ResourcesDayView.module.css'

defineOptions({
  name: 'ResourcesDayView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ResourcesDayViewOwnProps>(), {
  groups: undefined,
  startTime: undefined,
  endTime: undefined,
  intervalMinutes: undefined,
  slotLabelFormat: undefined,
  radius: undefined,
  startScrollTime: undefined,
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
  headerFormat: undefined,
  events: undefined,
  slotWidth: undefined,
  rowHeight: undefined,
  groupLabelWidth: undefined,
  labels: undefined,
  businessHours: undefined,
  renderEventBody: undefined,
  renderEvent: undefined,
  renderResourceLabel: undefined,
  renderGroupLabel: undefined,
  canDragEvent: undefined,
  mode: undefined,
  canResizeEvent: undefined,
  recurrenceExpansionLimit: undefined,
  maxEventsPerTimeSlot: undefined,
  moreEventsProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ResourcesDayViewSlots>()

const emit = defineEmits<ResourcesDayViewEmits>()

const slots = useSlots()
const attrs = useAttrs()
const theme = useSafeMantineTheme()

const props = useProps('ResourcesDayView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'ResourcesDayView',
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
  rootSelector: 'resourcesDayView',
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

const dropTarget = shallowRef<{ resourceId: string | number; slotIndex: number } | null>(null)
const scrolled = ref(false)
const scrolledX = ref(false)

const isStatic = computed(() => props.mode === 'static')

const date = computed(() => dayjs(props.date).format('YYYY-MM-DD') as DateStringValue)
const now = computed(() => dayjs(props.getCurrentTime?.() ?? new Date()))
const dayOfWeek = computed(() => dayjs(props.date).day() as DayOfWeek)

const intervals = computed(() =>
  getDayTimeIntervals({
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
  }),
)

const ordered = computed(() => getOrderedResources(props.resources, props.groups))
const resourceIdMap = computed(() => getGroupToResourceIdMap(props.resources))
const hasGroups = computed(() => ordered.value.groupRanges.length > 0)

const expandedEvents = computed(() =>
  expandRecurringEvents({
    events: props.events,
    rangeStart: dayjs(props.date).startOf('day').toDate(),
    rangeEnd: dayjs(props.date).endOf('day').toDate(),
    expansionLimit: props.recurrenceExpansionLimit!,
  }),
)

const positioned = computed(() =>
  getResourcesDayViewEvents({
    date: props.date,
    events: expandedEvents.value,
    resources: props.resources,
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
  }),
)

const businessHoursMods = computed(() =>
  intervals.value.map((interval) =>
    getBusinessHoursMod({
      time: interval.startTime,
      businessHours: props.businessHours,
      highlightBusinessHours: props.highlightBusinessHours,
      dayOfWeek: dayOfWeek.value,
    }),
  ),
)

const showIndicator = computed(
  () =>
    (props.withCurrentTimeIndicator ?? dayjs(props.date).isSame(now.value, 'day')) &&
    isInTimeRange({
      date: now.value.toDate(),
      startTime: props.startTime!,
      endTime: props.endTime!,
    }),
)

const indicatorOffset = computed(() =>
  getCurrentTimePosition({
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
    now: now.value,
  }),
)

const currentTime = computed(() =>
  formatDate({ date: now.value, locale: props.locale || 'en', format: props.slotLabelFormat! }),
)

const headerLabel = computed(() =>
  formatDate({ date: props.date, locale: props.locale || 'en', format: props.headerFormat! }),
)

const slotSelect = useSlotDragSelect({
  enabled: () => Boolean(props.withDragSlotSelect) && !isStatic.value,
  onDragEnd: (start, end, group) => {
    const first = intervals.value[start]
    const last = intervals.value[end]

    if (first && last) {
      emit('slotDragEnd', {
        rangeStart: `${date.value} ${first.startTime}` as DateTimeStringValue,
        rangeEnd: `${date.value} ${last.endTime}` as DateTimeStringValue,
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
  onEventResize: (data) => emit('eventResize', data),
  canResizeEvent: () => props.canResizeEvent,
})

onMounted(async () => {
  if (!props.startScrollTime) {
    return
  }

  await nextTick()

  const targetIndex = intervals.value.findIndex(
    (interval) => interval.startTime >= props.startScrollTime!,
  )

  if (targetIndex < 0) {
    return
  }

  scrollSlotIntoView(controls[0]?.[targetIndex], 'x')
})

const setControl = (resourceIndex: number, slotIndex: number) => (element: unknown) => {
  const button = (element as { $el?: HTMLButtonElement } | null)?.$el ?? element
  controls[resourceIndex] ||= []
  controls[resourceIndex][slotIndex] = button instanceof HTMLButtonElement ? button : undefined
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

const getSlotIndexAtPoint = (nativeEvent: DragEvent, resourceIndex: number) => {
  const container = rowContainers.get(resourceIndex)

  if (!container || intervals.value.length === 0) {
    return -1
  }

  const rect = container.getBoundingClientRect()

  if (rect.width <= 0) {
    return -1
  }

  return Math.max(
    0,
    Math.min(
      intervals.value.length - 1,
      Math.floor(((nativeEvent.clientX - rect.left) / rect.width) * intervals.value.length),
    ),
  )
}

const emitDrop = (nativeEvent: DragEvent, resourceId: string | number, slotIndex: number) => {
  nativeEvent.preventDefault()
  // Drop the pending frame first, so a stale highlight cannot land after the drop.
  resolveDropTarget.cancel()
  setDropTarget(null)
  const interval = intervals.value[slotIndex]

  if (!interval) {
    return
  }

  const target = `${date.value} ${interval.startTime}` as DateTimeStringValue
  const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

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

const setDropTarget = (next: { resourceId: string | number; slotIndex: number } | null) => {
  const current = dropTarget.value

  if (current === next) {
    return
  }

  if (
    current &&
    next &&
    current.resourceId === next.resourceId &&
    current.slotIndex === next.slotIndex
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
    const slotIndex = getSlotIndexAtPoint(nativeEvent, resourceIndex)
    setDropTarget(slotIndex < 0 ? null : { resourceId, slotIndex })
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
  const slotIndex = getSlotIndexAtPoint(nativeEvent, resourceIndex)

  if (slotIndex >= 0) {
    emitDrop(nativeEvent, resource.id, slotIndex)
  }
}

const groupCellStyle = (info: ResourceGroupInfo) =>
  info.count > 1
    ? {
        transform: `translateY(calc((${info.count - 1} * (var(--resources-day-view-row-height) + 1px)) / 2))`,
      }
    : undefined

const groupStarts = (info: ResourceGroupInfo) =>
  info.position === 'first' || info.position === 'only'

const groupInfo = (resourceIndex: number) =>
  hasGroups.value ? ordered.value.resourceGroupMap[resourceIndex] : undefined

const backgroundEvents = (resourceId: string | number) => [
  ...(positioned.value.backgroundTimedEvents[resourceId] || []),
  ...(positioned.value.backgroundAllDayEvents[resourceId] || []),
]

const backgroundEventStyle = (event: ScheduleEventData & { position: any }) => {
  const colors = theme.value.variantColorResolver({
    color: event.color || theme.value.primaryColor,
    theme: theme.value,
    variant: 'light',
    autoContrast: true,
  })

  return {
    left: `${event.position.top}%`,
    right: `${100 - event.position.top - event.position.height}%`,
    minWidth: '1px',
    top: 0,
    height: '100%',
    '--bg-event-bg': colors.background,
    '--bg-event-color': colors.color,
  }
}

const allDayEvents = (resourceId: string | number) =>
  positioned.value.allDayEvents[resourceId] || []

const allDayEventStyle = (index: number) => ({
  top: `calc(${index} * (var(--resources-day-view-all-day-height) + 2px) + 2px)`,
})

const allRegularEvents = (resourceId: string | number) =>
  positioned.value.regularEvents[resourceId] || []

const visibleRegularEvents = (resourceId: string | number) =>
  allRegularEvents(resourceId).filter(
    (event) => event.position.column < Math.max(1, props.maxEventsPerTimeSlot!),
  )

const eventWrapperStyle = (event: ScheduleEventData & { position: any }) => {
  const position = resize.getResizePosition(event.id)
  const left = position?.left ?? event.position.top
  const width = position?.width ?? event.position.height
  const colors = theme.value.variantColorResolver({
    color: event.color || theme.value.primaryColor,
    theme: theme.value,
    variant: event.variant || 'light',
    autoContrast: true,
  })

  return {
    left: `calc(${left}% + 1px)`,
    width: `calc(${width}% - 2px)`,
    top: `${event.position.offset}%`,
    height: `${event.position.width}%`,
    '--event-color': colors.color,
  }
}

const moreClusters = (resourceId: string | number) =>
  getOverlapClusters(allRegularEvents(resourceId))
    .filter((cluster) =>
      cluster.some((event) => event.position.column >= props.maxEventsPerTimeSlot!),
    )
    .map((cluster) => {
      const left = Math.min(...cluster.map((event) => event.position.top))
      const right = Math.max(...cluster.map((event) => event.position.top + event.position.height))

      return {
        cluster,
        hiddenCount: cluster.filter((event) => event.position.column >= props.maxEventsPerTimeSlot!)
          .length,
        style: {
          position: 'absolute' as const,
          left: `calc(${left}% + 1px)`,
          width: `calc(${right - left}% - 2px)`,
          bottom: 0,
          height: '22px',
          zIndex: 4,
        },
      }
    })

const cornerStyle = computed(() =>
  hasGroups.value
    ? {
        flexBasis:
          'calc(var(--resources-day-view-resource-label-width) + var(--resources-day-view-group-label-width))',
        minWidth:
          'calc(var(--resources-day-view-resource-label-width) + var(--resources-day-view-group-label-width))',
      }
    : undefined,
)

const indicatorStyle = computed(() => ({
  '--indicator-left-offset': hasGroups.value
    ? `calc(var(--resources-day-view-resource-label-width) + var(--resources-day-view-group-label-width) + (100% - var(--resources-day-view-resource-label-width) - var(--resources-day-view-group-label-width)) * ${indicatorOffset.value} / 100)`
    : `calc(var(--resources-day-view-resource-label-width) + (100% - var(--resources-day-view-resource-label-width)) * ${indicatorOffset.value} / 100)`,
  '--_time-bubble-width': String(currentTime.value).toLowerCase().includes('m') ? '64px' : '46px',
}))

const rowMinHeight = (resourceId: string | number) => {
  const count = allDayEvents(resourceId).length

  return count
    ? {
        minHeight: `max(var(--resources-day-view-row-height), calc(${count} * (var(--resources-day-view-all-day-height) + 2px) + 4px))`,
      }
    : undefined
}

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
    eventDate: date.value,
    pointerEvent,
  })
}

const dragState = provideScheduleDragState({
  dragOverTarget: () => {
    const target = dropTarget.value
    return target
      ? {
          date: date.value,
          slotIndex: target.slotIndex,
          time: intervals.value[target.slotIndex]?.startTime,
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
    v-bind="{ ...attrs, ...getStyles('resourcesDayView') }"
    :root-ref="setRootElement"
    :data-resizing="resize.state.value ? true : undefined"
    :data-event-interaction="resize.state.value ? true : undefined"
  >
    <template v-if="props.withHeader">
      <slot name="header" :date="date" :label="headerLabel">
        <ScheduleHeaderBase
          view="day"
          :navigation-handlers="createHeaderNavigation(props.date, 'day')"
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

    <Box v-bind="getStyles('resourcesDayViewRoot')">
      <ScrollArea
        :scrollbar-size="4"
        v-bind="{ ...props.scrollAreaProps, ...getStyles('resourcesDayViewScrollArea') }"
        :viewport-props="{ ...scheduleViewportProps, ...props.scrollAreaProps?.viewportProps }"
        @scroll-position-change="
          (position) => {
            scrolled = position.y !== 0
            scrolledX = position.x !== 0
          }
        "
      >
        <div v-bind="getStyles('resourcesDayViewInner')">
          <Box
            v-bind="getStyles('resourcesDayViewTimeLabelsRow')"
            :data-scrolled="scrolled || undefined"
          >
            <div v-bind="getStyles('resourcesDayViewCorner', { style: cornerStyle })">
              <slot name="corner" :resources="ordered.orderedResources">
                {{ getLabel('resources', props.labels) }}
              </slot>
            </div>

            <Box
              v-for="(interval, slotIndex) in intervals"
              :key="interval.startTime"
              v-bind="staticStyles('resourcesDayViewTimeLabel')"
              :data-business-hours="businessHoursMods[slotIndex]['business-hours'] || undefined"
              :data-non-business-hours="
                businessHoursMods[slotIndex]['non-business-hours'] || undefined
              "
            >
              <slot
                name="timeLabel"
                :label="
                  formatDate({
                    date: `${date} ${interval.startTime}`,
                    locale: props.locale || 'en',
                    format: props.slotLabelFormat!,
                  })
                "
                :start-time="interval.startTime"
                :end-time="interval.endTime"
              >
                {{
                  formatDate({
                    date: `${date} ${interval.startTime}`,
                    locale: props.locale || 'en',
                    format: props.slotLabelFormat!,
                  })
                }}
              </slot>
            </Box>
          </Box>

          <Box
            v-for="(resource, resourceIndex) in ordered.orderedResources"
            :key="resource.id"
            v-bind="staticStyles('resourcesDayViewRow')"
          >
            <template v-if="groupInfo(resourceIndex) !== undefined">
              <Box
                v-if="groupInfo(resourceIndex) === null"
                v-bind="staticStyles('resourcesDayViewGroupColumnEmpty')"
              />
              <Box
                v-else
                v-bind="staticStyles('resourcesDayViewGroupColumn')"
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
              v-bind="staticStyles('resourcesDayViewResourceLabel')"
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
              v-bind="getStyles('resourcesDayViewRowSlots', { style: rowMinHeight(resource.id) })"
              @dragover="
                withDragHandlers ? handleRowDragOver($event, resource, resourceIndex) : undefined
              "
              @dragleave="withDragHandlers ? handleRowDragLeave($event) : undefined"
              @drop="withDragHandlers ? handleRowDrop($event, resource, resourceIndex) : undefined"
            >
              <template v-for="event in backgroundEvents(resource.id)" :key="`bg-${event.id}`">
                <slot name="backgroundEvent" :event="event">
                  <Box
                    v-bind="
                      getStyles('resourcesDayViewBackgroundEvent', {
                        style: backgroundEventStyle(event),
                      })
                    "
                  >
                    <component
                      :is="() => eventRenderers.renderEventBody!(event)"
                      v-if="eventRenderers.renderEventBody"
                    />
                    <template v-else>{{ event.title }}</template>
                  </Box>
                </slot>
              </template>

              <template
                v-for="(event, index) in allDayEvents(resource.id)"
                :key="`all-${event.id}`"
              >
                <Box
                  v-bind="
                    getStyles('resourcesDayViewAllDayEvent', { style: allDayEventStyle(index) })
                  "
                >
                  <slot name="allDayEvent" :event="event">
                    <ScheduleEvent
                      :event="event"
                      auto-size
                      nowrap
                      :radius="props.radius"
                      :mode="props.mode"
                      :style="{ width: '100%', height: '100%' }"
                      v-bind="{ ...eventRenderers, ...stylesApi }"
                      @click="
                        isStatic ? undefined : emit('eventClick', event, $event as MouseEvent)
                      "
                    />
                  </slot>
                </Box>
              </template>

              <Box
                v-for="event in visibleRegularEvents(resource.id)"
                :key="event.id"
                v-bind="
                  getStyles('resourcesDayViewEventWrapper', { style: eventWrapperStyle(event) })
                "
                :data-resizing="resize.getResizePosition(event.id) !== null || undefined"
              >
                <ScheduleEvent
                  :event="event"
                  auto-size
                  nowrap
                  :radius="props.radius"
                  :mode="props.mode"
                  :draggable="isDraggableEvent(event)"
                  :style="{ width: '100%', height: '100%' }"
                  v-bind="{ ...eventRenderers, ...stylesApi }"
                  @event-drag-start="dragStart"
                  @event-drag-end="dragEnd"
                  @click="isStatic ? undefined : clickEvent(event, $event as MouseEvent)"
                />

                <template v-if="resize.isResizableEvent(event)">
                  <div
                    v-for="edge in ['start', 'end'] as const"
                    :key="edge"
                    v-bind="staticStyles('resourcesDayViewResizeHandle')"
                    :data-edge="edge"
                    :data-active="resize.state.value?.edge === edge || undefined"
                    :aria-label="`${
                      edge === 'start' ? 'Resize event start' : 'Resize event end'
                    } ${event.title}`"
                    @dragstart.prevent
                    @pointerdown="startResize(event, resourceIndex, edge, $event)"
                  />
                </template>
              </Box>

              <template
                v-for="entry in moreClusters(resource.id)"
                :key="`more-${entry.cluster[0].id}`"
              >
                <slot name="moreEvents" :events="entry.cluster" :hidden-count="entry.hiddenCount">
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

              <UnstyledButton
                v-for="(interval, slotIndex) in intervals"
                :key="interval.startTime"
                :ref="setControl(resourceIndex, slotIndex)"
                v-bind="staticStyles('resourcesDayViewRowSlot')"
                :data-business-hours="businessHoursMods[slotIndex]['business-hours'] || undefined"
                :data-non-business-hours="
                  businessHoursMods[slotIndex]['non-business-hours'] || undefined
                "
                :data-drop-target="
                  (dropTarget?.resourceId === resource.id && dropTarget.slotIndex === slotIndex) ||
                  undefined
                "
                :data-drag-selected="
                  slotSelect.isSlotSelected(slotIndex, String(resource.id)) || undefined
                "
                :data-static="isStatic || undefined"
                :data-drag-slot-index="props.withDragSlotSelect ? slotIndex : undefined"
                :data-drag-slot-group="props.withDragSlotSelect ? String(resource.id) : undefined"
                :aria-label="`${getLabel('resourceSlot', props.labels)} ${String(resource.label)} ${date} ${interval.startTime} - ${interval.endTime}`"
                :tabindex="isStatic ? -1 : resourceIndex === 0 && slotIndex === 0 ? 0 : -1"
                @keydown="
                  handleResourcesGridKeyDown({ controls, resourceIndex, slotIndex, event: $event })
                "
                @pointerdown="
                  isStatic
                    ? undefined
                    : slotSelect.handleSlotPointerDown($event, slotIndex, String(resource.id))
                "
                @click="
                  isStatic
                    ? undefined
                    : emit('timeSlotClick', {
                        slotStart: `${date} ${interval.startTime}` as DateTimeStringValue,
                        slotEnd: `${date} ${interval.endTime}` as DateTimeStringValue,
                        nativeEvent: $event,
                        resourceId: resource.id,
                      })
                "
              >
                <slot
                  name="timeSlot"
                  :resource="resource"
                  :start-time="interval.startTime"
                  :end-time="interval.endTime"
                />
              </UnstyledButton>
            </Box>
          </Box>

          <template v-if="showIndicator">
            <slot name="currentTimeIndicator" :time="currentTime" :offset="indicatorOffset">
              <Box
                v-bind="
                  getStyles('resourcesDayViewCurrentTimeIndicator', { style: indicatorStyle })
                "
              >
                <div
                  v-if="props.withCurrentTimeBubble"
                  v-bind="getStyles('resourcesDayViewCurrentTimeIndicatorTimeBubble')"
                >
                  {{ currentTime }}
                </div>
                <div v-else v-bind="getStyles('resourcesDayViewCurrentTimeIndicatorThumb')" />
                <div v-bind="getStyles('resourcesDayViewCurrentTimeIndicatorLine')" />
              </Box>
            </slot>
          </template>
        </div>
      </ScrollArea>
    </Box>
  </Box>
</template>
