import { nextTick, ref, watch, type Ref } from 'vue'

export interface UseFocusWithinOptions {
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

export interface UseFocusWithinReturnValue<T extends HTMLElement = HTMLElement> {
  ref: Ref<T | null>
  focused: Ref<boolean>
}

export function useFocusWithin<T extends HTMLElement = HTMLElement>(
  options: UseFocusWithinOptions = {},
): UseFocusWithinReturnValue<T> {
  const refTarget = ref<T | null>(null) as Ref<T | null>
  const focused = ref(false)

  watch(
    refTarget,
    (node, _, onCleanup) => {
      focused.value = false

      if (!node) return

      let active = true

      const onFocusIn = (event: FocusEvent) => {
        if (!focused.value) {
          focused.value = true
          options.onFocus?.(event)
        }
      }

      const onFocusOut = (event: FocusEvent) => {
        nextTick(() => {
          if (!active) return

          const isFocused = node.matches(':focus-within')

          if (!isFocused && focused.value) {
            options.onBlur?.(event)
          }

          focused.value = isFocused
        })
      }

      node.addEventListener('focusin', onFocusIn)
      node.addEventListener('focusout', onFocusOut)

      onCleanup(() => {
        active = false
        node.removeEventListener('focusin', onFocusIn)
        node.removeEventListener('focusout', onFocusOut)
      })
    },
    { immediate: true, flush: 'sync' },
  )

  return { ref: refTarget, focused }
}
