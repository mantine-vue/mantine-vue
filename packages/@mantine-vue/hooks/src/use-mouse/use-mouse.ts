import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

export interface UseMouseOptions {
  resetOnExit?: boolean
}

export interface UseMouseReturnValue<T extends HTMLElement = HTMLElement> {
  ref: Ref<T | null>
  x: Ref<number>
  y: Ref<number>
}

export function useMouse<T extends HTMLElement = HTMLElement>(
  options: UseMouseOptions = { resetOnExit: false },
): UseMouseReturnValue<T> {
  const elementRef = ref<T | null>(null) as Ref<T | null>
  const x = ref(0)
  const y = ref(0)
  let cleanup: (() => void) | undefined

  watch(
    elementRef,
    (node) => {
      cleanup?.()
      cleanup = undefined

      // `node` is normally an HTMLElement, but if a consumer accidentally binds
      // the returned `ref` to a Vue component instance instead of a native DOM
      // element, `node` will be a component proxy without DOM methods. Guard
      // against that instead of throwing on `addEventListener`.
      const target = node instanceof EventTarget ? node : null

      const setMousePosition = (event: Event) => {
        const mouseEvent = event as MouseEvent
        if (target) {
          const rect = (target as HTMLElement).getBoundingClientRect()
          x.value = Math.max(0, Math.round(mouseEvent.clientX - rect.left))
          y.value = Math.max(0, Math.round(mouseEvent.clientY - rect.top))
        } else {
          x.value = mouseEvent.clientX
          y.value = mouseEvent.clientY
        }
      }

      const resetMousePosition = () => {
        x.value = 0
        y.value = 0
      }

      target?.addEventListener('mousemove', setMousePosition)
      if (options.resetOnExit) {
        target?.addEventListener('mouseleave', resetMousePosition)
      }

      cleanup = () => {
        target?.removeEventListener('mousemove', setMousePosition)
        if (options.resetOnExit) {
          target?.removeEventListener('mouseleave', resetMousePosition)
        }
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => cleanup?.())

  return { ref: elementRef, x, y }
}

export interface UseMousePositionReturnValue {
  x: Ref<number>
  y: Ref<number>
}

export function useMousePosition(): UseMousePositionReturnValue {
  const x = ref(0)
  const y = ref(0)

  const setMousePosition = (event: MouseEvent) => {
    x.value = event.clientX
    y.value = event.clientY
  }

  onMounted(() => document.addEventListener('mousemove', setMousePosition))
  onBeforeUnmount(() => document.removeEventListener('mousemove', setMousePosition))

  return { x, y }
}
