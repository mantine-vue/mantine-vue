import { nextTick } from 'vue'

/** A cloned child may already carry an array of handlers for the same event. */
export function call(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((fn) => fn?.(event))
  } else {
    handler?.(event)
  }
}

/**
 * Enabled items of one dropdown.
 *
 * The `closest` check matters: a submenu dropdown is rendered inside its parent, so a
 * plain `querySelectorAll` would return the child menu's items as well.
 */
export function menuItems(root: Element | null) {
  return Array.from(
    root?.querySelectorAll<HTMLElement>('[data-menu-item]:not([data-disabled])') ?? [],
  ).filter((node) => node.closest('[data-menu-dropdown]') === root)
}

export function clearActive(root: Element | null) {
  root
    ?.querySelectorAll<HTMLElement>('[data-menu-active]')
    .forEach(
      (node) =>
        node.closest('[data-menu-dropdown]') === root && node.removeAttribute('data-menu-active'),
    )
}

/**
 * Marks an item as active without focusing it. Used while a search field has focus: the
 * highlight has to move without the field losing the caret.
 */
export function setActive(item: HTMLElement | null, root: Element | null) {
  clearActive(root)

  if (item) {
    item.setAttribute('data-menu-active', 'true')
    item.scrollIntoView?.({ block: 'nearest' })
  }
}

export function getActiveIndex(items: HTMLElement[]) {
  return items.findIndex((item) => item.hasAttribute('data-menu-active'))
}

/** Moves focus by `delta`, wrapping around when `loop` is set and clamping otherwise. */
export function focusAt(
  root: Element | null,
  current: HTMLElement | null,
  delta: number,
  loop: boolean,
) {
  const items = menuItems(root)

  if (!items.length) {
    return
  }

  let index = current ? items.indexOf(current) + delta : delta > 0 ? 0 : items.length - 1

  if (loop) {
    index = (index + items.length) % items.length
  } else {
    index = Math.max(0, Math.min(items.length - 1, index))
  }

  items[index]?.focus()
}

/**
 * Focuses the first item of the submenu a target controls.
 *
 * The dropdown may not exist yet when the submenu has only just been opened, so the
 * lookup is retried once after a short delay.
 */
export function focusFirstSubItem(button: HTMLElement) {
  const find = () => {
    const controls = button.getAttribute('aria-controls')
    const dropdown = controls ? document.getElementById(controls) : null
    const item = dropdown?.querySelector<HTMLElement>('[data-menu-item]:not([data-disabled])')

    if (item) {
      item.focus({ preventScroll: true })
      return true
    }

    return false
  }

  nextTick(() => {
    if (!find()) {
      setTimeout(find, 20)
    }
  })
}
