import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}

export interface UseResizeObserverReturnValue<T extends Element = HTMLElement> {
  ref: Ref<T | null>
  rect: Ref<ObserverRect>
}

export function useResizeObserver<T extends Element = HTMLElement>(
  options?: ResizeObserverOptions,
): UseResizeObserverReturnValue<T> {
  const elementRef = ref<T | null>(null) as Ref<T | null>
  const rect = ref<ObserverRect>(defaultState) as Ref<ObserverRect>
  let observer: ResizeObserver | undefined
  let frameId = 0

  const disconnect = () => {
    observer?.disconnect()
    observer = undefined
    if (frameId) {
      cancelAnimationFrame(frameId)
      frameId = 0
    }
  }

  // Resize updates are batched to the next animation frame to avoid layout thrashing.
  // `flush: 'sync'` is required (not the default 'pre' scheduling) so that
  // the observer is created and `.observe()` is called the instant the
  // template ref binds the DOM node — i.e. synchronously within the same
  // `mount()` call, matching the timing guarantee the original
  // `onMounted`-based implementation gave callers/tests. With default flush
  // timing, this would only run after a microtask tick, so code that reads
  // `elementRef`/attaches to the observer immediately after `mount()`
  // (without an intervening `nextTick()`) would see nothing attached yet.
  watch(
    elementRef,
    (node) => {
      disconnect()

      if (!node || typeof ResizeObserver === 'undefined') {
        return
      }

      observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry) {
          cancelAnimationFrame(frameId)
          frameId = requestAnimationFrame(() => {
            const boxSize = entry.borderBoxSize?.[0] || entry.contentBoxSize?.[0]
            if (boxSize) {
              rect.value = {
                width: boxSize.inlineSize,
                height: boxSize.blockSize,
                x: entry.contentRect.x,
                y: entry.contentRect.y,
                top: entry.contentRect.top,
                left: entry.contentRect.left,
                bottom: entry.contentRect.bottom,
                right: entry.contentRect.right,
              }
            } else {
              rect.value = entry.contentRect
            }
          })
        }
      })
      observer.observe(node, options)
    },
    { immediate: true, flush: 'sync' },
  )

  onBeforeUnmount(disconnect)

  return { ref: elementRef, rect }
}

export interface UseElementSizeReturnValue<T extends Element = HTMLElement> {
  ref: Ref<T | null>
  width: Ref<number>
  height: Ref<number>
}

export function useElementSize<T extends Element = HTMLElement>(
  options?: ResizeObserverOptions,
): UseElementSizeReturnValue<T> {
  const { ref: elementRef, rect } = useResizeObserver<T>(options)
  const width = ref(0)
  const height = ref(0)

  watch(
    rect,
    (value) => {
      width.value = value.width
      height.value = value.height
    },
    { immediate: true },
  )

  return { ref: elementRef, width, height }
}
