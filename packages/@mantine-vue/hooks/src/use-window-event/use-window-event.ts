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
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions | undefined>,
) {
  const getListener = () =>
    isRef(listener)
      ? (listener as Ref<(event: WindowEventMap[K]) => void>).value
      : (listener as (event: WindowEventMap[K]) => void)
  const handler = (event: WindowEventMap[K]) => getListener()(event)
  let currentType: K | undefined
  let currentCapture = false
  let mounted = false

  const resolveOptions = () => {
    const value = toValue(options)
    return typeof value === 'boolean'
      ? { capture: value, passive: undefined, once: false, signal: undefined }
      : {
          capture: value?.capture ?? false,
          passive: value?.passive,
          once: value?.once ?? false,
          signal: value?.signal,
        }
  }

  const add = (eventType: K, resolved = resolveOptions()) => {
    currentType = eventType
    currentCapture = resolved.capture
    window.addEventListener(eventType, handler as EventListener, resolved)
  }

  const remove = () => {
    if (currentType) {
      window.removeEventListener(currentType, handler as EventListener, currentCapture)
      currentType = undefined
    }
  }

  onMounted(() => {
    mounted = true
    add(toValue(type))
  })

  watch(
    () => {
      const resolved = resolveOptions()
      return [
        toValue(type),
        resolved.capture,
        resolved.passive,
        resolved.once,
        resolved.signal,
      ] as const
    },
    ([nextType, capture, passive, once, signal]) => {
      if (mounted) {
        remove()
        add(nextType, { capture, passive, once, signal })
      }
    },
  )

  onBeforeUnmount(remove)
}
