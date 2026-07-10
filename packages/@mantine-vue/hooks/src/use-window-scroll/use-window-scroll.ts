import { onMounted, ref, type Ref } from 'vue'
import { useWindowEvent } from '../use-window-event/use-window-event'

export interface UseWindowScrollPosition {
  x: number
  y: number
}

export type UseWindowScrollTo = (position: Partial<UseWindowScrollPosition>) => void
export type UseWindowScrollReturnValue = [Ref<UseWindowScrollPosition>, UseWindowScrollTo]

function getScrollPosition(): UseWindowScrollPosition {
  return typeof window !== 'undefined' ? { x: window.scrollX, y: window.scrollY } : { x: 0, y: 0 }
}

function scrollTo({ x, y }: Partial<UseWindowScrollPosition>): void {
  if (typeof window !== 'undefined') {
    const scrollOptions: ScrollToOptions = { behavior: 'smooth' }

    if (typeof x === 'number') {
      scrollOptions.left = x
    }

    if (typeof y === 'number') {
      scrollOptions.top = y
    }

    window.scrollTo(scrollOptions)
  }
}

export function useWindowScroll(): UseWindowScrollReturnValue {
  const position = ref<UseWindowScrollPosition>({ x: 0, y: 0 }) as Ref<UseWindowScrollPosition>

  useWindowEvent('scroll', () => (position.value = getScrollPosition()), { passive: true })
  useWindowEvent('resize', () => (position.value = getScrollPosition()), { passive: true })

  onMounted(() => {
    position.value = getScrollPosition()
  })

  return [position, scrollTo] as const
}
