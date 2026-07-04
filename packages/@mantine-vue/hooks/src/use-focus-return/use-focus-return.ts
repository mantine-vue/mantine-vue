import { onBeforeUnmount, watch, type MaybeRefOrGetter } from 'vue'

export interface UseFocusReturnInput {
  opened: MaybeRefOrGetter<boolean>
  shouldReturnFocus?: MaybeRefOrGetter<boolean>
}

export function useFocusReturn({ opened, shouldReturnFocus = true }: UseFocusReturnInput) {
  let lastActiveElement: HTMLElement | null = null
  let timeout: ReturnType<typeof setTimeout> | undefined
  const value = (input: MaybeRefOrGetter<boolean>) =>
    typeof input === 'function'
      ? input()
      : typeof input === 'object' && input && 'value' in input
        ? input.value
        : input
  const returnFocus = () => lastActiveElement?.focus?.({ preventScroll: true })
  const clearOnTab = (event: KeyboardEvent) => event.key === 'Tab' && clearTimeout(timeout)

  watch(
    () => value(opened),
    (isOpened, wasOpened) => {
      if (typeof document === 'undefined' || isOpened === wasOpened) return
      clearTimeout(timeout)
      if (isOpened) {
        lastActiveElement = document.activeElement as HTMLElement
        document.addEventListener('keydown', clearOnTab)
      } else {
        document.removeEventListener('keydown', clearOnTab)
        if (value(shouldReturnFocus)) {
          const activeAtClose = document.activeElement
          timeout = setTimeout(() => {
            if (
              !document.activeElement ||
              document.activeElement === document.body ||
              document.activeElement === activeAtClose
            )
              returnFocus()
          }, 10)
        }
      }
    },
  )
  onBeforeUnmount(() => {
    clearTimeout(timeout)
    document?.removeEventListener('keydown', clearOnTab)
  })
  return returnFocus
}
