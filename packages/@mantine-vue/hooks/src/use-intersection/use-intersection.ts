import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export interface UseIntersectionReturnValue<T extends HTMLElement = HTMLElement> {
  ref: Ref<T | null>
  entry: Ref<IntersectionObserverEntry | null>
}

export function useIntersection<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit,
): UseIntersectionReturnValue<T> {
  const elementRef = ref<T | null>(null) as Ref<T | null>
  const entry = ref<IntersectionObserverEntry | null>(null) as Ref<IntersectionObserverEntry | null>
  let observer: IntersectionObserver | undefined

  watch(
    elementRef,
    (node) => {
      observer?.disconnect()
      observer = undefined

      if (!node) {
        entry.value = null
        return
      }

      observer = new IntersectionObserver(([_entry]) => {
        entry.value = _entry
      }, options)

      observer.observe(node)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => observer?.disconnect())

  return { ref: elementRef, entry }
}
