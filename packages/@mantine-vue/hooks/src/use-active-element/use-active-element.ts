import {
  onBeforeUnmount,
  onMounted,
  readonly,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export interface UseActiveElementOptions {
  /** If set, pierces shadow roots to return the truly-focused element inside web components @default true */
  deep?: boolean

  /** If set, updates the returned element when the active element is removed from the DOM @default true */
  triggerOnRemoval?: boolean
}

function getActiveElement(deep: boolean): Element | null {
  let element = document.activeElement

  if (deep) {
    while (element?.shadowRoot?.activeElement) {
      element = element.shadowRoot.activeElement
    }
  }

  return element
}

/** Tracks the element that currently has focus. */
export function useActiveElement<T extends Element = Element>(
  options?: MaybeRefOrGetter<UseActiveElementOptions | undefined>,
): Readonly<Ref<T | null>> {
  const activeElement = shallowRef<T | null>(null)
  let cleanup: (() => void) | null = null

  const subscribe = () => {
    cleanup?.()

    const { deep = true, triggerOnRemoval = true } = toValue(options) ?? {}
    let observer: MutationObserver | null = null

    const observeRemovals = () => {
      if (!observer) {
        return
      }

      observer.disconnect()
      observer.observe(document.body, { childList: true, subtree: true })

      if (deep) {
        let element = document.activeElement
        while (element?.shadowRoot) {
          observer.observe(element.shadowRoot, { childList: true, subtree: true })
          element = element.shadowRoot.activeElement
        }
      }
    }

    const update = () => {
      activeElement.value = getActiveElement(deep) as T | null
      observeRemovals()
    }

    const handleBlur = (event: FocusEvent) => {
      if (event.relatedTarget === null) {
        update()
      }
    }

    if (triggerOnRemoval && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.removedNodes.length > 0)) {
          update()
        }
      })
    }

    update()

    window.addEventListener('focusin', update)
    window.addEventListener('focusout', update)
    window.addEventListener('blur', handleBlur, true)

    cleanup = () => {
      window.removeEventListener('focusin', update)
      window.removeEventListener('focusout', update)
      window.removeEventListener('blur', handleBlur, true)
      observer?.disconnect()
      cleanup = null
    }
  }

  onMounted(() => {
    subscribe()
    watch(() => {
      const value = toValue(options)
      return [value?.deep, value?.triggerOnRemoval]
    }, subscribe)
  })

  onBeforeUnmount(() => cleanup?.())

  return readonly(activeElement) as Readonly<Ref<T | null>>
}
