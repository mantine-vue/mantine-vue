import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

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
  /** Whether slot drag selection is enabled */
  enabled: () => boolean
  /** Called with the selected range once a multi-slot drag finishes */
  onDragEnd?: () => ((startIndex: number, endIndex: number, group: string) => void) | undefined
}

export interface SlotDragSelect {
  /** Begin a slot selection at the given index/group */
  handleSlotPointerDown: (event: PointerEvent, index: number, group: string) => void
  /** Whether the slot at index within group is currently selected */
  isSlotSelected: (index: number, group: string) => boolean
  /** Whether a slot drag selection is currently in progress */
  isDragging: () => boolean
}

/**
 * Composable that provides unified slot drag-selection for Day, Week and Month views.
 * tracks a selected range as the pointer
 * moves across elements carrying `data-drag-slot-index` / `data-drag-slot-group`.
 */
export function useSlotDragSelect(input: UseSlotDragSelectInput): SlotDragSelect {
  const selectedRange = ref<SelectedRange | null>(null)
  let drag: DragState | null = null
  let savedUserSelect = ''

  const handlePointerMove = (event: PointerEvent) => {
    if (!drag) return
    const elements = document.elementsFromPoint(event.clientX, event.clientY)
    for (const el of elements) {
      const element = el as HTMLElement
      const indexAttr = element.getAttribute?.('data-drag-slot-index')
      const groupAttr = element.getAttribute?.('data-drag-slot-group')
      if (indexAttr != null && groupAttr != null) {
        if (groupAttr === drag.group) {
          const newIndex = Number(indexAttr)
          if (!Number.isNaN(newIndex) && newIndex !== drag.currentIndex) {
            drag.currentIndex = newIndex
            selectedRange.value = {
              group: groupAttr,
              start: Math.min(drag.startIndex, newIndex),
              end: Math.max(drag.startIndex, newIndex),
            }
          }
        }
        break
      }
    }
  }

  const handlePointerUp = () => {
    if (drag) {
      const { startIndex, currentIndex, group } = drag
      if (startIndex !== currentIndex) {
        input.onDragEnd?.()?.(
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
    if (selectedRange.value !== null) removeListeners()
  })

  const handleSlotPointerDown = (_event: PointerEvent, index: number, group: string) => {
    if (!input.enabled()) return
    drag = { group, startIndex: index, currentIndex: index }
    selectedRange.value = { group, start: index, end: index }
  }

  const isSlotSelected = (index: number, group: string) => {
    const range = selectedRange.value
    if (!range || range.group !== group) return false
    return index >= range.start && index <= range.end
  }

  const isDragging = () => selectedRange.value !== null

  return { handleSlotPointerDown, isSlotSelected, isDragging }
}

export type SelectedRangeRef = Ref<SelectedRange | null>
