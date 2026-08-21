import { onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'
import { rafThrottle } from './shared'

interface SelectedRange {
  group: string
  start: number
  end: number
}

interface DragState {
  group: string
  startIndex: number
  currentIndex: number
}

export interface UseSlotDragSelectInput {
  enabled: () => boolean

  onDragEnd?: (startIndex: number, endIndex: number, group: string) => void
}

export interface SlotDragSelect {
  handleSlotPointerDown: (event: PointerEvent, index: number, group: string) => void

  isSlotSelected: (index: number, group: string) => boolean

  isDragging: () => boolean
}

/**
 * Slot drag-selection shared by the day, week and month views. It tracks a selected range as the
 * pointer moves across elements carrying `data-drag-slot-index` / `data-drag-slot-group`.
 *
 * Hit testing goes through `elementsFromPoint`, which reads layout, so it is coalesced to one
 * animation frame: a fast pointer would otherwise queue up more hit tests and re-renders than the
 * browser can paint, and the selection would keep growing after the pointer stopped.
 */
export function useSlotDragSelect(input: UseSlotDragSelectInput): SlotDragSelect {
  const selectedRange = shallowRef<SelectedRange | null>(null)
  let drag: DragState | null = null
  let savedUserSelect = ''

  const resolveIndexAt = rafThrottle((clientX: number, clientY: number) => {
    if (!drag) {
      return
    }

    for (const element of document.elementsFromPoint(clientX, clientY)) {
      const indexAttr = element.getAttribute?.('data-drag-slot-index')
      const groupAttr = element.getAttribute?.('data-drag-slot-group')

      if (indexAttr == null || groupAttr == null) {
        continue
      }

      if (groupAttr === drag.group) {
        const nextIndex = Number(indexAttr)

        if (!Number.isNaN(nextIndex) && nextIndex !== drag.currentIndex) {
          drag.currentIndex = nextIndex
          selectedRange.value = {
            group: groupAttr,
            start: Math.min(drag.startIndex, nextIndex),
            end: Math.max(drag.startIndex, nextIndex),
          }
        }
      }

      // The topmost slot under the pointer decides; anything below it is covered.
      break
    }
  })

  const handlePointerMove = (event: PointerEvent) => {
    if (drag) {
      resolveIndexAt(event.clientX, event.clientY)
    }
  }

  const handlePointerUp = () => {
    // Drop the pending hit test first: the gesture is over, so its result is stale by definition.
    resolveIndexAt.cancel()

    if (drag) {
      const { startIndex, currentIndex, group } = drag

      if (startIndex !== currentIndex) {
        input.onDragEnd?.(
          Math.min(startIndex, currentIndex),
          Math.max(startIndex, currentIndex),
          group,
        )
      }
    }

    drag = null
    selectedRange.value = null
  }

  const removeListeners = () => {
    resolveIndexAt.cancel()
    document.body.style.userSelect = savedUserSelect
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  watch(
    () => selectedRange.value !== null,
    (isDragging) => {
      if (isDragging) {
        savedUserSelect = document.body.style.userSelect
        document.body.style.userSelect = 'none'
        document.addEventListener('pointermove', handlePointerMove)
        document.addEventListener('pointerup', handlePointerUp)
      } else {
        removeListeners()
      }
    },
  )

  onBeforeUnmount(() => {
    if (selectedRange.value !== null) {
      removeListeners()
    }
  })

  const handleSlotPointerDown = (_event: PointerEvent, index: number, group: string) => {
    if (!input.enabled()) {
      return
    }

    drag = { group, startIndex: index, currentIndex: index }
    selectedRange.value = { group, start: index, end: index }
  }

  const isSlotSelected = (index: number, group: string) => {
    const range = selectedRange.value

    if (!range || range.group !== group) {
      return false
    }

    return index >= range.start && index <= range.end
  }

  const isDragging = () => selectedRange.value !== null

  return { handleSlotPointerDown, isSlotSelected, isDragging }
}

export type SelectedRangeRef = Ref<SelectedRange | null>
