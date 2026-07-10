import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export interface UseInViewportReturnValue<T extends HTMLElement = HTMLElement> {
  inViewport: Ref<boolean>
  ref: Ref<T | null>
}

export function useInViewport<T extends HTMLElement = HTMLElement>(): UseInViewportReturnValue<T> {
  const elementRef = ref<T | null>(null) as Ref<T | null>
  const inViewport = ref(false)
  let observer: IntersectionObserver | undefined

  watch(
    elementRef,
    (node) => {
      if (typeof IntersectionObserver === 'undefined') {
        return
      }

      observer?.disconnect()

      if (node) {
        observer = new IntersectionObserver((entries) => {
          const lastEntry = entries[entries.length - 1]
          inViewport.value = lastEntry.isIntersecting
        })
        observer.observe(node)
      } else {
        observer = undefined
        inViewport.value = false
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => observer?.disconnect())

  return { ref: elementRef, inViewport }
}
