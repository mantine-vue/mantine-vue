const TABBABLE_NODES = /input|select|textarea|button|object/
export const FOCUS_SELECTOR = 'a, input, select, textarea, button, object, [tabindex]'

function hidden(element: HTMLElement) {
  const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test'

  if (isTest) {
    return false
  }

  return element.style.display === 'none'
}

function visible(element: HTMLElement) {
  const isHidden =
    element.getAttribute('aria-hidden') ||
    element.getAttribute('hidden') ||
    element.getAttribute('type') === 'hidden'

  if (isHidden) {
    return false
  }

  let parentElement: HTMLElement | null = element

  while (parentElement) {
    if (parentElement === document.body || parentElement.nodeType === 11) {
      break
    }

    if (hidden(parentElement)) {
      return false
    }

    parentElement = parentElement.parentNode as HTMLElement | null
  }

  return true
}

function getElementTabIndex(element: HTMLElement) {
  const tabIndex = element.getAttribute('tabindex')
  return Number.parseInt(tabIndex ?? '', 10)
}

export function focusable(element: HTMLElement) {
  const nodeName = element.nodeName.toLowerCase()
  const isTabIndexNotNaN = !Number.isNaN(getElementTabIndex(element))
  const disabled = 'disabled' in element ? Boolean((element as HTMLButtonElement).disabled) : false
  const result =
    (TABBABLE_NODES.test(nodeName) && !disabled) ||
    (element instanceof HTMLAnchorElement
      ? Boolean(element.href) || isTabIndexNotNaN
      : isTabIndexNotNaN)

  return result && visible(element)
}

export function tabbable(element: HTMLElement) {
  const tabIndex = getElementTabIndex(element)
  const isTabIndexNaN = Number.isNaN(tabIndex)

  return (isTabIndexNaN || tabIndex >= 0) && focusable(element)
}

export function findTabbableDescendants(element: HTMLElement): HTMLElement[] {
  return Array.from(element.querySelectorAll<HTMLElement>(FOCUS_SELECTOR)).filter(tabbable)
}
