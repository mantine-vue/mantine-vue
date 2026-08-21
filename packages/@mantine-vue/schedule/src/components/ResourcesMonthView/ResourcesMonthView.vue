<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { cssSize, resolveScheduleRadius } from '../shared'
import type { ResourcesMonthViewOwnProps } from './ResourcesMonthView.types'

const defaultProps = {
  weekdayFormat: 'ddd',
  weekendDays: [0, 6],
  withWeekendDays: true,
  highlightToday: true,
  withHeader: true,
  dayWidth: 80,
  rowHeight: 64,
  groupLabelWidth: 80,
  mode: 'default',
  maxEventsPerTimeSlot: 2,
  recurrenceExpansionLimit: 2000,
} satisfies Partial<ResourcesMonthViewOwnProps>

/** View levels the header offers – a resource schedule has no year view. */
const RESOURCE_VIEWS = ['day', 'week', 'month'] as const

/** Height reserved for the "more events" control at the bottom of a cell, in px. */
const MORE_EVENTS_HEIGHT = 18

/** `maxEventsPerTimeSlot` is clamped so the cells keep a workable row height. */
function clampMaxRows(value: number) {
  return Math.min(10, Math.max(1, value))
}

const varsResolver = createVarsResolver<any>(
  (_theme, { radius, dayWidth, rowHeight, groupLabelWidth }) => ({
    resourcesMonthView: {
      '--resources-month-view-radius': resolveScheduleRadius(radius),
      '--resources-month-view-day-width': cssSize(dayWidth),
      '--resources-month-view-row-height': cssSize(rowHeight),
      '--resources-month-view-group-label-width': cssSize(groupLabelWidth),
    },
  }),
)

export { defaultProps, varsResolver, clampMaxRows, RESOURCE_VIEWS, MORE_EVENTS_HEIGHT }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, ref, shallowRef, useAttrs, useSlots } from 'vue'
import { Box, ScrollArea, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { getLabel } from '../../labels'
import type {
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleViewLevel,
} from '../../types'
import {
  calculateMonthDropDate,
  expandRecurringEvents,
  formatDate,
  getGroupToResourceIdMap,
  getOrderedResources,
  handleResourcesGridKeyDown,
  type ResourceGroupInfo,
  type ResourcesGridControls,
} from '../../utils'
import { provideScheduleDragState } from '../DragContext'
import { MoreEvents } from '../MoreEvents'
import { ScheduleEvent } from '../ScheduleEvent'
import { ScheduleHeaderBase } from '../ScheduleHeader/ScheduleHeaderBase'
import {
  getDropEvent,
  rafThrottle,
  resolveEventRenderers,
  scheduleViewportProps,
  scrollSlotIntoView,
  useStaticStyles,
} from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import {
  getResourcesMonthViewLayout,
  isMultiDayEvent,
  type ResourcesMonthViewSegment,
} from './get-resources-month-view-layout/get-resources-month-view-layout'
import type { ResourcesMonthViewEmits, ResourcesMonthViewSlots } from './ResourcesMonthView.types'
import classes from './ResourcesMonthView.module.css'

defineOptions({
  name: 'ResourcesMonthView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ResourcesMonthViewOwnProps>(), {
  groups: undefined,
  locale: undefined,
  weekdayFormat: undefined,
  weekendDays: undefined,
  withWeekendDays: undefined,
  startScrollDate: undefined,
  highlightToday: undefined,
  radius: undefined,
  withHeader: undefined,
  monthYearSelectProps: undefined,
  previousControlProps: undefined,
  nextControlProps: undefined,
  todayControlProps: undefined,
  viewSelectProps: undefined,
  events: undefined,
  dayWidth: undefined,
  rowHeight: undefined,
  groupLabelWidth: undefined,
  renderEventBody: undefined,
  renderEvent: undefined,
  renderResourceLabel: undefined,
  renderGroupLabel: undefined,
  canDragEvent: undefined,
  labels: undefined,
  mode: undefined,
  scrollAreaProps: undefined,
  maxEventsPerTimeSlot: undefined,
  moreEventsProps: undefined,
  recurrenceExpansionLimit: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ResourcesMonthViewSlots>()

const emit = defineEmits<ResourcesMonthViewEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('ResourcesMonthView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'ResourcesMonthView',
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
  rootSelector: 'resourcesMonthView',
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

const dropTarget = shallowRef<{ resourceId: string | number; dayIndex: number } | null>(null)

const isStatic = computed(() => props.mode === 'static')

const month = computed(() => dayjs(props.date).startOf('month'))
const monthString = computed(() => month.value.format('YYYY-MM-DD') as DateStringValue)

const maxRows = computed(() => clampMaxRows(props.maxEventsPerTimeSlot!))

const days = computed(() =>
  Array.from({ length: month.value.daysInMonth() }, (_, index) => month.value.date(index + 1))
    .filter((day) => props.withWeekendDays || !props.weekendDays!.includes(day.day() as DayOfWeek))
    .map((day) => day.format('YYYY-MM-DD') as DateStringValue),
)

const ordered = computed(() => getOrderedResources(props.resources, props.groups))
const idMap = computed(() => getGroupToResourceIdMap(props.resources))
const hasGroups = computed(() => ordered.value.groupRanges.length > 0)

const expandedEvents = computed(() =>
  expandRecurringEvents({
    events: props.events,
    rangeStart: month.value.toDate(),
    rangeEnd: month.value.endOf('month').toDate(),
    expansionLimit: props.recurrenceExpansionLimit!,
  }),
)

const rowLayouts = computed(() =>
  ordered.value.orderedResources.map((resource) =>
    getResourcesMonthViewLayout({
      days: days.value,
      events: expandedEvents.value,
      resourceId: resource.id,
      maxRows: maxRows.value,
    }),
  ),
)

const singleDayEvents = (rowIndex: number) =>
  rowLayouts.value[rowIndex].layouts.flatMap((layout, dayIndex) =>
    layout.visible
      .filter(({ event }) => !isMultiDayEvent(event))
      .map(({ event, row }) => ({
        event,
        row,
        dayIndex,
        compressed: layout.hiddenCount > 0 && !isStatic.value,
      })),
  )

const cellsWithHiddenEvents = (rowIndex: number) =>
  rowLayouts.value[rowIndex].layouts
    .map((layout, dayIndex) => ({ layout, dayIndex }))
    .filter(({ layout }) => layout.hiddenCount > 0 && !isStatic.value)

const slotSelect = useSlotDragSelect({
  enabled: () => Boolean(props.withDragSlotSelect) && !isStatic.value,
  onDragEnd: (start, end, group) => {
    const first = days.value[start]
    const last = days.value[end]

    if (first && last) {
      emit('slotDragEnd', {
        rangeStart: `${first} 00:00:00` as DateTimeStringValue,
        rangeEnd: dayjs(last).endOf('day').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
        resourceId: idMap.value.get(group) ?? group,
      })
    }
  },
})

onMounted(async () => {
  if (!props.startScrollDate) {
    return
  }

  await nextTick()

  const index = days.value.indexOf(
    dayjs(props.startScrollDate).format('YYYY-MM-DD') as DateStringValue,
  )

  if (index < 0) {
    return
  }

  scrollSlotIntoView(controls[0]?.[index], 'x')
})

const setControl = (resourceIndex: number, dayIndex: number) => (element: unknown) => {
  const button = (element as { $el?: HTMLButtonElement } | null)?.$el ?? element
  controls[resourceIndex] ||= []
  controls[resourceIndex][dayIndex] = button instanceof HTMLButtonElement ? button : undefined
}

const setRowContainer = (resourceIndex: number) => (element: unknown) => {
  if (element instanceof HTMLElement) {
    rowContainers.set(resourceIndex, element)
  }
}

const withDragHandlers = computed(
  () =>
    !isStatic.value &&
    (Boolean(props.withEventsDragAndDrop) || Boolean(props.withExternalEventDrop)),
)

const indexAtPoint = (nativeEvent: DragEvent, resourceIndex: number) => {
  const container = rowContainers.get(resourceIndex)

  if (!container || !days.value.length) {
    return -1
  }

  const rect = container.getBoundingClientRect()

  if (rect.width <= 0) {
    return -1
  }

  return Math.max(
    0,
    Math.min(
      days.value.length - 1,
      Math.floor(((nativeEvent.clientX - rect.left) / rect.width) * days.value.length),
    ),
  )
}

const emitDrop = (nativeEvent: DragEvent, resourceId: string | number, dayIndex: number) => {
  nativeEvent.preventDefault()
  // Drop the pending frame first, so a stale highlight cannot land after the drop.
  resolveDropTarget.cancel()
  setDropTarget(null)
  const day = days.value[dayIndex]

  if (!day) {
    return
  }

  const dragged = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

  if (dragged) {
    const next = calculateMonthDropDate({ draggedEvent: dragged, targetDay: day })

    emit('eventDrop', {
      eventId: dragged.id,
      newStart: dayjs(next.start).format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
      newEnd: dayjs(next.end).format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
      event: dragged,
      resourceId,
    })
  } else if (nativeEvent.dataTransfer) {
    emit('externalEventDrop', {
      dataTransfer: nativeEvent.dataTransfer,
      dropDateTime: `${day} 00:00:00` as DateTimeStringValue,
      resourceId,
    })
  }
}

const setDropTarget = (next: { resourceId: string | number; dayIndex: number } | null) => {
  const current = dropTarget.value

  if (current === next) {
    return
  }

  if (
    current &&
    next &&
    current.resourceId === next.resourceId &&
    current.dayIndex === next.dayIndex
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
    const dayIndex = indexAtPoint(nativeEvent, resourceIndex)
    setDropTarget(dayIndex < 0 ? null : { resourceId, dayIndex })
  },
)

const handleRowDragOver = (
  nativeEvent: DragEvent,
  resource: { id: string | number },
  resourceIndex: number,
) => {
  // `preventDefault` stays synchronous: the browser reads it as the handler returns.
  nativeEvent.preventDefault()
  resolveDropTarget(nativeEvent, resource.id, resourceIndex)
}

const handleRowDragLeave = (nativeEvent: DragEvent) => {
  const current = nativeEvent.currentTarget

  if (
    !(nativeEvent.relatedTarget instanceof Node) ||
    !(current instanceof HTMLElement) ||
    !current.contains(nativeEvent.relatedTarget)
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
  const dayIndex = indexAtPoint(nativeEvent, resourceIndex)

  if (dayIndex >= 0) {
    emitDrop(nativeEvent, resource.id, dayIndex)
  }
}

const groupInfo = (resourceIndex: number) =>
  hasGroups.value ? ordered.value.resourceGroupMap[resourceIndex] : undefined

const groupStarts = (info: ResourceGroupInfo) =>
  info.position === 'first' || info.position === 'only'

const groupCellStyle = (info: ResourceGroupInfo) =>
  info.count > 1
    ? {
        transform: `translateY(calc((${info.count - 1} * (var(--resources-month-view-row-height) + 1px)) / 2))`,
      }
    : undefined

const rowGeometry = (row: number, compressed: boolean) =>
  compressed
    ? {
        top: `calc((100% - ${MORE_EVENTS_HEIGHT}px) * ${row} / ${maxRows.value} + 1px)`,
        height: `calc((100% - ${MORE_EVENTS_HEIGHT}px) / ${maxRows.value} - 2px)`,
      }
    : {
        top: `calc(${(row / maxRows.value) * 100}% + 1px)`,
        height: `calc(${100 / maxRows.value}% - 2px)`,
      }

const singleEventStyle = (entry: { row: number; dayIndex: number; compressed: boolean }) => ({
  position: 'absolute' as const,
  left: `calc(${(entry.dayIndex / days.value.length) * 100}% + 1px)`,
  width: `calc(${100 / days.value.length}% - 2px)`,
  ...rowGeometry(entry.row, entry.compressed),
  zIndex: 3,
})

const segmentStyle = (segment: ResourcesMonthViewSegment) => ({
  position: 'absolute' as const,
  left: `calc(${(segment.start / days.value.length) * 100}% + 1px)`,
  width: `calc(${((segment.end - segment.start + 1) / days.value.length) * 100}% - 2px)`,
  ...rowGeometry(segment.row, segment.hidden),
  zIndex: 3,
})

const moreEventsStyle = (dayIndex: number) => ({
  position: 'absolute' as const,
  bottom: '1px',
  left: `calc(${(dayIndex / days.value.length) * 100}% + 1px)`,
  width: `calc(${100 / days.value.length}% - 2px)`,
  height: `${MORE_EVENTS_HEIGHT}px`,
  zIndex: 4,
})

const cornerStyle = computed(() =>
  hasGroups.value
    ? {
        flexBasis:
          'calc(var(--resources-month-view-resource-label-width) + var(--resources-month-view-group-label-width))',
        minWidth:
          'calc(var(--resources-month-view-resource-label-width) + var(--resources-month-view-group-label-width))',
      }
    : undefined,
)

const headerControl = computed(() => ({
  monthYearSelect: {
    locale: props.locale,
    monthValue: month.value.month(),
    yearValue: month.value.year(),
    onMonthChange: (value: number) =>
      emit('dateChange', month.value.month(value).format('YYYY-MM-DD') as DateStringValue),
    onYearChange: (value: number) =>
      emit('dateChange', month.value.year(value).format('YYYY-MM-DD') as DateStringValue),
    ...props.monthYearSelectProps,
  },
}))

const isDraggableEvent = (event: ScheduleEventData) =>
  Boolean(props.withEventsDragAndDrop) && !isStatic.value && (props.canDragEvent?.(event) ?? true)

const dragState = provideScheduleDragState({
  dragOverTarget: () => {
    const target = dropTarget.value
    const day = target ? days.value[target.dayIndex] : undefined
    return day ? { date: day } : null
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
    v-bind="{ ...attrs, ...getStyles('resourcesMonthView') }"
    :root-ref="setRootElement"
    :data-event-interaction="dropTarget ? true : undefined"
  >
    <template v-if="props.withHeader">
      <slot name="header" :month="monthString">
        <ScheduleHeaderBase
          view="month"
          :navigation-handlers="{
            previous: () => month.subtract(1, 'month').format('YYYY-MM-DD'),
            next: () => month.add(1, 'month').format('YYYY-MM-DD'),
            today: () => dayjs().format('YYYY-MM-DD'),
          }"
          :control="headerControl"
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

    <Box v-bind="getStyles('resourcesMonthViewRoot')">
      <ScrollArea
        :scrollbar-size="4"
        scrollbars="x"
        v-bind="{ ...props.scrollAreaProps, ...getStyles('resourcesMonthViewScrollArea') }"
        :viewport-props="{ ...scheduleViewportProps, ...props.scrollAreaProps?.viewportProps }"
      >
        <div v-bind="getStyles('resourcesMonthViewInner')">
          <div v-bind="getStyles('resourcesMonthViewDayLabelsRow')">
            <div v-bind="getStyles('resourcesMonthViewCorner', { style: cornerStyle })">
              <slot name="corner" :resources="ordered.orderedResources">
                {{ getLabel('resources', props.labels) }}
              </slot>
            </div>

            <template v-for="day in days" :key="day">
              <slot
                name="dayLabel"
                :date="day"
                :weekday="
                  formatDate({
                    date: day,
                    locale: props.locale || 'en',
                    format: props.weekdayFormat!,
                  })
                "
                :day="dayjs(day).date()"
              >
                <div
                  v-bind="staticStyles('resourcesMonthViewDayLabel')"
                  :data-weekend="
                    props.weekendDays!.includes(dayjs(day).day() as DayOfWeek) || undefined
                  "
                  :data-today="
                    (props.highlightToday && dayjs(day).isSame(dayjs(), 'day')) || undefined
                  "
                >
                  <span v-bind="staticStyles('resourcesMonthViewDayLabelWeekday')">
                    {{
                      formatDate({
                        date: day,
                        locale: props.locale || 'en',
                        format: props.weekdayFormat!,
                      })
                    }}
                  </span>
                  <span v-bind="staticStyles('resourcesMonthViewDayLabelNumber')">
                    {{ dayjs(day).date() }}
                  </span>
                </div>
              </slot>
            </template>
          </div>

          <div
            v-for="(resource, resourceIndex) in ordered.orderedResources"
            :key="resource.id"
            v-bind="staticStyles('resourcesMonthViewRow')"
          >
            <template v-if="groupInfo(resourceIndex) !== undefined">
              <Box
                v-if="groupInfo(resourceIndex) === null"
                v-bind="staticStyles('resourcesMonthViewGroupColumnEmpty')"
              />
              <Box
                v-else
                v-bind="staticStyles('resourcesMonthViewGroupColumn')"
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

            <div
              v-bind="staticStyles('resourcesMonthViewResourceLabel')"
              :data-has-groups="hasGroups || undefined"
            >
              <slot name="resourceLabel" :resource="resource">
                <component
                  :is="() => props.renderResourceLabel!(resource)"
                  v-if="props.renderResourceLabel"
                />
                <template v-else>{{ resource.label }}</template>
              </slot>
            </div>

            <div
              :ref="setRowContainer(resourceIndex)"
              v-bind="staticStyles('resourcesMonthViewRowSlots')"
              @dragover="
                withDragHandlers ? handleRowDragOver($event, resource, resourceIndex) : undefined
              "
              @dragleave="handleRowDragLeave($event)"
              @drop="withDragHandlers ? handleRowDrop($event, resource, resourceIndex) : undefined"
            >
              <ScheduleEvent
                v-for="entry in singleDayEvents(resourceIndex)"
                :key="`${entry.event.id}-${entry.dayIndex}`"
                :event="entry.event"
                auto-size
                nowrap
                :radius="props.radius"
                :mode="props.mode"
                :draggable="isDraggableEvent(entry.event)"
                :style="singleEventStyle(entry)"
                v-bind="{ ...eventRenderers, ...stylesApi }"
                @event-drag-start="dragStart"
                @event-drag-end="dragEnd"
                @click="
                  isStatic ? undefined : emit('eventClick', entry.event, $event as MouseEvent)
                "
              />

              <ScheduleEvent
                v-for="segment in rowLayouts[resourceIndex].segments"
                :key="`${segment.event.id}-${segment.start}`"
                :event="segment.event"
                :hanging="segment.hanging"
                auto-size
                nowrap
                :radius="props.radius"
                :mode="props.mode"
                :draggable="isDraggableEvent(segment.event)"
                :style="segmentStyle(segment)"
                v-bind="{ ...eventRenderers, ...stylesApi }"
                @event-drag-start="dragStart"
                @event-drag-end="dragEnd"
                @click="
                  isStatic ? undefined : emit('eventClick', segment.event, $event as MouseEvent)
                "
              />

              <template
                v-for="entry in cellsWithHiddenEvents(resourceIndex)"
                :key="`more-${entry.dayIndex}`"
              >
                <slot
                  name="moreEvents"
                  :events="rowLayouts[resourceIndex].eventsByDay[entry.dayIndex]"
                  :hidden-count="entry.layout.hiddenCount"
                  :resource="resource"
                  :date="days[entry.dayIndex]"
                >
                  <MoreEvents
                    :events="rowLayouts[resourceIndex].eventsByDay[entry.dayIndex]"
                    :more-events-count="entry.layout.hiddenCount"
                    :mode="props.mode"
                    :labels="props.labels"
                    :style="moreEventsStyle(entry.dayIndex)"
                    v-bind="{ ...eventRenderers, ...stylesApi, ...props.moreEventsProps }"
                    @event-click="(event, nativeEvent) => emit('eventClick', event, nativeEvent)"
                  />
                </slot>
              </template>

              <UnstyledButton
                v-for="(day, dayIndex) in days"
                :key="day"
                :ref="setControl(resourceIndex, dayIndex)"
                v-bind="staticStyles('resourcesMonthViewCell')"
                :data-weekend="
                  props.weekendDays!.includes(dayjs(day).day() as DayOfWeek) || undefined
                "
                :data-drop-target="
                  (dropTarget?.resourceId === resource.id && dropTarget.dayIndex === dayIndex) ||
                  undefined
                "
                :data-drag-selected="
                  slotSelect.isSlotSelected(dayIndex, String(resource.id)) || undefined
                "
                :data-static="isStatic || undefined"
                :data-drag-slot-index="props.withDragSlotSelect ? dayIndex : undefined"
                :data-drag-slot-group="props.withDragSlotSelect ? String(resource.id) : undefined"
                :tabindex="isStatic ? -1 : resourceIndex === 0 && dayIndex === 0 ? 0 : -1"
                :aria-label="`${String(resource.label)} ${dayjs(day).format('MMMM D, YYYY')}`"
                @keydown="
                  handleResourcesGridKeyDown({
                    controls,
                    resourceIndex,
                    slotIndex: dayIndex,
                    event: $event,
                  })
                "
                @pointerdown="
                  isStatic
                    ? undefined
                    : slotSelect.handleSlotPointerDown($event, dayIndex, String(resource.id))
                "
                @click="
                  isStatic
                    ? undefined
                    : emit('dayClick', {
                        date: day,
                        nativeEvent: $event,
                        resourceId: resource.id,
                      })
                "
              >
                <slot name="dayCell" :resource="resource" :date="day" />
              </UnstyledButton>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Box>
  </Box>
</template>
