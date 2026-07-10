import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

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
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const node = refTarget.value
    if (!node) {
      return
    }

    const onFocusIn = (event: FocusEvent) => {
      focused.value = true
      options.onFocus?.(event)
    }
    const onFocusOut = (event: FocusEvent) =>
      nextTick(() => {
        const isFocused = node.matches(':focus-within')
        if (!isFocused && focused.value) {
          options.onBlur?.(event)
        }
        focused.value = isFocused
      })

    node.addEventListener('focusin', onFocusIn)
    node.addEventListener('focusout', onFocusOut)

    cleanup = () => {
      node.removeEventListener('focusin', onFocusIn)
      node.removeEventListener('focusout', onFocusOut)
    }
  })

  onBeforeUnmount(() => cleanup?.())

  return { ref: refTarget, focused }
}
