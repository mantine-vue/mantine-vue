import { onBeforeUnmount } from 'vue'

export function useDelayedHover(input: {
  open: () => void
  close: () => void
  openDelay?: number
  closeDelay?: number
}) {
  let openTimeout: ReturnType<typeof setTimeout> | undefined
  let closeTimeout: ReturnType<typeof setTimeout> | undefined
  const clearTimeouts = () => {
    clearTimeout(openTimeout)
    clearTimeout(closeTimeout)
  }
  const schedule = (callback: () => void, delay?: number) =>
    delay ? setTimeout(callback, delay) : callback()
  const openDropdown = () => {
    clearTimeouts()
    openTimeout = schedule(input.open, input.openDelay) as any
  }
  const closeDropdown = () => {
    clearTimeouts()
    closeTimeout = schedule(input.close, input.closeDelay) as any
  }
  onBeforeUnmount(clearTimeouts)
  return { openDropdown, closeDropdown }
}
