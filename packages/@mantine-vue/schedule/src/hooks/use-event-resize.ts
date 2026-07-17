import dayjs from 'dayjs'
import { onBeforeUnmount, ref } from 'vue'
import type { EventDropData } from '../component-props'
import type { DateTimeStringValue, ScheduleEventData, ScheduleMode } from '../types'
import { clampIntervalMinutes, parseTimeString } from '../utils'

type ResizeEdge = 'top' | 'bottom'

interface ResizeState {
  eventId: string | number
  event: ScheduleEventData
  edge: ResizeEdge
  container: HTMLElement
  originalTop: number
  originalHeight: number
  currentTop: number
  currentHeight: number
  eventDate: string
  originalStart: DateTimeStringValue
  originalEnd: DateTimeStringValue
  startMinutes: number
  literalRange: number
  totalMinutes: number
  intervalMinutes: number
  minHeightPercent: number
}

interface HandleResizeStartInput {
  event: ScheduleEventData
  edge: ResizeEdge
  container: HTMLElement
  originalTop: number
  originalHeight: number
  eventDate: string
  pointerEvent: PointerEvent
}

export interface UseEventResizeInput {
  enabled: () => boolean
  mode: () => ScheduleMode
  startTime: () => string
  endTime: () => string
  intervalMinutes: () => number
  onEventResize: () => ((data: EventDropData) => void) | undefined
  canResizeEvent: () => ((event: ScheduleEventData) => boolean) | undefined
}

export function useEventResize(input: UseEventResizeInput) {
  const resizeState = ref<ResizeState | null>(null)
  let justResized = false
  let savedUserSelect: string | null = null

  const clampAndSnap = (minutes: number, state: ResizeState): number => {
    const snapped = Math.round(minutes / state.intervalMinutes) * state.intervalMinutes
    return Math.max(0, Math.min(state.literalRange, snapped))
  }

  const snapPercent = (percent: number, state: ResizeState): number => {
    const minutes = (percent / 100) * state.totalMinutes
    return (clampAndSnap(minutes, state) / state.totalMinutes) * 100
  }

  const percentToDateTime = (
    percent: number,
    eventDate: string,
    state: ResizeState,
  ): DateTimeStringValue => {
    const minutes = (percent / 100) * state.totalMinutes
    const totalMinutes = state.startMinutes + clampAndSnap(minutes, state)
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${eventDate} ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`
  }

  const handlePointerMove = (event: PointerEvent) => {
    const state = resizeState.value
    if (!state) return

    const containerRect = state.container.getBoundingClientRect()
    if (containerRect.height === 0) return

    const relativeY = event.clientY - containerRect.top
    const rawPercent = Math.max(0, Math.min(100, (relativeY / containerRect.height) * 100))
    const snappedPercent = snapPercent(rawPercent, state)
    let currentTop = state.originalTop
    let currentHeight = state.originalHeight

    if (state.edge === 'bottom') {
      currentHeight = Math.max(state.minHeightPercent, snappedPercent - state.originalTop)
    } else {
      const originalBottom = state.originalTop + state.originalHeight
      currentTop = Math.min(snappedPercent, originalBottom - state.minHeightPercent)
      currentHeight = originalBottom - currentTop
    }

    resizeState.value = { ...state, currentTop, currentHeight }
  }

  const removeDocumentListeners = () => {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    if (savedUserSelect !== null) {
      document.body.style.userSelect = savedUserSelect
      savedUserSelect = null
    }
  }

  const handlePointerUp = () => {
    const state = resizeState.value
    if (
      state &&
      (state.currentTop !== state.originalTop || state.currentHeight !== state.originalHeight)
    ) {
      const newStart =
        state.edge === 'top'
          ? percentToDateTime(state.currentTop, state.eventDate, state)
          : state.originalStart
      const newEnd =
        state.edge === 'bottom'
          ? percentToDateTime(state.currentTop + state.currentHeight, state.eventDate, state)
          : state.originalEnd

      input.onEventResize()?.({ eventId: state.eventId, newStart, newEnd, event: state.event })
    }

    resizeState.value = null
    removeDocumentListeners()
    justResized = true
    requestAnimationFrame(() => {
      justResized = false
    })
  }

  const handleResizeStart = ({
    event,
    edge,
    container,
    originalTop,
    originalHeight,
    eventDate,
    pointerEvent,
  }: HandleResizeStartInput) => {
    if (!input.enabled() || input.mode() === 'static') return

    pointerEvent.preventDefault()
    pointerEvent.stopPropagation()

    const parsedStartTime = parseTimeString(input.startTime())
    const parsedEndTime = parseTimeString(input.endTime())
    const startMinutes = parsedStartTime.hours * 60 + parsedStartTime.minutes
    const endMinutes = parsedEndTime.hours * 60 + parsedEndTime.minutes
    const intervalMinutes = clampIntervalMinutes(input.intervalMinutes())
    const literalRange = endMinutes - startMinutes
    const totalMinutes = Math.ceil(literalRange / intervalMinutes) * intervalMinutes

    resizeState.value = {
      eventId: event.id,
      event,
      edge,
      container,
      originalTop,
      originalHeight,
      currentTop: originalTop,
      currentHeight: originalHeight,
      eventDate,
      originalStart: dayjs(event.start).format('YYYY-MM-DD HH:mm:ss'),
      originalEnd: dayjs(event.end).format('YYYY-MM-DD HH:mm:ss'),
      startMinutes,
      literalRange,
      totalMinutes,
      intervalMinutes,
      minHeightPercent: (intervalMinutes / totalMinutes) * 100,
    }

    savedUserSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

  const getResizePosition = (eventId: string | number) => {
    const state = resizeState.value
    return state?.eventId === eventId
      ? { top: state.currentTop, height: state.currentHeight }
      : null
  }

  const isResizableEvent = (event: ScheduleEventData): boolean =>
    input.enabled() &&
    input.mode() !== 'static' &&
    event.display !== 'background' &&
    (input.canResizeEvent()?.(event) ?? true)

  onBeforeUnmount(removeDocumentListeners)

  return {
    handleResizeStart,
    getResizePosition,
    isResizableEvent,
    wasResizing: () => justResized,
  }
}
