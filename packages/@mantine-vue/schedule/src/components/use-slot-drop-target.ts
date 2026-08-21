import { shallowRef } from 'vue'
import type { DateStringValue, DateTimeStringValue } from '../types'
import { rafThrottle } from './shared'

export interface SlotDropTarget {
  date: DateStringValue

  slotIndex: number
}

export interface SlotDropInterval {
  startTime: string
}

export interface ResolveSlotInput {
  container: HTMLElement | null | undefined

  date: DateStringValue

  intervals: SlotDropInterval[]
}

export interface ResolvedSlotDrop {
  slotIndex: number
  target: DateTimeStringValue
}

function resolveSlotIndex(
  { container, intervals }: ResolveSlotInput,
  clientY: number,
  eventTarget: Element | null,
) {
  if (!container || intervals.length === 0) {
    return -1
  }

  // Fast path: the pointer is over a slot, so the index is already on the element.
  const slot = eventTarget?.closest<HTMLElement>('[data-time-slot-index]')

  if (slot && container.contains(slot)) {
    const index = Number(slot.dataset.timeSlotIndex)

    if (Number.isInteger(index)) {
      return index
    }
  }

  // Slow path: the pointer is over an event or a gap, so the slots have to be measured. This
  // reads layout, which is why the caller only ever reaches it once per animation frame.
  const slots = container.querySelectorAll<HTMLElement>('[data-time-slot-index]')

  return Array.from(slots).findIndex((element) => {
    const rect = element.getBoundingClientRect()
    return clientY >= rect.top && clientY <= rect.bottom
  })
}

/**
 * Tracks the time slot a drag is hovering over.
 *
 * `dragover` fires many times per frame and the fallback that measures slots reads layout, so
 * resolving the target on every event makes the highlight lag behind the pointer and keep
 * catching up after it stops. The resolution is therefore coalesced to one animation frame, the
 * state is only written when the slot actually changes, and any pending frame is dropped as soon
 * as the drag leaves or the drop happens — so nothing lands after the fact.
 */
export function useSlotDropTarget() {
  const dropTarget = shallowRef<SlotDropTarget | null>(null)

  const setTarget = (next: SlotDropTarget | null) => {
    const current = dropTarget.value

    if (current === next) {
      return
    }

    if (current && next && current.date === next.date && current.slotIndex === next.slotIndex) {
      return
    }

    dropTarget.value = next
  }

  const resolveLater = rafThrottle(
    (input: ResolveSlotInput, clientY: number, eventTarget: Element | null) => {
      const slotIndex = resolveSlotIndex(input, clientY, eventTarget)
      setTarget(slotIndex < 0 ? null : { date: input.date, slotIndex })
    },
  )

  const reset = () => {
    resolveLater.cancel()
    setTarget(null)
  }

  return {
    dropTarget,

    isTarget: (date: DateStringValue, slotIndex: number) =>
      dropTarget.value?.date === date && dropTarget.value.slotIndex === slotIndex,

    /**
     * Accepts the drag and schedules the target update. `preventDefault` and `dropEffect` run
     * synchronously because the browser reads them as the handler returns.
     */
    dragOver: (nativeEvent: DragEvent, input: ResolveSlotInput) => {
      nativeEvent.preventDefault()

      if (nativeEvent.dataTransfer) {
        nativeEvent.dataTransfer.dropEffect = nativeEvent.dataTransfer.types.includes(
          'application/json',
        )
          ? 'move'
          : 'copy'
      }

      resolveLater(
        input,
        nativeEvent.clientY,
        nativeEvent.target instanceof Element ? nativeEvent.target : null,
      )
    },

    dragLeave: (nativeEvent: DragEvent, container: HTMLElement | null | undefined) => {
      if (
        !(nativeEvent.relatedTarget instanceof Node) ||
        !container?.contains(nativeEvent.relatedTarget)
      ) {
        reset()
      }
    },

    drop: (nativeEvent: DragEvent, input: ResolveSlotInput): ResolvedSlotDrop | undefined => {
      const slotIndex = resolveSlotIndex(
        input,
        nativeEvent.clientY,
        nativeEvent.target instanceof Element ? nativeEvent.target : null,
      )

      reset()

      const interval = input.intervals[slotIndex]

      return interval
        ? { slotIndex, target: `${input.date} ${interval.startTime}` as DateTimeStringValue }
        : undefined
    },

    reset,
  }
}
