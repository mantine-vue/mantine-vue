import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export function useMutationObserver<T extends HTMLElement = HTMLElement>(
  callback: MutationCallback,
  options: MutationObserverInit,
): Ref<T | null> {
  const elementRef = ref<T | null>(null) as Ref<T | null>
  let observer: MutationObserver | undefined

  watch(
    elementRef,
    (node) => {
      observer?.disconnect()
      observer = undefined

      // `node` is normally an HTMLElement, but if a consumer accidentally binds
      // the returned ref to a Vue component instance instead of a native DOM
      // element, `node` will be a component proxy without DOM methods. Guard
      // against that instead of throwing on `observe`.
      if (node instanceof Element) {
        observer = new MutationObserver(callback)
        observer.observe(node, options)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => observer?.disconnect())

  return elementRef
}

export function useMutationObserverTarget(
  callback: MutationCallback,
  options: MutationObserverInit,
  target?: MaybeRefOrGetter<HTMLElement | null | undefined>,
): void {
  let observer: MutationObserver | undefined

  const connect = (): void => {
    observer?.disconnect()
    observer = undefined

    const targetElement = toValue(target)

    if (targetElement instanceof Element) {
      observer = new MutationObserver(callback)
      observer.observe(targetElement, options)
    }
  }

  onMounted(connect)
  watch(() => toValue(target), connect)

  onBeforeUnmount(() => observer?.disconnect())
}
