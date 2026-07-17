import { inject, provide, type InjectionKey } from 'vue'
import type { DropTarget, ScheduleEventData } from '../../types'

export interface DragContextValue {
  draggedEvent: ScheduleEventData | null
  dragOverTarget: DropTarget | null
  isDragging: boolean
  isSlotDragging: boolean
}

export const DragContext: InjectionKey<DragContextValue> = Symbol('mantine-schedule-drag-context')

export function provideDragContext(value: DragContextValue) {
  provide(DragContext, value)
}

export function useDragContext() {
  return inject(DragContext, {
    draggedEvent: null,
    dragOverTarget: null,
    isDragging: false,
    isSlotDragging: false,
  })
}
