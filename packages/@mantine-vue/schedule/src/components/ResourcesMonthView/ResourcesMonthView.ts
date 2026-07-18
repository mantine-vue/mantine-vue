import { Box, ScrollArea, UnstyledButton } from '@mantine-vue/core'
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
import type {
  MonthYearSelectProps,
  NativeButtonProps,
  RenderEvent,
  RenderEventBody,
  ViewSelectProps,
} from '../../component-props'
import { getLabel, type ScheduleLabelsOverride } from '../../labels'
import type {
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
  calculateMonthDropDate,
  expandRecurringEvents,
  formatDate,
  getGroupToResourceIdMap,
  getOrderedResources,
  handleResourcesGridKeyDown,
  type ResourcesGridControls,
} from '../../utils'
import { MoreEvents } from '../MoreEvents/MoreEvents'
import type { ResourceViewDropData } from '../ResourcesDayView/ResourcesDayView'
import { ScheduleEvent } from '../ScheduleEvent/ScheduleEvent'
import { ScheduleHeaderBase } from '../ScheduleHeader/ScheduleHeaderBase'
import { forwardEventSlots, getDropEvent, resolveScheduleRadius } from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import classes from './ResourcesMonthView.module.css'

interface CellLayout {
  visible: Array<{ event: ScheduleEventData; row: number }>
  hiddenCount: number
}
interface Segment {
  event: ScheduleEventData
  start: number
  end: number
  row: number
  hanging: 'start' | 'end' | 'both' | 'none'
  hidden: boolean
}

export interface ResourcesMonthViewProps {
  date: Date | string
  onDateChange?: (value: DateStringValue) => void
  resources: ScheduleResourceData[]
  locale?: string
  weekdayFormat?: DateLabelFormat
  weekendDays?: DayOfWeek[]
  withWeekendDays?: boolean
  startScrollDate?: string
  onDayClick?: (data: {
    date: DateStringValue
    nativeEvent: MouseEvent
    resourceId?: string | number
  }) => void
  highlightToday?: boolean
  radius?: string | number
  withHeader?: boolean
  monthYearSelectProps?: Partial<MonthYearSelectProps>
  onViewChange?: (view: ScheduleViewLevel) => void
  previousControlProps?: NativeButtonProps
  nextControlProps?: NativeButtonProps
  todayControlProps?: NativeButtonProps
  viewSelectProps?: Partial<ViewSelectProps>
  events?: ScheduleEventData[]
  dayWidth?: CSSProperties['width']
  rowHeight?: CSSProperties['height']
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
  onEventClick?: (event: ScheduleEventData, nativeEvent: MouseEvent) => void
  withDragSlotSelect?: boolean
  onSlotDragEnd?: (data: {
    rangeStart: DateTimeStringValue
    rangeEnd: DateTimeStringValue
    resourceId?: string | number
  }) => void
  labels?: ScheduleLabelsOverride
  mode?: ScheduleMode
  scrollAreaProps?: Record<string, unknown>
  onExternalEventDrop?: (data: {
    dataTransfer: DataTransfer
    dropDateTime: DateTimeStringValue
    resourceId?: string | number
  }) => void
  maxEventsPerTimeSlot?: number
  moreEventsProps?: Record<string, unknown>
  recurrenceExpansionLimit?: number
}

export interface ResourcesMonthViewSlots {
  header?: (props: { month: DateStringValue }) => VNodeChild
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild
  dayLabel?: (props: { date: DateStringValue; weekday: VNodeChild; day: number }) => VNodeChild
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild
  dayCell?: (props: { resource: ScheduleResourceData; date: DateStringValue }) => VNodeChild
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
  moreEvents?: (props: {
    events: ScheduleEventData[]
    hiddenCount: number
    resource: ScheduleResourceData
    date: DateStringValue
  }) => VNodeChild
}

const cssSize = (value: CSSProperties['width']) =>
  typeof value === 'number' ? `${value}px` : value
const isMulti = (event: ScheduleEventData) =>
  dayjs(event.end).startOf('day').isAfter(dayjs(event.start).startOf('day'))
const compareEvents = (a: ScheduleEventData, b: ScheduleEventData) => {
  const aSpan = dayjs(a.end).startOf('day').diff(dayjs(a.start).startOf('day'), 'day')
  const bSpan = dayjs(b.end).startOf('day').diff(dayjs(b.start).startOf('day'), 'day')
  return aSpan === bSpan ? dayjs(a.start).valueOf() - dayjs(b.start).valueOf() : bSpan - aSpan
}

export const ResourcesMonthView = defineComponent({
  name: 'ResourcesMonthView',
  inheritAttrs: false,
  slots: Object as SlotsType<ResourcesMonthViewSlots>,
  props: {
    date: { type: [String, Date] as PropType<Date | string>, required: true },
    onDateChange: Function as PropType<ResourcesMonthViewProps['onDateChange']>,
    resources: { type: Array as PropType<ScheduleResourceData[]>, required: true },
    locale: String,
    weekdayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'ddd' },
    weekendDays: { type: Array as PropType<DayOfWeek[]>, default: () => [0, 6] },
    withWeekendDays: { type: Boolean, default: true },
    startScrollDate: String,
    onDayClick: Function as PropType<ResourcesMonthViewProps['onDayClick']>,
    highlightToday: { type: Boolean, default: true },
    radius: [String, Number] as PropType<string | number>,
    withHeader: { type: Boolean, default: true },
    monthYearSelectProps: Object as PropType<Partial<MonthYearSelectProps>>,
    onViewChange: Function as PropType<ResourcesMonthViewProps['onViewChange']>,
    previousControlProps: Object as PropType<NativeButtonProps>,
    nextControlProps: Object as PropType<NativeButtonProps>,
    todayControlProps: Object as PropType<NativeButtonProps>,
    viewSelectProps: Object as PropType<Partial<ViewSelectProps>>,
    events: Array as PropType<ScheduleEventData[]>,
    dayWidth: { type: [String, Number] as PropType<CSSProperties['width']>, default: 80 },
    rowHeight: { type: [String, Number] as PropType<CSSProperties['height']>, default: 64 },
    renderEventBody: Function as PropType<RenderEventBody>,
    renderEvent: Function as PropType<RenderEvent>,
    renderResourceLabel: Function as PropType<ResourcesMonthViewProps['renderResourceLabel']>,
    groups: Array as PropType<ScheduleResourceGroup[]>,
    renderGroupLabel: Function as PropType<ResourcesMonthViewProps['renderGroupLabel']>,
    groupLabelWidth: { type: [String, Number] as PropType<CSSProperties['width']>, default: 80 },
    withEventsDragAndDrop: Boolean,
    onEventDrop: Function as PropType<ResourcesMonthViewProps['onEventDrop']>,
    canDragEvent: Function as PropType<ResourcesMonthViewProps['canDragEvent']>,
    onEventDragStart: Function as PropType<ResourcesMonthViewProps['onEventDragStart']>,
    onEventDragEnd: Function as PropType<ResourcesMonthViewProps['onEventDragEnd']>,
    onEventClick: Function as PropType<ResourcesMonthViewProps['onEventClick']>,
    withDragSlotSelect: Boolean,
    onSlotDragEnd: Function as PropType<ResourcesMonthViewProps['onSlotDragEnd']>,
    labels: Object as PropType<ScheduleLabelsOverride>,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    scrollAreaProps: Object as PropType<Record<string, unknown>>,
    onExternalEventDrop: Function as PropType<ResourcesMonthViewProps['onExternalEventDrop']>,
    maxEventsPerTimeSlot: { type: Number, default: 2 },
    moreEventsProps: Object as PropType<Record<string, unknown>>,
    recurrenceExpansionLimit: { type: Number, default: 2000 },
  },
  setup(props, { attrs, slots }) {
    const controls: ResourcesGridControls = []
    const rowContainers = new Map<number, HTMLElement>()
    const rootElement = ref<HTMLElement | null>(null)
    const dropTarget = ref<{ resourceId: string | number; dayIndex: number } | null>(null)
    const days = computed(() => {
      const month = dayjs(props.date).startOf('month')
      return Array.from({ length: month.daysInMonth() }, (_, index) => month.date(index + 1))
        .filter(
          (day) => props.withWeekendDays || !props.weekendDays.includes(day.day() as DayOfWeek),
        )
        .map((day) => day.format('YYYY-MM-DD'))
    })
    const ordered = computed(() => getOrderedResources(props.resources, props.groups))
    const idMap = computed(() => getGroupToResourceIdMap(props.resources))
    const expanded = computed(() =>
      expandRecurringEvents({
        events: props.events,
        rangeStart: dayjs(props.date).startOf('month').toDate(),
        rangeEnd: dayjs(props.date).endOf('month').toDate(),
        expansionLimit: props.recurrenceExpansionLimit,
      }),
    )
    const slotSelect = useSlotDragSelect({
      enabled: () => props.withDragSlotSelect && props.mode !== 'static',
      onDragEnd: () =>
        props.onSlotDragEnd
          ? (start, end, group) => {
              const first = days.value[start]
              const last = days.value[end]
              if (first && last)
                props.onSlotDragEnd?.({
                  rangeStart: `${first} 00:00:00`,
                  rangeEnd: dayjs(last).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                  resourceId: idMap.value.get(group) ?? group,
                })
            }
          : undefined,
    })

    onMounted(async () => {
      if (!props.startScrollDate) return
      await nextTick()
      const index = days.value.indexOf(dayjs(props.startScrollDate).format('YYYY-MM-DD'))
      const target = controls[0]?.[index]
      const viewport = rootElement.value?.querySelector<HTMLElement>('.mantine-ScrollArea-viewport')
      if (target && viewport) {
        viewport.scrollLeft = target.offsetLeft
        requestAnimationFrame(() => (viewport.scrollLeft = target.offsetLeft))
      }
    })

    const indexAtPoint = (event: DragEvent, resourceIndex: number) => {
      const container = rowContainers.get(resourceIndex)
      if (!container || !days.value.length) return -1
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0) return -1
      return Math.max(
        0,
        Math.min(
          days.value.length - 1,
          Math.floor(((event.clientX - rect.left) / rect.width) * days.value.length),
        ),
      )
    }
    const emitDrop = (event: DragEvent, resourceId: string | number, dayIndex: number) => {
      event.preventDefault()
      dropTarget.value = null
      const day = days.value[dayIndex]
      if (!day) return
      const dragged = getDropEvent(expanded.value, event.dataTransfer)
      if (dragged) {
        const next = calculateMonthDropDate({ draggedEvent: dragged, targetDay: day })
        props.onEventDrop?.({
          eventId: dragged.id,
          newStart: dayjs(next.start).format('YYYY-MM-DD HH:mm:ss'),
          newEnd: dayjs(next.end).format('YYYY-MM-DD HH:mm:ss'),
          event: dragged,
          resourceId,
        })
      } else if (event.dataTransfer)
        props.onExternalEventDrop?.({
          dataTransfer: event.dataTransfer,
          dropDateTime: `${day} 00:00:00`,
          resourceId,
        })
    }

    return () => {
      const maxRows = Math.min(10, Math.max(1, props.maxEventsPerTimeSlot))
      const hasGroups = ordered.value.groupRanges.length > 0
      const monthStart = dayjs(days.value[0]).startOf('day')
      const monthEnd = dayjs(days.value.at(-1)).add(1, 'day').startOf('day')
      const rows = ordered.value.orderedResources.map((resource, resourceIndex) => {
        const eventsByDay = days.value.map((day) =>
          (expanded.value || [])
            .filter(
              (event) =>
                event.resourceId === resource.id &&
                dayjs(event.start).isBefore(dayjs(day).endOf('day')) &&
                dayjs(event.end).isAfter(dayjs(day).startOf('day')),
            )
            .sort(compareEvents),
        )
        const layouts: CellLayout[] = []
        const lastRow = new Map<string | number, number>()
        const rowByEvent = new Map<string | number, Map<number, number>>()
        eventsByDay.forEach((eventList, dayIndex) => {
          const used = new Set<number>()
          const visible: CellLayout['visible'] = []
          let hiddenCount = 0
          eventList.forEach((event) => {
            let row = lastRow.get(event.id)
            if (row === undefined || row >= maxRows || used.has(row))
              row = Array.from({ length: maxRows }, (_, i) => i).find((i) => !used.has(i))
            if (row === undefined) {
              hiddenCount++
              return
            }
            used.add(row)
            visible.push({ event, row })
            lastRow.set(event.id, row)
            if (!rowByEvent.has(event.id)) rowByEvent.set(event.id, new Map())
            rowByEvent.get(event.id)!.set(dayIndex, row)
          })
          layouts.push({ visible, hiddenCount })
        })
        const segments: Segment[] = []
        const multiEvents = Array.from(
          new Map(
            eventsByDay
              .flat()
              .filter(isMulti)
              .map((event) => [event.id, event]),
          ).values(),
        )
        multiEvents.forEach((event) => {
          const rowsForEvent = rowByEvent.get(event.id)
          let run: { start: number; end: number; row: number } | null = null
          const flush = () => {
            if (!run) return
            const before = dayjs(event.start).isBefore(monthStart)
            const after = dayjs(event.end).isAfter(monthEnd)
            segments.push({
              event,
              ...run,
              hanging: before && after ? 'both' : before ? 'start' : after ? 'end' : 'none',
              hidden: Array.from(
                { length: run.end - run.start + 1 },
                (_, i) => layouts[run!.start + i].hiddenCount > 0,
              ).some(Boolean),
            })
            run = null
          }
          days.value.forEach((_day, index) => {
            const row = rowsForEvent?.get(index)
            if (row === undefined) flush()
            else if (run && run.row === row && run.end === index - 1) run.end = index
            else {
              flush()
              run = { start: index, end: index, row }
            }
          })
          flush()
        })
        const eventNodes: VNodeChild[] = []
        layouts.forEach((layout, dayIndex) =>
          layout.visible.forEach(({ event, row }) => {
            if (isMulti(event)) return
            const compressed = layout.hiddenCount > 0 && props.mode !== 'static'
            eventNodes.push(
              h(
                ScheduleEvent,
                {
                  key: `${event.id}-${dayIndex}`,
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
                      : (nativeEvent: MouseEvent) => props.onEventClick?.(event, nativeEvent),
                  style: {
                    position: 'absolute',
                    left: `calc(${(dayIndex / days.value.length) * 100}% + 1px)`,
                    width: `calc(${100 / days.value.length}% - 2px)`,
                    top: compressed
                      ? `calc((100% - 18px) * ${row} / ${maxRows} + 1px)`
                      : `calc(${(row / maxRows) * 100}% + 1px)`,
                    height: compressed
                      ? `calc((100% - 18px) / ${maxRows} - 2px)`
                      : `calc(${100 / maxRows}% - 2px)`,
                    zIndex: 3,
                  },
                },
                forwardEventSlots(slots),
              ),
            )
          }),
        )
        segments.forEach((segment) =>
          eventNodes.push(
            h(
              ScheduleEvent,
              {
                key: `${segment.event.id}-${segment.start}`,
                event: segment.event,
                hanging: segment.hanging,
                autoSize: true,
                nowrap: true,
                radius: props.radius,
                mode: props.mode,
                renderEvent: props.renderEvent,
                renderEventBody: props.renderEventBody,
                draggable:
                  props.withEventsDragAndDrop &&
                  props.mode !== 'static' &&
                  (props.canDragEvent?.(segment.event) ?? true),
                onEventDragStart: props.onEventDragStart,
                onEventDragEnd: props.onEventDragEnd,
                onClick:
                  props.mode === 'static'
                    ? undefined
                    : (nativeEvent: MouseEvent) => props.onEventClick?.(segment.event, nativeEvent),
                style: {
                  position: 'absolute',
                  left: `calc(${(segment.start / days.value.length) * 100}% + 1px)`,
                  width: `calc(${((segment.end - segment.start + 1) / days.value.length) * 100}% - 2px)`,
                  top: segment.hidden
                    ? `calc((100% - 18px) * ${segment.row} / ${maxRows} + 1px)`
                    : `calc(${(segment.row / maxRows) * 100}% + 1px)`,
                  height: segment.hidden
                    ? `calc((100% - 18px) / ${maxRows} - 2px)`
                    : `calc(${100 / maxRows}% - 2px)`,
                  zIndex: 3,
                },
              },
              forwardEventSlots(slots),
            ),
          ),
        )
        const moreNodes = layouts.map((layout, dayIndex) =>
          layout.hiddenCount && props.mode !== 'static'
            ? (slots.moreEvents?.({
                events: eventsByDay[dayIndex],
                hiddenCount: layout.hiddenCount,
                resource,
                date: days.value[dayIndex],
              }) ??
              h(
                MoreEvents,
                {
                  ...props.moreEventsProps,
                  key: `more-${dayIndex}`,
                  events: eventsByDay[dayIndex],
                  moreEventsCount: layout.hiddenCount,
                  mode: props.mode,
                  labels: props.labels,
                  renderEvent: props.renderEvent,
                  renderEventBody: props.renderEventBody,
                  onEventClick: props.onEventClick,
                  style: {
                    position: 'absolute',
                    bottom: '1px',
                    left: `calc(${(dayIndex / days.value.length) * 100}% + 1px)`,
                    width: `calc(${100 / days.value.length}% - 2px)`,
                    height: '18px',
                    zIndex: 4,
                  },
                },
                forwardEventSlots(slots),
              ))
            : null,
        )
        const group = hasGroups ? ordered.value.resourceGroupMap[resourceIndex] : undefined
        const groupCell =
          group === undefined
            ? null
            : group === null
              ? h(Box, { class: classes.resourcesMonthViewGroupColumnEmpty })
              : h(
                  Box,
                  {
                    class: classes.resourcesMonthViewGroupColumn,
                    'data-group-position': group.position,
                  },
                  () =>
                    group.position === 'first' || group.position === 'only'
                      ? h(
                          'span',
                          {
                            style:
                              group.count > 1
                                ? {
                                    transform: `translateY(calc((${group.count - 1} * (var(--resources-month-view-row-height) + 1px)) / 2))`,
                                  }
                                : undefined,
                          },
                          slots.groupLabel?.({ group: group.group }) ??
                            props.renderGroupLabel?.(group.group) ??
                            group.group.label ??
                            undefined,
                        )
                      : null,
                )
        const cells = days.value.map((day, dayIndex) => {
          const weekend = props.weekendDays.includes(dayjs(day).day() as DayOfWeek)
          const groupId = String(resource.id)
          return h(
            UnstyledButton,
            {
              key: day,
              ref: (element: unknown) => {
                const button = (element as { $el?: HTMLButtonElement } | null)?.$el ?? element
                controls[resourceIndex] ||= []
                controls[resourceIndex][dayIndex] =
                  button instanceof HTMLButtonElement ? button : undefined
              },
              class: classes.resourcesMonthViewCell,
              'data-weekend': weekend || undefined,
              'data-drop-target':
                (dropTarget.value?.resourceId === resource.id &&
                  dropTarget.value.dayIndex === dayIndex) ||
                undefined,
              'data-drag-selected': slotSelect.isSlotSelected(dayIndex, groupId) || undefined,
              'data-static': props.mode === 'static' || undefined,
              'data-drag-slot-index': props.withDragSlotSelect ? dayIndex : undefined,
              'data-drag-slot-group': props.withDragSlotSelect ? groupId : undefined,
              tabindex:
                props.mode === 'static' ? -1 : resourceIndex === 0 && dayIndex === 0 ? 0 : -1,
              'aria-label': `${String(resource.label)} ${dayjs(day).format('MMMM D, YYYY')}`,
              onKeydown: (event: KeyboardEvent) =>
                handleResourcesGridKeyDown({ controls, resourceIndex, slotIndex: dayIndex, event }),
              onPointerdown:
                props.mode === 'static'
                  ? undefined
                  : (event: PointerEvent) =>
                      slotSelect.handleSlotPointerDown(event, dayIndex, groupId),
              onClick:
                props.mode === 'static'
                  ? undefined
                  : (nativeEvent: MouseEvent) =>
                      props.onDayClick?.({ date: day, nativeEvent, resourceId: resource.id }),
            },
            () => slots.dayCell?.({ resource, date: day }),
          )
        })
        return h('div', { class: classes.resourcesMonthViewRow, key: resource.id }, [
          groupCell,
          h(
            'div',
            {
              class: classes.resourcesMonthViewResourceLabel,
              'data-has-groups': hasGroups || undefined,
            },
            slots.resourceLabel?.({ resource }) ??
              props.renderResourceLabel?.(resource) ??
              resource.label ??
              undefined,
          ),
          h(
            'div',
            {
              class: classes.resourcesMonthViewRowSlots,
              ref: (element: unknown) => {
                if (element instanceof HTMLElement) rowContainers.set(resourceIndex, element)
              },
              onDragover:
                props.mode !== 'static' &&
                (props.withEventsDragAndDrop || props.onExternalEventDrop)
                  ? (event: DragEvent) => {
                      event.preventDefault()
                      const dayIndex = indexAtPoint(event, resourceIndex)
                      if (
                        dayIndex >= 0 &&
                        (dropTarget.value?.resourceId !== resource.id ||
                          dropTarget.value.dayIndex !== dayIndex)
                      )
                        dropTarget.value = { resourceId: resource.id, dayIndex }
                    }
                  : undefined,
              onDragleave: (event: DragEvent) => {
                const current = event.currentTarget
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !(current instanceof HTMLElement) ||
                  !current.contains(event.relatedTarget)
                )
                  dropTarget.value = null
              },
              onDrop:
                props.mode !== 'static' &&
                (props.withEventsDragAndDrop || props.onExternalEventDrop)
                  ? (event: DragEvent) => {
                      const dayIndex = indexAtPoint(event, resourceIndex)
                      if (dayIndex >= 0) emitDrop(event, resource.id, dayIndex)
                    }
                  : undefined,
            },
            [...eventNodes, ...moreNodes, ...cells],
          ),
        ])
      })
      const month = dayjs(props.date).startOf('month')
      const monthString = month.format('YYYY-MM-DD')
      const header = props.withHeader
        ? (slots.header?.({ month: monthString }) ??
          h(ScheduleHeaderBase, {
            view: 'month',
            navigationHandlers: {
              previous: () => month.subtract(1, 'month').format('YYYY-MM-DD'),
              next: () => month.add(1, 'month').format('YYYY-MM-DD'),
              today: () => dayjs().format('YYYY-MM-DD'),
            },
            control: {
              monthYearSelect: {
                locale: props.locale,
                monthValue: month.month(),
                yearValue: month.year(),
                onMonthChange: (value: number) =>
                  props.onDateChange?.(month.month(value).format('YYYY-MM-DD')),
                onYearChange: (value: number) =>
                  props.onDateChange?.(month.year(value).format('YYYY-MM-DD')),
                ...props.monthYearSelectProps,
              },
            },
            labels: props.labels,
            onDateChange: props.onDateChange,
            onViewChange: props.onViewChange,
            previousControlProps: props.previousControlProps,
            nextControlProps: props.nextControlProps,
            todayControlProps: props.todayControlProps,
            viewSelectProps: { views: ['day', 'week', 'month'], ...props.viewSelectProps },
          }))
        : null
      const labels = days.value.map((day) => {
        const weekday = formatDate({
          date: day,
          locale: props.locale || 'en',
          format: props.weekdayFormat,
        })
        return (
          slots.dayLabel?.({ date: day, weekday, day: dayjs(day).date() }) ??
          h(
            'div',
            {
              key: day,
              class: classes.resourcesMonthViewDayLabel,
              'data-weekend':
                props.weekendDays.includes(dayjs(day).day() as DayOfWeek) || undefined,
              'data-today':
                (props.highlightToday && dayjs(day).isSame(dayjs(), 'day')) || undefined,
            },
            [
              h('span', { class: classes.resourcesMonthViewDayLabelWeekday }, weekday),
              h('span', { class: classes.resourcesMonthViewDayLabelNumber }, dayjs(day).date()),
            ],
          )
        )
      })
      return h(
        Box,
        {
          ...attrs,
          ref: (element: unknown) => {
            const node = (element as { $el?: HTMLElement } | null)?.$el ?? element
            rootElement.value = node instanceof HTMLElement ? node : null
          },
          class: [classes.resourcesMonthView, attrs.class],
          style: [
            {
              '--resources-month-view-radius': resolveScheduleRadius(props.radius),
              '--resources-month-view-day-width': cssSize(props.dayWidth),
              '--resources-month-view-row-height': cssSize(props.rowHeight),
              '--resources-month-view-group-label-width': cssSize(props.groupLabelWidth),
            },
            attrs.style,
          ],
          'data-event-interaction': dropTarget.value ? true : undefined,
        },
        () => [
          header,
          h(Box, { class: classes.resourcesMonthViewRoot }, () =>
            h(
              ScrollArea,
              {
                scrollbarSize: 4,
                scrollbars: 'x',
                ...props.scrollAreaProps,
                class: classes.resourcesMonthViewScrollArea,
              },
              () =>
                h('div', { class: classes.resourcesMonthViewInner }, [
                  h('div', { class: classes.resourcesMonthViewDayLabelsRow }, [
                    h(
                      'div',
                      {
                        class: classes.resourcesMonthViewCorner,
                        style: hasGroups
                          ? {
                              flexBasis:
                                'calc(var(--resources-month-view-resource-label-width) + var(--resources-month-view-group-label-width))',
                              minWidth:
                                'calc(var(--resources-month-view-resource-label-width) + var(--resources-month-view-group-label-width))',
                            }
                          : undefined,
                      },
                      slots.corner?.({ resources: ordered.value.orderedResources }) ??
                        getLabel('resources', props.labels),
                    ),
                    ...labels,
                  ]),
                  ...rows,
                ]),
            ),
          ),
        ],
      )
    }
  },
})

export type ResourcesMonthViewStylesNames = keyof typeof classes
