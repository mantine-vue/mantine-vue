import {
  inject,
  onScopeDispose,
  provide,
  shallowRef,
  type InjectionKey,
  type ShallowRef,
} from 'vue'
import type { DropTarget, ScheduleEventData } from '../../types'

export interface DragContextValue {
  readonly draggedEvent: ScheduleEventData | null

  readonly dragOverTarget: DropTarget | null

  readonly isDragging: boolean

  readonly isSlotDragging: boolean
}

const IDLE: DragContextValue = {
  draggedEvent: null,
  dragOverTarget: null,
  isDragging: false,
  isSlotDragging: false,
}

export const DragContext: InjectionKey<DragContextValue> = Symbol('mantine-schedule-drag-context')

export function provideDragContext(value: DragContextValue) {
  provide(DragContext, value)
}

/**
 * Reads the drag state of the surrounding view. Components rendered outside a schedule get an
 * idle state rather than `undefined`, so they never have to null-check it.
 */
export function useDragContext(): DragContextValue {
  return inject(DragContext, IDLE)
}

export interface ScheduleDragState {
  draggedEvent: ShallowRef<ScheduleEventData | null>

  startEventDrag: (event: ScheduleEventData) => void

  /**
   * Ends the drag. Safe to call more than once: only the first call after a `startEventDrag`
   * takes effect, so the component's own `dragend` and the document safety net cannot both
   * report the same drag.
   */
  endEventDrag: () => void
}

export interface ProvideScheduleDragStateInput {
  /** Slot the pointer is currently over, owned by the view because it also drives the highlight. */
  dragOverTarget?: () => DropTarget | null

  isSlotDragging?: () => boolean

  /**
   * Called exactly once per drag, however it ended: dropped, cancelled, or ended after the
   * dragged element was already replaced. Use it to clear view-local drag state.
   */
  onDragEnd?: () => void
}

/**
 * Publishes the view's drag state to the events it renders, so an event can tell that *some*
 * other event is being dragged and dim itself.
 *
 * The context is a getter-backed object rather than a snapshot: it is provided once during
 * `setup`, and every read stays reactive as the drag progresses.
 *
 * The end of a drag is detected on `document` rather than only through the dragged event's own
 * `dragend`. A successful drop usually makes the consumer move the event, which re-renders it
 * under a different key: the original element is gone by the time the browser would fire
 * `dragend` on it, so that event never arrives. Relying on it alone would leave the schedule
 * stuck in the dragging state, with every event non-interactive.
 */
export function provideScheduleDragState(
  input: ProvideScheduleDragStateInput = {},
): ScheduleDragState {
  const draggedEvent = shallowRef<ScheduleEventData | null>(null)

  provideDragContext({
    get draggedEvent() {
      return draggedEvent.value
    },
    get dragOverTarget() {
      return input.dragOverTarget?.() ?? null
    },
    get isDragging() {
      return draggedEvent.value !== null
    },
    get isSlotDragging() {
      return input.isSlotDragging?.() ?? false
    },
  })

  const endEventDrag = () => {
    if (draggedEvent.value === null) {
      return
    }

    draggedEvent.value = null
    stopWatchingDocument()
    input.onDragEnd?.()
  }

  // Capture phase, so the drag cannot be left open by a handler that stops propagation.
  const watchOptions = { capture: true } as const

  function startWatchingDocument() {
    document.addEventListener('drop', endEventDrag, watchOptions)
    document.addEventListener('dragend', endEventDrag, watchOptions)
  }

  function stopWatchingDocument() {
    document.removeEventListener('drop', endEventDrag, watchOptions)
    document.removeEventListener('dragend', endEventDrag, watchOptions)
  }

  onScopeDispose(stopWatchingDocument, true)

  return {
    draggedEvent,
    startEventDrag: (event) => {
      if (draggedEvent.value === null) {
        startWatchingDocument()
      }

      draggedEvent.value = event
    },
    endEventDrag,
  }
}
