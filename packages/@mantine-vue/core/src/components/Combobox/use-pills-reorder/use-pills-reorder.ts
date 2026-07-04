import { ref } from 'vue'
import { movePill, type PillReorderPosition } from '../data-utils'
export interface PillReorderProps {
  draggable: boolean
  tabIndex: number
  'data-mantine-pill-index': number
  'aria-keyshortcuts': string
  [key: string]: any
}
export interface UsePillsReorderInput<T> {
  value: T[]
  onChange: (value: T[]) => void
  enabled?: boolean
}
export function usePillsReorder<T>(input: UsePillsReorderInput<T>) {
  const container = ref<HTMLElement | null>(null)
  let dragged: number | null = null
  const getListProps = () =>
    input.enabled ? { ref: (node: any) => (container.value = node?.$el ?? node) } : {}
  const getPillProps = (index: number): PillReorderProps | undefined =>
    input.enabled
      ? {
          draggable: true,
          tabIndex: -1,
          'data-mantine-pill-index': index,
          'aria-keyshortcuts': 'Alt+ArrowLeft Alt+ArrowRight',
          onMousedown: (event: MouseEvent) => event.button === 0 && event.stopPropagation(),
          onDragstart: (event: DragEvent) => {
            dragged = index
            event.dataTransfer?.setData('text/plain', String(index))
          },
          onDragover: (event: DragEvent) => {
            if (dragged === null || dragged === index) return
            event.preventDefault()
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
            ;(event.currentTarget as HTMLElement).setAttribute(
              'data-drag-over',
              event.clientX - rect.left < rect.width / 2 ? 'before' : 'after',
            )
          },
          onDrop: (event: DragEvent) => {
            event.preventDefault()
            const target = event.currentTarget as HTMLElement
            const position = target.getAttribute('data-drag-over') as PillReorderPosition | null
            target.removeAttribute('data-drag-over')
            if (dragged !== null && position)
              input.onChange(movePill(input.value, dragged, index, position))
            dragged = null
          },
          onDragend: (event: DragEvent) => {
            ;(event.currentTarget as HTMLElement).removeAttribute('data-dragging')
            dragged = null
          },
          onKeydown: (event: KeyboardEvent) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            const forward = event.key === 'ArrowRight'
            const target = index + (forward ? 1 : -1)
            if (event.altKey && target >= 0 && target < input.value.length) {
              event.preventDefault()
              input.onChange(movePill(input.value, index, target, forward ? 'after' : 'before'))
            } else
              container.value
                ?.querySelector<HTMLElement>(`[data-mantine-pill-index="${target}"]`)
                ?.focus()
          },
        }
      : undefined
  const handleInputKeyDown = (event: KeyboardEvent) => {
    const inputElement = event.currentTarget as HTMLInputElement
    if (
      !input.enabled ||
      event.key !== 'ArrowLeft' ||
      (inputElement.value && inputElement.selectionStart !== 0)
    )
      return
    const pills = container.value?.querySelectorAll<HTMLElement>('[data-mantine-pill-index]')
    if (pills?.length) {
      event.preventDefault()
      pills[pills.length - 1].focus()
    }
  }
  return { getPillProps, getListProps, handleInputKeyDown }
}
