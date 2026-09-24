import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export interface ResizeObserverDimensions {
  width: number
  height: number
  contentWidth: number
  contentHeight: number
}

function getEl(value: any): HTMLElement | null {
  if (!value) return null
  return (value.$el ?? value) as HTMLElement | null
}

export function useDimensions(element: Ref<any>) {
  const dimensions = ref<ResizeObserverDimensions | null>(null)
  let observer: ResizeObserver | null = null
  let frame = 0

  onMounted(() => {
    const el = getEl(element.value)
    if (!el || typeof ResizeObserver === 'undefined') {
      return
    }

    observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const nextDimensions = {
          width: entry.borderBoxSize?.[0]?.inlineSize ?? entry.target.clientWidth,
          height: entry.borderBoxSize?.[0]?.blockSize ?? entry.target.clientHeight,
          contentWidth: entry.contentRect.width,
          contentHeight: entry.contentRect.height,
        }

        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          dimensions.value = nextDimensions
        })
      }
    })
    observer.observe(el)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
  })
  return dimensions
}
