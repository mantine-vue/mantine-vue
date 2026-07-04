import { onBeforeUnmount, onMounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { FOCUS_SELECTOR, focusable, tabbable } from './tabbable'
import { scopeTab } from './scope-tab'

function getElement(node: any): HTMLElement | null {
  return (node?.$el ?? node) || null
}

function focusNode(node: HTMLElement) {
  let focusElement: HTMLElement | null = node.querySelector('[data-autofocus]')

  if (!focusElement) {
    const children = Array.from<HTMLElement>(node.querySelectorAll(FOCUS_SELECTOR))
    focusElement = children.find(tabbable) || children.find(focusable) || null

    if (!focusElement && focusable(node)) {
      focusElement = node
    }
  }

  focusElement?.focus({ preventScroll: true })
}

export function useFocusTrap(active: MaybeRefOrGetter<boolean> = true) {
  const refTarget = ref<HTMLElement | null>(null)
  const isActive = () => toValue(active)

  const setRef = (node: any) => {
    const element = getElement(node)

    if (!isActive()) {
      refTarget.value = element
      return
    }

    if (element === null) {
      refTarget.value = null
      return
    }

    if (refTarget.value === element) {
      return
    }

    setTimeout(() => {
      if (element.isConnected || element.getRootNode()) {
        focusNode(element)
      }
    })

    refTarget.value = element
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && refTarget.value && isActive()) {
      scopeTab(refTarget.value, event)
    }
  }

  onMounted(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.addEventListener('keydown', handleKeyDown)

    if (isActive() && refTarget.value) {
      setTimeout(() => {
        if (refTarget.value) {
          focusNode(refTarget.value)
        }
      })
    }
  })

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  watch(
    () => isActive(),
    (value) => {
      if (value && refTarget.value) {
        setTimeout(() => {
          if (refTarget.value) {
            focusNode(refTarget.value)
          }
        })
      }
    },
  )

  return setRef
}

export { scopeTab }
export { FOCUS_SELECTOR, findTabbableDescendants, focusable, tabbable } from './tabbable'
