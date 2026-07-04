import { onBeforeUnmount, watch, type MaybeRefOrGetter } from 'vue'

const LOCK_ATTR = 'data-scroll-locked'
const SCROLL_BAR_SIZE_VAR = '--removed-body-scroll-bar-size'

let passiveSupported = false
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      passiveSupported = true
      return true
    },
  })
  window.addEventListener('test', opts as any, opts as any)
  window.removeEventListener('test', opts as any, opts as any)
} catch (_) {}
const nonPassive: AddEventListenerOptions | boolean = passiveSupported ? { passive: false } : false

function getLockCount(): number {
  const n = parseInt(document.body.getAttribute(LOCK_ATTR) ?? '0', 10)
  return isFinite(n) ? n : 0
}

function getScrollbarGap(): number {
  if (typeof window === 'undefined') return 0
  const cs = window.getComputedStyle(document.body)
  const left = parseInt(cs.marginLeft || '0', 10) || 0
  const right = parseInt(cs.marginRight || '0', 10) || 0
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth + right - left)
}

let styleEl: HTMLStyleElement | null = null

function injectStyles(gap: number) {
  if (styleEl) return
  styleEl = document.createElement('style')
  styleEl.setAttribute('data-mantine-scroll-lock', '')
  styleEl.textContent = [
    `body[${LOCK_ATTR}] {`,
    `  overflow: hidden !important;`,
    `  overscroll-behavior: contain;`,
    `  position: relative !important;`,
    `  margin-right: ${gap}px !important;`,
    `  ${SCROLL_BAR_SIZE_VAR}: ${gap}px;`,
    `}`,
  ].join('\n')
  document.head.appendChild(styleEl)
}

function removeStyles() {
  styleEl?.remove()
  styleEl = null
}

function preventZoom(event: WheelEvent | TouchEvent) {
  const isCtrlWheel = event instanceof WheelEvent && event.ctrlKey
  const isPinch = event instanceof TouchEvent && event.touches.length === 2
  if ((isCtrlWheel || isPinch) && event.cancelable) {
    event.preventDefault()
  }
}

function addZoomPrevention() {
  document.addEventListener('wheel', preventZoom as EventListener, nonPassive)
  document.addEventListener('touchmove', preventZoom as EventListener, nonPassive)
}

function removeZoomPrevention() {
  document.removeEventListener('wheel', preventZoom as EventListener)
  document.removeEventListener('touchmove', preventZoom as EventListener)
}

let previousOverflow = ''

export function useLockScroll(opened: MaybeRefOrGetter<boolean>) {
  let locked = false

  const resolve = () =>
    typeof opened === 'function'
      ? opened()
      : typeof opened === 'object' && opened && 'value' in opened
        ? opened.value
        : opened

  const unlock = () => {
    if (!locked || typeof document === 'undefined') return
    locked = false

    const next = getLockCount() - 1
    if (next <= 0) {
      document.body.removeAttribute(LOCK_ATTR)
      document.body.style.overflow = previousOverflow
      removeStyles()
      removeZoomPrevention()
    } else {
      document.body.setAttribute(LOCK_ATTR, String(next))
    }
  }

  watch(
    resolve,
    (value) => {
      if (value && !locked && typeof document !== 'undefined') {
        const current = getLockCount()
        if (current === 0) {
          previousOverflow = document.body.style.overflow
          injectStyles(getScrollbarGap())
          addZoomPrevention()
        }
        document.body.setAttribute(LOCK_ATTR, String(current + 1))
        locked = true
      } else if (!value) {
        unlock()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(unlock)
}
