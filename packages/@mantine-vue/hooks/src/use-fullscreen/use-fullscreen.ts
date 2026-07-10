import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

function getFullscreenElement(): Element | null {
  const _document = window.document as any

  return (
    _document.fullscreenElement ||
    _document.webkitFullscreenElement ||
    _document.mozFullScreenElement ||
    _document.msFullscreenElement ||
    null
  )
}

function exitFullscreen(): Promise<void> | null {
  const _document = window.document as any

  if (typeof _document.exitFullscreen === 'function') {
    return _document.exitFullscreen()
  }
  if (typeof _document.msExitFullscreen === 'function') {
    return _document.msExitFullscreen()
  }
  if (typeof _document.webkitExitFullscreen === 'function') {
    return _document.webkitExitFullscreen()
  }
  if (typeof _document.mozCancelFullScreen === 'function') {
    return _document.mozCancelFullScreen()
  }

  return null
}

function enterFullScreen(element: HTMLElement) {
  const _element = element as any

  return (
    _element.requestFullscreen?.() ||
    _element.msRequestFullscreen?.() ||
    _element.webkitEnterFullscreen?.() ||
    _element.webkitRequestFullscreen?.() ||
    _element.mozRequestFullscreen?.()
  )
}

const prefixes = ['', 'webkit', 'moz', 'ms']

interface FullscreenEvents {
  onFullScreen: (event: Event) => void
  onError: (event: Event) => void
}

function addEvents(element: HTMLElement, events: FullscreenEvents) {
  const { onFullScreen, onError } = events
  prefixes.forEach((prefix) => {
    element.addEventListener(`${prefix}fullscreenchange`, onFullScreen)
    element.addEventListener(`${prefix}fullscreenerror`, onError)
  })

  return () => removeEvents(element, events)
}

function removeEvents(element: HTMLElement, { onFullScreen, onError }: FullscreenEvents) {
  prefixes.forEach((prefix) => {
    element.removeEventListener(`${prefix}fullscreenchange`, onFullScreen)
    element.removeEventListener(`${prefix}fullscreenerror`, onError)
  })
}

export interface UseFullscreenElementReturnValue<T extends HTMLElement = HTMLElement> {
  ref: Ref<T | null>
  toggle: () => Promise<void>
  fullscreen: Ref<boolean>
}

export function useFullscreenElement<
  T extends HTMLElement = HTMLElement,
>(): UseFullscreenElementReturnValue<T> {
  const fullscreen = ref(false)
  const elementRef = ref<T | null>(null) as Ref<T | null>
  let removeEventsFn: (() => void) | undefined

  const handleFullscreenChange = () => {
    fullscreen.value = elementRef.value === getFullscreenElement()
  }

  const handleFullscreenError = () => {
    fullscreen.value = false
  }

  const toggle = async () => {
    if (!getFullscreenElement() && elementRef.value) {
      await enterFullScreen(elementRef.value)
    } else {
      await exitFullscreen()
    }
  }

  watch(
    elementRef,
    (node) => {
      removeEventsFn?.()
      removeEventsFn = undefined

      if (node) {
        removeEventsFn = addEvents(node, {
          onFullScreen: handleFullscreenChange,
          onError: handleFullscreenError,
        })
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => removeEventsFn?.())

  return { ref: elementRef, toggle, fullscreen }
}

export interface UseFullscreenDocumentReturnValue {
  toggle: () => Promise<void>
  fullscreen: Ref<boolean>
}

export function useFullscreenDocument(): UseFullscreenDocumentReturnValue {
  const fullscreen = ref(false)
  let removeEventsFn: (() => void) | undefined

  const handleFullscreenChange = () => {
    fullscreen.value = getFullscreenElement() === window.document.documentElement
  }

  const handleFullscreenError = () => {
    fullscreen.value = false
  }

  const toggle = async () => {
    if (!getFullscreenElement()) {
      await enterFullScreen(window.document.documentElement)
    } else {
      await exitFullscreen()
    }
  }

  onMounted(() => {
    removeEventsFn = addEvents(window.document.documentElement, {
      onFullScreen: handleFullscreenChange,
      onError: handleFullscreenError,
    })
  })

  onBeforeUnmount(() => removeEventsFn?.())

  return { toggle, fullscreen }
}
