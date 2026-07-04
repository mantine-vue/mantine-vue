import { inject, onBeforeUnmount, ref } from 'vue'
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
  onBeforeUnmount(clear)
  return { opened, openDropdown, closeDropdown }
}
