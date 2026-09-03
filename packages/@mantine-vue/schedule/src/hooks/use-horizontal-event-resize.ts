import dayjs from 'dayjs'
import { onBeforeUnmount, shallowRef } from 'vue'
import { rafThrottle } from '../components/shared'
import type { EventDropData } from '../component-props'
import type { DateTimeStringValue, ScheduleEventData, ScheduleMode } from '../types'
import { clampIntervalMinutes, parseTimeString } from '../utils'

type ResizeEdge = 'start' | 'end'

interface ResizeState {
  event: ScheduleEventData
  edge: ResizeEdge
  container: HTMLElement
  originalLeft: number
  originalWidth: number
  currentLeft: number
  currentWidth: number
  eventDate: string
  originalStart: DateTimeStringValue
  originalEnd: DateTimeStringValue
  dayIndex: number
  dayCount: number
}

export function useHorizontalEventResize(input: {
  enabled: () => boolean
  mode: () => ScheduleMode
  startTime: () => string
  endTime: () => string
  intervalMinutes: () => number
  resizeIntervalMinutes?: () => number | undefined
  onEventResize: (data: EventDropData) => void
  canResizeEvent: () => ((event: ScheduleEventData) => boolean) | undefined
}) {
  const state = shallowRef<ResizeState | null>(null)
  let justResized = false
  let savedUserSelect = ''

  const metrics = () => {
    const start = parseTimeString(input.startTime())
    const end = parseTimeString(input.endTime())
    const startMinutes = start.hours * 60 + start.minutes
    const literalRange = end.hours * 60 + end.minutes - startMinutes
    const interval = clampIntervalMinutes(
      input.resizeIntervalMinutes?.() ?? input.intervalMinutes(),
    )
    const total = Math.ceil(literalRange / interval) * interval
    return { startMinutes, literalRange, interval, total, minWidth: (interval / total) * 100 }
  }
  const snap = (percent: number) => {
    const { literalRange, interval, total } = metrics()
    const minutes = Math.max(
      0,
      Math.min(literalRange, Math.round(((percent / 100) * total) / interval) * interval),
    )
    return (minutes / total) * 100
  }
  const toDateTime = (percent: number, date: string): DateTimeStringValue => {
    const { startMinutes, total } = metrics()
    const minutes = startMinutes + Math.round((snap(percent) / 100) * total)
    return `${date} ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:00`
  }
  /**
   * Coalesced to one animation frame: `pointermove` outruns paint, and each step reads layout
   * and re-renders the grid.
   */
  const move = rafThrottle((clientX: number) => {
    if (!state.value) return
    const rect = state.value.container.getBoundingClientRect()
    const dayWidth = rect.width / state.value.dayCount
    const raw = ((clientX - rect.left - state.value.dayIndex * dayWidth) / dayWidth) * 100
    const point = snap(raw)
    const { minWidth } = metrics()
    const current = state.value
    if (current.edge === 'end') {
      current.currentWidth = Math.max(minWidth, point - current.originalLeft)
    } else {
      const right = current.originalLeft + current.originalWidth
      current.currentLeft = Math.min(point, right - minWidth)
      current.currentWidth = right - current.currentLeft
    }
    state.value = { ...current }
  })
  const trackPointer = (event: PointerEvent) => move(event.clientX)
  const cleanup = () => {
    move.cancel()
    document.removeEventListener('pointermove', trackPointer)
    document.removeEventListener('pointerup', finish)
    document.body.style.userSelect = savedUserSelect
  }
  const finish = () => {
    // Drop the pending frame first, so a stale step cannot land after the gesture ended.
    move.cancel()
    const current = state.value
    if (
      current &&
      (current.currentLeft !== current.originalLeft ||
        current.currentWidth !== current.originalWidth)
    ) {
      input.onEventResize({
        eventId: current.event.id,
        newStart:
          current.edge === 'start'
            ? toDateTime(current.currentLeft, current.eventDate)
            : current.originalStart,
        newEnd:
          current.edge === 'end'
            ? toDateTime(current.currentLeft + current.currentWidth, current.eventDate)
            : current.originalEnd,
        event: current.event,
      })
    }
    state.value = null
    cleanup()
    justResized = true
    requestAnimationFrame(() => (justResized = false))
  }
  const handleResizeStart = (params: {
    event: ScheduleEventData
    edge: ResizeEdge
    container: HTMLElement
    originalLeft: number
    originalWidth: number
    eventDate: string
    pointerEvent: PointerEvent
    dayIndex?: number
    dayCount?: number
  }) => {
    if (!input.enabled() || input.mode() === 'static') return
    params.pointerEvent.preventDefault()
    params.pointerEvent.stopPropagation()
    state.value = {
      ...params,
      currentLeft: params.originalLeft,
      currentWidth: params.originalWidth,
      originalStart: dayjs(params.event.start).format('YYYY-MM-DD HH:mm:ss'),
      originalEnd: dayjs(params.event.end).format('YYYY-MM-DD HH:mm:ss'),
      dayIndex: params.dayIndex ?? 0,
      dayCount: params.dayCount ?? 1,
    }
    savedUserSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    document.addEventListener('pointermove', trackPointer)
    document.addEventListener('pointerup', finish)
  }
  onBeforeUnmount(cleanup)
  return {
    state,
    handleResizeStart,
    getResizePosition: (id: string | number) =>
      state.value?.event.id === id
        ? { left: state.value.currentLeft, width: state.value.currentWidth }
        : null,
    isResizableEvent: (event: ScheduleEventData) =>
      input.enabled() &&
      input.mode() !== 'static' &&
      event.display !== 'background' &&
      (input.canResizeEvent()?.(event) ?? true),
    wasResizing: () => justResized,
  }
}
