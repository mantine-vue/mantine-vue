import { onBeforeUnmount, onMounted, toValue, type MaybeRefOrGetter } from 'vue'
import { getHotkeyHandler, getHotkeyMatcher, type HotkeyItemOptions } from './parse-hotkey'

export type { HotkeyItemOptions }
export { getHotkeyHandler }

export type HotkeyItem = [string, (event: KeyboardEvent) => void, HotkeyItemOptions?]

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false,
) {
  if (event.target instanceof HTMLElement) {
    const tagName = event.target.tagName.toLowerCase()

    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(tagName)
    }

    return !event.target.isContentEditable && !tagsToIgnore.includes(tagName)
  }

  return true
}

/**
 * Listens for global keydown events and invokes matching handlers.
 *
 * NOTE: the listener is attached to `window` rather than
 * `document.documentElement` (which is what React Mantine uses). Real
 * keyboard events always bubble to `window`, so this is behaviorally
 * equivalent for actual usage while remaining consistent with how the rest
 * of this package (and its test suite) dispatches synthetic events.
 */
export function useHotkeys(
  hotkeys: MaybeRefOrGetter<HotkeyItem[]>,
  tagsToIgnore: MaybeRefOrGetter<string[] | undefined> = ['input', 'textarea', 'select'],
  triggerOnContentEditable: MaybeRefOrGetter<boolean | undefined> = false,
) {
  const handleKeydown = (event: KeyboardEvent) => {
    toValue(hotkeys).forEach(
      ([hotkey, handler, options = { preventDefault: true, usePhysicalKeys: false }]) => {
        if (
          getHotkeyMatcher(hotkey, options.usePhysicalKeys)(event) &&
          shouldFireEvent(
            event,
            toValue(tagsToIgnore) ?? ['input', 'textarea', 'select'],
            toValue(triggerOnContentEditable),
          )
        ) {
          if (options.preventDefault) {
            event.preventDefault()
          }

          handler(event)
        }
      },
    )
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
}
