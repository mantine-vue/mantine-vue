import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

type OutsideEvent = MouseEvent | TouchEvent

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: (event: OutsideEvent) => void,
  events: MaybeRefOrGetter<string[] | null | undefined> = ['mousedown', 'touchstart'],
  nodes?: MaybeRefOrGetter<Array<HTMLElement | null | undefined>>,
  enabled: MaybeRefOrGetter<boolean> = true,
  capture: MaybeRefOrGetter<boolean> = false,
): Ref<T | null> {
  const element = ref<T | null>(null) as Ref<T | null>
  let activeEvents: string[] = []
  let activeCapture = false
  const listener = (event: Event) => {
    const target = event.target as Node | null
    if (!target || (!document.body.contains(target) && (target as Element).tagName !== 'HTML'))
      return
    const path = event.composedPath()
    const resolvedNodes = nodes ? toValue(nodes) : undefined
    if (resolvedNodes) {
      if (resolvedNodes.every((node) => !!node && !path.includes(node)))
        callback(event as OutsideEvent)
    } else if (element.value && !path.includes(element.value)) callback(event as OutsideEvent)
  }
  const cleanup = () => {
    activeEvents.forEach((event) => document.removeEventListener(event, listener, activeCapture))
    activeEvents = []
  }
  const bind = () => {
    cleanup()
    if (!toValue(enabled)) return
    activeEvents = toValue(events) || ['mousedown', 'touchstart']
    activeCapture = toValue(capture)
    activeEvents.forEach((event) => document.addEventListener(event, listener, activeCapture))
  }
  onMounted(bind)
  watch([() => toValue(events)?.join(','), () => toValue(enabled), () => toValue(capture)], bind)
  onBeforeUnmount(cleanup)
  return element
}
