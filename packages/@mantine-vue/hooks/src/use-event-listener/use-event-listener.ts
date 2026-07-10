import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  type: K,
  listener: (this: T, ev: HTMLElementEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
): Ref<T | null> {
  const elementRef = ref<T | null>(null) as Ref<T | null>
  let cleanup: (() => void) | undefined

  watch(
    elementRef,
    (node) => {
      cleanup?.()
      cleanup = undefined

      if (!node) {
        return
      }

      node.addEventListener(type, listener as EventListener, options)
      cleanup = () => node.removeEventListener(type, listener as EventListener, options)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => cleanup?.())

  return elementRef
}
