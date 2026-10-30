import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { FOCUS_SELECTOR, focusable, tabbable } from './tabbable'
import { scopeTab } from './scope-tab'

interface FocusTrapEntry {
  target: Ref<HTMLElement | null>
  isActive: () => boolean
}

const mountedTraps = new Set<FocusTrapEntry>()

function hasNestedActiveTrap(entry: FocusTrapEntry, node: HTMLElement) {
  const activeElement = (node.getRootNode() as unknown as DocumentOrShadowRoot).activeElement

  if (!activeElement) {
    return false
  }

  for (const trap of mountedTraps) {
    const nested = trap.target.value

    if (
      trap !== entry &&
      trap.isActive() &&
      nested &&
      nested !== node &&
      node.contains(nested) &&
      nested.contains(activeElement)
    ) {
      return true
    }
  }

  return false
}

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
  const entry: FocusTrapEntry = { target: refTarget, isActive }

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
    if (
      event.key !== 'Tab' ||
      event.defaultPrevented ||
      !refTarget.value ||
      !isActive() ||
      hasNestedActiveTrap(entry, refTarget.value)
    ) {
      return
    }

    scopeTab(refTarget.value, event)
  }

  onMounted(() => {
    if (typeof document === 'undefined') {
      return
    }

    mountedTraps.add(entry)
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
    mountedTraps.delete(entry)

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
