import { onBeforeUnmount, watch, type WatchSource } from 'vue'

/**
 * Keeps attributes of `<html>` (e.g. `dir`, `lang`) in sync while a showcase is
 * mounted, and restores the host page's values when it unmounts so the docs
 * site is unaffected after leaving the showcase.
 */
export function useDocumentAttributes(attributes: WatchSource<Record<string, string>>) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const original = new Map<string, string | null>()

  watch(
    attributes,
    (next) => {
      for (const [name, value] of Object.entries(next)) {
        if (!original.has(name)) {
          original.set(name, root.getAttribute(name))
        }
        root.setAttribute(name, value)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    original.forEach((value, name) => {
      if (value === null) {
        root.removeAttribute(name)
      } else {
        root.setAttribute(name, value)
      }
    })
  })
}

/** Injects a stylesheet `<link>` once (used for web fonts). Failures are ignored. */
export function ensureStylesheet(href: string) {
  if (
    typeof document === 'undefined' ||
    document.querySelector(`link[data-showcase-href="${href}"]`)
  ) {
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.dataset.showcaseHref = href
  document.head.appendChild(link)
}
