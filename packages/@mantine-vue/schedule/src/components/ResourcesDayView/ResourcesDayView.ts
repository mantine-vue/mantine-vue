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
  ScheduleEventData,
  ScheduleMode,
  ScheduleResourceData,
  ScheduleResourceGroup,
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
import { useHorizontalEventResize } from '../../hooks/use-horizontal-event-resize'
import { MoreEvents } from '../MoreEvents/MoreEvents'
import { ScheduleEvent } from '../ScheduleEvent/ScheduleEvent'
import { ScheduleHeaderBase } from '../ScheduleHeader/ScheduleHeaderBase'
import { forwardEventSlots, getDropEvent, moveEventTo, resolveScheduleRadius } from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { getOverlapClusters } from './get-overlap-clusters/get-overlap-clusters'
import { getResourcesDayViewEvents } from './get-resources-day-view-events/get-resources-day-view-events'
import classes from './ResourcesDayView.module.css'

export interface ResourceViewDropData extends EventDropData {
  resourceId?: string | number
}

export interface ResourcesDayViewProps {
  date: Date | string
  onDateChange?: (value: DateStringValue) => void
  resources: ScheduleResourceData[]
  startTime?: string
  endTime?: string
  intervalMinutes?: number
  slotLabelFormat?: DateLabelFormat
  radius?: string | number
  startScrollTime?: string
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
  headerFormat?: DateLabelFormat
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
}

export interface ResourcesDayViewSlots {
  header?: (props: { date: DateStringValue; label: VNodeChild }) => VNodeChild
  corner?: (props: { resources: ScheduleResourceData[] }) => VNodeChild
  timeLabel?: (props: { label: VNodeChild; startTime: string; endTime: string }) => VNodeChild
  resourceLabel?: (props: { resource: ScheduleResourceData }) => VNodeChild
  groupLabel?: (props: { group: ScheduleResourceGroup }) => VNodeChild
  timeSlot?: (props: {
    resource: ScheduleResourceData
    startTime: string
    endTime: string
  }) => VNodeChild
  backgroundEvent?: (props: { event: ScheduleEventData }) => VNodeChild
  allDayEvent?: (props: { event: ScheduleEventData }) => VNodeChild
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
  moreEvents?: (props: { events: ScheduleEventData[]; hiddenCount: number }) => VNodeChild
  currentTimeIndicator?: (props: { time: VNodeChild; offset: number }) => VNodeChild
}

function cssSize(value: CSSProperties['width']): string | undefined {
  return typeof value === 'number' ? `${value}px` : value
}

export const ResourcesDayView = defineComponent({
  name: 'ResourcesDayView',
  inheritAttrs: false,
  slots: Object as SlotsType<ResourcesDayViewSlots>,
  props: {
    date: { type: [String, Date] as PropType<Date | string>, required: true },
    onDateChange: Function as PropType<ResourcesDayViewProps['onDateChange']>,
    resources: { type: Array as PropType<ScheduleResourceData[]>, required: true },
    startTime: { type: String, default: '00:00:00' },
    endTime: { type: String, default: '23:59:59' },
    intervalMinutes: { type: Number, default: 60 },
    slotLabelFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'HH:mm' },
    radius: [String, Number] as PropType<string | number>,
    startScrollTime: String,
    scrollAreaProps: Object as PropType<Record<string, unknown>>,
    locale: String,
    withCurrentTimeIndicator: { type: Boolean, default: undefined },
    withCurrentTimeBubble: { type: Boolean, default: true },
    getCurrentTime: Function as PropType<() => AnyDateValue>,
    withHeader: { type: Boolean, default: true },
    onViewChange: Function as PropType<ResourcesDayViewProps['onViewChange']>,
    previousControlProps: Object as PropType<NativeButtonProps>,
    nextControlProps: Object as PropType<NativeButtonProps>,
    todayControlProps: Object as PropType<NativeButtonProps>,
    viewSelectProps: Object as PropType<Partial<ViewSelectProps>>,
    headerFormat: {
      type: [String, Function] as PropType<DateLabelFormat>,
      default: 'MMMM D, YYYY',
    },
    events: Array as PropType<ScheduleEventData[]>,
    slotWidth: { type: [String, Number] as PropType<CSSProperties['width']>, default: 80 },
    rowHeight: { type: [String, Number] as PropType<CSSProperties['height']>, default: 64 },
    labels: Object as PropType<ScheduleLabelsOverride>,
    highlightBusinessHours: Boolean,
    businessHours: {
      type: Array as unknown as PropType<[string, string]>,
      default: () => ['09:00:00', '17:00:00'],
    },
    renderEventBody: Function as PropType<RenderEventBody>,
    renderEvent: Function as PropType<RenderEvent>,
    renderResourceLabel: Function as PropType<ResourcesDayViewProps['renderResourceLabel']>,
    groups: Array as PropType<ScheduleResourceGroup[]>,
    renderGroupLabel: Function as PropType<ResourcesDayViewProps['renderGroupLabel']>,
    groupLabelWidth: { type: [String, Number] as PropType<CSSProperties['width']>, default: 80 },
    withEventsDragAndDrop: Boolean,
    onEventDrop: Function as PropType<ResourcesDayViewProps['onEventDrop']>,
    canDragEvent: Function as PropType<ResourcesDayViewProps['canDragEvent']>,
    onEventDragStart: Function as PropType<ResourcesDayViewProps['onEventDragStart']>,
    onEventDragEnd: Function as PropType<ResourcesDayViewProps['onEventDragEnd']>,
    onTimeSlotClick: Function as PropType<ResourcesDayViewProps['onTimeSlotClick']>,
    onEventClick: Function as PropType<ResourcesDayViewProps['onEventClick']>,
    withDragSlotSelect: Boolean,
    onSlotDragEnd: Function as PropType<ResourcesDayViewProps['onSlotDragEnd']>,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    onExternalEventDrop: Function as PropType<ResourcesDayViewProps['onExternalEventDrop']>,
    withEventResize: Boolean,
    onEventResize: Function as PropType<ResourcesDayViewProps['onEventResize']>,
    canResizeEvent: Function as PropType<ResourcesDayViewProps['canResizeEvent']>,
    recurrenceExpansionLimit: { type: Number, default: 2000 },
    maxEventsPerTimeSlot: { type: Number, default: 2 },
    moreEventsProps: Object as PropType<Record<string, unknown>>,
  },
  setup(props, { attrs, slots }) {
    const theme = useSafeMantineTheme()
    const controls: ResourcesGridControls = []
    const rootElement = ref<HTMLElement | null>(null)
    const rowContainers = new Map<number, HTMLElement>()
    const dropTarget = ref<{ resourceId: string | number; slotIndex: number } | null>(null)
    const scrolled = ref(false)
    const scrolledX = ref(false)
    const intervals = computed(() =>
      getDayTimeIntervals({
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
      }),
    )
    const ordered = computed(() => getOrderedResources(props.resources, props.groups))
    const resourceIdMap = computed(() => getGroupToResourceIdMap(props.resources))
    const expandedEvents = computed(() =>
      expandRecurringEvents({
        events: props.events,
        rangeStart: dayjs(props.date).startOf('day').toDate(),
        rangeEnd: dayjs(props.date).endOf('day').toDate(),
        expansionLimit: props.recurrenceExpansionLimit,
      }),
    )

    onMounted(async () => {
      if (!props.startScrollTime) return
      await nextTick()
      const targetIndex = intervals.value.findIndex(
        (interval) => interval.startTime >= props.startScrollTime!,
      )
      if (targetIndex < 0) return
      const target = controls[0]?.[targetIndex]
      const viewport = rootElement.value?.querySelector<HTMLElement>('.mantine-ScrollArea-viewport')
      if (target && viewport) {
        viewport.scrollLeft = target.offsetLeft
        requestAnimationFrame(() => (viewport.scrollLeft = target.offsetLeft))
      }
    })
    const positioned = computed(() =>
      getResourcesDayViewEvents({
        date: props.date,
        events: expandedEvents.value,
        resources: props.resources,
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
      }),
    )
    const slotSelect = useSlotDragSelect({
      enabled: () => props.withDragSlotSelect && props.mode !== 'static',
      onDragEnd: () => (start, end, group) => {
        const first = intervals.value[start]
        const last = intervals.value[end]
        if (first && last) {
          const date = dayjs(props.date).format('YYYY-MM-DD')
          props.onSlotDragEnd?.({
            rangeStart: `${date} ${first.startTime}`,
            rangeEnd: `${date} ${last.endTime}`,
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

    const emitDrop = (nativeEvent: DragEvent, resourceId: string | number, slotIndex: number) => {
      nativeEvent.preventDefault()
      dropTarget.value = null
      const interval = intervals.value[slotIndex]
      if (!interval) return
      const target = `${dayjs(props.date).format('YYYY-MM-DD')} ${interval.startTime}`
      const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)
      if (event) props.onEventDrop?.({ ...moveEventTo(event, target), resourceId })
      else if (nativeEvent.dataTransfer) {
        props.onExternalEventDrop?.({
          dataTransfer: nativeEvent.dataTransfer,
          dropDateTime: target,
          resourceId,
        })
      }
    }
    const getSlotIndexAtPoint = (nativeEvent: DragEvent, resourceIndex: number) => {
      const container = rowContainers.get(resourceIndex)
      if (!container || intervals.value.length === 0) return -1
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0) return -1
      return Math.max(
        0,
        Math.min(
          intervals.value.length - 1,
          Math.floor(((nativeEvent.clientX - rect.left) / rect.width) * intervals.value.length),
        ),
      )
    }

    const renderGroupCell = (info: ResourceGroupInfo | null | undefined) => {
      if (info === undefined) return null
      if (info === null) return h(Box, { class: classes.resourcesDayViewGroupColumnEmpty })
      const starts = info.position === 'first' || info.position === 'only'
      return h(
        Box,
        { class: classes.resourcesDayViewGroupColumn, 'data-group-position': info.position },
        () =>
          starts
            ? h(
                'span',
                {
                  style:
                    info.count > 1
                      ? {
                          transform: `translateY(calc((${info.count - 1} * (var(--resources-day-view-row-height) + 1px)) / 2))`,
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
      const date = dayjs(props.date).format('YYYY-MM-DD')
      const now = dayjs(props.getCurrentTime?.() ?? new Date())
      const isToday = dayjs(props.date).isSame(now, 'day')
      const showIndicator =
        (props.withCurrentTimeIndicator ?? isToday) &&
        isInTimeRange({ date: now.toDate(), startTime: props.startTime, endTime: props.endTime })
      const indicatorOffset = getCurrentTimePosition({
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
        now,
      })
      const currentTime = formatDate({
        date: now,
        locale: props.locale || 'en',
        format: props.slotLabelFormat,
      })
      const hasGroups = ordered.value.groupRanges.length > 0

      const timeLabels = intervals.value.map((interval) => {
        const label = formatDate({
          date: `${date} ${interval.startTime}`,
          locale: props.locale || 'en',
          format: props.slotLabelFormat,
        })
        const mod = getBusinessHoursMod({
          time: interval.startTime,
          businessHours: props.businessHours,
          highlightBusinessHours: props.highlightBusinessHours,
        })
        return h(
          Box,
          {
            key: interval.startTime,
            class: classes.resourcesDayViewTimeLabel,
            'data-business-hours': mod['business-hours'] || undefined,
            'data-non-business-hours': mod['non-business-hours'] || undefined,
          },
          () =>
            slots.timeLabel?.({
              label,
              startTime: interval.startTime,
              endTime: interval.endTime,
            }) ?? label,
        )
      })

      const rows = ordered.value.orderedResources.map((resource, resourceIndex) => {
        const resourceEvents = positioned.value
        const background = [
          ...(resourceEvents.backgroundTimedEvents[resource.id] || []),
          ...(resourceEvents.backgroundAllDayEvents[resource.id] || []),
        ].map((event) => {
          const colors = theme.value.variantColorResolver({
            color: event.color || theme.value.primaryColor,
            theme: theme.value,
            variant: 'light',
            autoContrast: true,
          })
          return (
            slots.backgroundEvent?.({ event }) ??
            h(
              Box,
              {
                key: `bg-${event.id}`,
                class: classes.resourcesDayViewBackgroundEvent,
                style: {
                  left: `${event.position.top}%`,
                  width: `${event.position.height}%`,
                  top: 0,
                  height: '100%',
                  '--bg-event-bg': colors.background,
                  '--bg-event-color': colors.color,
                },
              },
              () => props.renderEventBody?.(event) ?? slots.eventBody?.({ event }) ?? event.title,
            )
          )
        })
        const allRegular = resourceEvents.regularEvents[resource.id] || []
        const visible = allRegular.filter(
          (event) => event.position.column < Math.max(1, props.maxEventsPerTimeSlot),
        )
        const regular = visible.map((event) => {
          const colors = theme.value.variantColorResolver({
            color: event.color || theme.value.primaryColor,
            theme: theme.value,
            variant: event.variant || 'light',
            autoContrast: true,
          })
          const position = resize.getResizePosition(event.id)
          const left = position?.left ?? event.position.top
          const width = position?.width ?? event.position.height
          const isResizable = resize.isResizableEvent(event)
          const isResizing = position !== null
          const wrapperStyle: CSSProperties = {
            left: `calc(${left}% + 1px)`,
            width: `calc(${width}% - 2px)`,
            top: `${event.position.offset}%`,
            height: `${event.position.width}%`,
          }
          return h(
            Box,
            {
              key: event.id,
              class: classes.resourcesDayViewEventWrapper,
              'data-resizing': isResizing || undefined,
              style: { ...wrapperStyle, '--event-color': colors.color },
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
                      class: classes.resourcesDayViewResizeHandle,
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
                            eventDate: date,
                            pointerEvent,
                          })
                      },
                    }),
                  )
                : null,
            ],
          )
        })
        const allDay = (resourceEvents.allDayEvents[resource.id] || []).map((event, index) =>
          h(
            Box,
            {
              key: `all-${event.id}`,
              class: classes.resourcesDayViewAllDayEvent,
              style: {
                top: `calc(${index} * (var(--resources-day-view-all-day-height) + 2px) + 2px)`,
              },
            },
            () =>
              slots.allDayEvent?.({ event }) ??
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
                  onClick:
                    props.mode === 'static'
                      ? undefined
                      : (nativeEvent: MouseEvent) => props.onEventClick?.(event, nativeEvent),
                  style: { width: '100%', height: '100%' },
                },
                forwardEventSlots(slots),
              ),
          ),
        )
        const more = getOverlapClusters(allRegular)
          .filter((cluster) =>
            cluster.some((event) => event.position.column >= props.maxEventsPerTimeSlot),
          )
          .map((cluster) => {
            const hiddenCount = cluster.filter(
              (event) => event.position.column >= props.maxEventsPerTimeSlot,
            ).length
            const left = Math.min(...cluster.map((event) => event.position.top))
            const right = Math.max(
              ...cluster.map((event) => event.position.top + event.position.height),
            )
            return (
              slots.moreEvents?.({ events: cluster, hiddenCount }) ??
              h(
                MoreEvents,
                {
                  ...props.moreEventsProps,
                  key: `more-${cluster[0].id}`,
                  events: cluster,
                  moreEventsCount: hiddenCount,
                  mode: props.mode,
                  labels: props.labels,
                  renderEventBody: props.renderEventBody,
                  renderEvent: props.renderEvent,
                  onEventClick: props.onEventClick,
                  style: {
                    position: 'absolute',
                    left: `calc(${left}% + 1px)`,
                    width: `calc(${right - left}% - 2px)`,
                    bottom: 0,
                    height: '22px',
                    zIndex: 4,
                  },
                },
                forwardEventSlots(slots),
              )
            )
          })
        const slotGroup = String(resource.id)
        const buttons = intervals.value.map((interval, slotIndex) => {
          const mod = getBusinessHoursMod({
            time: interval.startTime,
            businessHours: props.businessHours,
            highlightBusinessHours: props.highlightBusinessHours,
          })
          return h(
            UnstyledButton,
            {
              key: interval.startTime,
              ref: (element: unknown) => {
                const button = (element as { $el?: HTMLButtonElement } | null)?.$el ?? element
                controls[resourceIndex] ||= []
                controls[resourceIndex][slotIndex] =
                  button instanceof HTMLButtonElement ? button : undefined
              },
              class: classes.resourcesDayViewRowSlot,
              'data-business-hours': mod['business-hours'] || undefined,
              'data-non-business-hours': mod['non-business-hours'] || undefined,
              'data-drop-target':
                dropTarget.value?.resourceId === resource.id &&
                dropTarget.value.slotIndex === slotIndex
                  ? true
                  : undefined,
              'data-drag-selected': slotSelect.isSlotSelected(slotIndex, slotGroup) || undefined,
              'data-static': props.mode === 'static' || undefined,
              'data-drag-slot-index': props.withDragSlotSelect ? slotIndex : undefined,
              'data-drag-slot-group': props.withDragSlotSelect ? slotGroup : undefined,
              'aria-label': `${getLabel('resourceSlot', props.labels)} ${String(resource.label)} ${date} ${interval.startTime} - ${interval.endTime}`,
              tabindex:
                props.mode === 'static' ? -1 : resourceIndex === 0 && slotIndex === 0 ? 0 : -1,
              onKeydown: (event: KeyboardEvent) =>
                handleResourcesGridKeyDown({ controls, resourceIndex, slotIndex, event }),
              onPointerdown:
                props.mode === 'static'
                  ? undefined
                  : (event: PointerEvent) =>
                      slotSelect.handleSlotPointerDown(event, slotIndex, slotGroup),
              onClick:
                props.mode === 'static'
                  ? undefined
                  : (nativeEvent: MouseEvent) =>
                      props.onTimeSlotClick?.({
                        slotStart: `${date} ${interval.startTime}`,
                        slotEnd: `${date} ${interval.endTime}`,
                        nativeEvent,
                        resourceId: resource.id,
                      }),
            },
            () =>
              slots.timeSlot?.({
                resource,
                startTime: interval.startTime,
                endTime: interval.endTime,
              }),
          )
        })
        const groupInfo = hasGroups ? ordered.value.resourceGroupMap[resourceIndex] : undefined
        const allDayCount = resourceEvents.allDayEvents[resource.id]?.length || 0
        return h(Box, { key: resource.id, class: classes.resourcesDayViewRow }, () => [
          renderGroupCell(groupInfo),
          h(
            Box,
            {
              class: classes.resourcesDayViewResourceLabel,
              'data-scrolled-x': scrolledX.value || undefined,
              'data-has-groups': groupInfo !== undefined || undefined,
            },
            () =>
              slots.resourceLabel?.({ resource }) ??
              props.renderResourceLabel?.(resource) ??
              resource.label,
          ),
          h(
            Box,
            {
              class: classes.resourcesDayViewRowSlots,
              ref: (element: unknown) => {
                const node = (element as { $el?: HTMLElement } | null)?.$el ?? element
                if (node instanceof HTMLElement) rowContainers.set(resourceIndex, node)
              },
              style: allDayCount
                ? {
                    minHeight: `max(var(--resources-day-view-row-height), calc(${allDayCount} * (var(--resources-day-view-all-day-height) + 2px) + 4px))`,
                  }
                : undefined,
              onDragover:
                props.withEventsDragAndDrop || props.onExternalEventDrop
                  ? (nativeEvent: DragEvent) => {
                      if (props.mode === 'static') return
                      nativeEvent.preventDefault()
                      const slotIndex = getSlotIndexAtPoint(nativeEvent, resourceIndex)
                      if (
                        slotIndex >= 0 &&
                        (dropTarget.value?.resourceId !== resource.id ||
                          dropTarget.value.slotIndex !== slotIndex)
                      ) {
                        dropTarget.value = { resourceId: resource.id, slotIndex }
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
                      const slotIndex = getSlotIndexAtPoint(nativeEvent, resourceIndex)
                      if (slotIndex >= 0) emitDrop(nativeEvent, resource.id, slotIndex)
                    }
                  : undefined,
            },
            () => [...background, ...allDay, ...regular, ...more, ...buttons],
          ),
        ])
      })

      const headerLabel = formatDate({
        date: props.date,
        locale: props.locale || 'en',
        format: props.headerFormat,
      })
      const header = props.withHeader
        ? (slots.header?.({ date, label: headerLabel }) ??
          h(ScheduleHeaderBase, {
            view: 'day',
            navigationHandlers: {
              previous: () => dayjs(props.date).subtract(1, 'day').format('YYYY-MM-DD'),
              next: () => dayjs(props.date).add(1, 'day').format('YYYY-MM-DD'),
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
        ? (slots.currentTimeIndicator?.({ time: currentTime, offset: indicatorOffset }) ??
          h(
            Box,
            {
              class: classes.resourcesDayViewCurrentTimeIndicator,
              style: {
                '--indicator-left-offset': hasGroups
                  ? `calc(var(--resources-day-view-resource-label-width) + var(--resources-day-view-group-label-width) + (100% - var(--resources-day-view-resource-label-width) - var(--resources-day-view-group-label-width)) * ${indicatorOffset} / 100)`
                  : `calc(var(--resources-day-view-resource-label-width) + (100% - var(--resources-day-view-resource-label-width)) * ${indicatorOffset} / 100)`,
                '--_time-bubble-width': String(currentTime).toLowerCase().includes('m')
                  ? '64px'
                  : '46px',
              },
            },
            () => [
              props.withCurrentTimeBubble
                ? h(
                    'div',
                    { class: classes.resourcesDayViewCurrentTimeIndicatorTimeBubble },
                    currentTime,
                  )
                : h('div', { class: classes.resourcesDayViewCurrentTimeIndicatorThumb }),
              h('div', { class: classes.resourcesDayViewCurrentTimeIndicatorLine }),
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
          class: [classes.resourcesDayView, attrs.class],
          style: [
            {
              '--resources-day-view-radius': resolveScheduleRadius(props.radius),
              '--resources-day-view-slot-width': cssSize(props.slotWidth),
              '--resources-day-view-row-height': cssSize(props.rowHeight),
              '--resources-day-view-group-label-width': cssSize(props.groupLabelWidth),
            },
            attrs.style,
          ],
          'data-resizing': resize.state.value ? true : undefined,
          'data-event-interaction': resize.state.value ? true : undefined,
        },
        () => [
          header,
          h(Box, { class: classes.resourcesDayViewRoot }, () =>
            h(
              ScrollArea,
              {
                scrollbarSize: 4,
                ...props.scrollAreaProps,
                class: classes.resourcesDayViewScrollArea,
                onScrollPositionChange: (position: { x: number; y: number }) => {
                  scrolled.value = position.y !== 0
                  scrolledX.value = position.x !== 0
                },
              },
              () =>
                h('div', { class: classes.resourcesDayViewInner }, [
                  h(
                    Box,
                    {
                      class: classes.resourcesDayViewTimeLabelsRow,
                      'data-scrolled': scrolled.value || undefined,
                    },
                    () => [
                      h(
                        'div',
                        {
                          class: classes.resourcesDayViewCorner,
                          style: hasGroups
                            ? {
                                flexBasis:
                                  'calc(var(--resources-day-view-resource-label-width) + var(--resources-day-view-group-label-width))',
                                minWidth:
                                  'calc(var(--resources-day-view-resource-label-width) + var(--resources-day-view-group-label-width))',
                              }
                            : undefined,
                        },
                        slots.corner?.({ resources: ordered.value.orderedResources }) ??
                          getLabel('resources', props.labels),
                      ),
                      ...timeLabels,
                    ],
                  ),
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

export type ResourcesDayViewStylesNames = keyof typeof classes
