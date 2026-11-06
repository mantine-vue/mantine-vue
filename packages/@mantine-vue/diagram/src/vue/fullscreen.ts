import { computed, shallowRef } from 'vue'

const fullscreenElement = shallowRef<HTMLElement | null>(null)
let listening = false

function readFullscreenElement(): HTMLElement | null {
  const doc = document as Document & { webkitFullscreenElement?: Element | null }

  return (doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null) as HTMLElement | null
}

function listen() {
  if (listening || typeof document === 'undefined') {
    return
  }

  listening = true
  fullscreenElement.value = readFullscreenElement()

  const update = () => {
    fullscreenElement.value = readFullscreenElement()
  }

  // One listener for the whole page, fullscreen is a property of the document.
  document.addEventListener('fullscreenchange', update)
  document.addEventListener('webkitfullscreenchange', update)
}

/**
 * Portal props for tooltips, menus and dropdowns. In fullscreen the browser renders only the
 * fullscreen element, so overlays are portaled into it instead of `document.body`.
 */
export function useFullscreenPortal() {
  listen()

  return computed(() => ({ target: fullscreenElement.value ?? undefined }))
}
