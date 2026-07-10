import {
  isRef,
  onBeforeUnmount,
  onMounted,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: MaybeRefOrGetter<K>,
  listener: MaybeRefOrGetter<(event: WindowEventMap[K]) => void>,
  options?: AddEventListenerOptions,
) {
  const getListener = () =>
    isRef(listener)
      ? (listener as Ref<(event: WindowEventMap[K]) => void>).value
      : (listener as (event: WindowEventMap[K]) => void)
  const handler = (event: WindowEventMap[K]) => getListener()(event)
  let currentType: K | undefined
  let mounted = false

  const add = (eventType: K) => {
    currentType = eventType
    window.addEventListener(eventType, handler as EventListener, options)
  }

  const remove = () => {
    if (currentType) {
      window.removeEventListener(currentType, handler as EventListener, options)
      currentType = undefined
    }
  }

  onMounted(() => {
    mounted = true
    add(toValue(type))
  })

  watch(
    () => toValue(type),
    (nextType) => {
      if (mounted && nextType !== currentType) {
        remove()
        add(nextType)
      }
    },
  )

  onBeforeUnmount(remove)
}
