import { inject, onBeforeUnmount, ref, watch } from 'vue'
import { HoverCardGroupKey } from './HoverCardGroup/HoverCardGroup'

export function useHoverCard(settings: {
  openDelay?: number
  closeDelay?: number
  defaultOpened?: boolean
  onOpen?: () => void
  onClose?: () => void
}) {
  const group = inject(HoverCardGroupKey, { withinGroup: false, openDelay: 0, closeDelay: 0 })
  const opened = ref(!!settings.defaultOpened)
  const targetRef = ref<HTMLElement | null>(null)
  const assignTarget = (node: HTMLElement | null) => {
    targetRef.value = node
  }
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  const clear = () => {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
  }
  const change = (value: boolean) => {
    if (opened.value === value) return
    opened.value = value
    if (value) settings.onOpen?.()
    else settings.onClose?.()
  }
  const openDropdown = () => {
    clear()
    const delay = group.withinGroup ? group.openDelay : (settings.openDelay ?? 0)
    if (delay) openTimer = setTimeout(() => change(true), delay)
    else change(true)
  }
  const closeDropdown = () => {
    clear()
    const delay = group.withinGroup ? group.closeDelay : (settings.closeDelay ?? 150)
    if (delay) closeTimer = setTimeout(() => change(false), delay)
    else change(false)
  }
  // When the hovercard is open, watch the target element: if it becomes
  // disconnected from the DOM or is hidden (no client rects), close the
  // dropdown so it does not linger without a visible anchor.
  let observer: IntersectionObserver | undefined
  const stopObserver = () => {
    observer?.disconnect()
    observer = undefined
  }
  watch(
    [opened, targetRef],
    ([isOpened, node]) => {
      stopObserver()
      if (!isOpened || group.withinGroup || typeof IntersectionObserver === 'undefined' || !node) {
        return
      }
      observer = new IntersectionObserver(() => {
        if (!node.isConnected || node.getClientRects().length === 0) {
          clear()
          change(false)
        }
      })
      observer.observe(node)
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    clear()
    stopObserver()
  })
  return { opened, openDropdown, closeDropdown, assignTarget }
}
