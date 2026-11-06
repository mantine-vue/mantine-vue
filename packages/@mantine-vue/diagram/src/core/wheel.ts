import type { DiagramEditor } from './editor'
import type { Point } from './geometry'
import { viewportsEqual, zoomAtPoint } from './viewport'

export interface DiagramWheelInput {
  deltaX: number
  deltaY: number
  /** `WheelEvent.deltaMode`: 0 pixels, 1 lines, 2 pages */
  deltaMode: number
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  /** Pointer position relative to the canvas */
  point: Point
}

export interface DiagramWheelOptions {
  /** What the wheel does without modifier keys */
  mode: () => 'pan' | 'zoom'
  /** Time constant of the eased mouse wheel zoom in ms, `0` zooms instantly */
  smoothing?: number
}

const LINE_HEIGHT = 16
const PAGE_HEIGHT = 400
/** One mouse wheel notch (100 px in Chrome) zooms by 20 %. */
const NOTCH_ZOOM = Math.log(1.2) / 100
/** Trackpad pinches arrive as many small deltas with `ctrlKey` set. */
const PINCH_ZOOM = 0.01
/** Two finger scrolling in the `zoom` wheel mode. */
const SCROLL_ZOOM = 0.004

/**
 * Mouse wheels report discrete notches (lines, or 100 px and more per event). Trackpads report
 * many small pixel deltas, which are already smooth.
 */
export function isDiscreteWheel(input: Pick<DiagramWheelInput, 'deltaMode' | 'deltaY'>) {
  return input.deltaMode !== 0 || Math.abs(input.deltaY) >= 40
}

const raf = (callback: (time: number) => void) =>
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame(callback) : null

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

/**
 * Turns wheel events into viewport changes. Events are batched to one update per animation frame,
 * and mouse wheel zoom eases towards its target, so zooming stays smooth with notched wheels and
 * many events per frame. Without `requestAnimationFrame` (server, tests) updates apply at once.
 */
export function createWheelController(editor: DiagramEditor, options: DiagramWheelOptions) {
  const smoothing = options.smoothing ?? 90
  let targetZoom: number | null = null
  let anchor: Point = { x: 0, y: 0 }
  let eased = false
  let panX = 0
  let panY = 0
  let frame: number | null = null
  let lastTime = 0
  let applied = editor.viewport

  const stop = () => {
    if (frame !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frame)
    }

    frame = null
    targetZoom = null
    panX = 0
    panY = 0
  }

  const step = (time = now()) => {
    frame = null
    const elapsed = lastTime ? Math.min(64, time - lastTime) : 16
    lastTime = time

    // Something else moved the view (fit to screen, panning): its target is stale.
    if (targetZoom !== null && eased && !viewportsEqual(editor.viewport, applied)) {
      targetZoom = null
    }

    let viewport = editor.viewport

    if (panX !== 0 || panY !== 0) {
      viewport = { ...viewport, x: viewport.x - panX, y: viewport.y - panY }
      panX = 0
      panY = 0
    }

    if (targetZoom !== null) {
      const current = viewport.zoom
      const instant =
        !eased ||
        smoothing <= 0 ||
        editor.reducedMotion ||
        typeof requestAnimationFrame !== 'function'
      // Easing in log space keeps the speed constant, whatever the zoom level.
      const progress = instant ? 1 : 1 - Math.exp(-elapsed / smoothing)
      const distance = Math.log(targetZoom / current)
      const done = instant || Math.abs(distance) < 0.002
      const zoom = done ? targetZoom : current * Math.exp(distance * progress)
      viewport = zoomAtPoint(viewport, anchor, zoom)

      if (done) {
        targetZoom = null
      }
    }

    editor.setViewport(viewport)
    applied = editor.viewport

    if (targetZoom !== null) {
      frame = raf(step)

      if (frame === null) {
        step()
      }
    } else {
      lastTime = 0
    }
  }

  const schedule = () => {
    if (frame !== null) {
      return
    }

    frame = raf(step)

    if (frame === null) {
      step()
    }
  }

  /** Handles a wheel event. Returns `true` when it zoomed. */
  const handle = (input: DiagramWheelInput) => {
    const scale = input.deltaMode === 1 ? LINE_HEIGHT : input.deltaMode === 2 ? PAGE_HEIGHT : 1
    const dx = input.deltaX * scale
    const dy = input.deltaY * scale
    const zooming = input.ctrlKey || input.metaKey || options.mode() === 'zoom'

    if (!zooming) {
      if (input.shiftKey && dx === 0) {
        panX += dy
      } else {
        panX += dx
        panY += dy
      }

      schedule()
      return false
    }

    const discrete = isDiscreteWheel(input)
    const sensitivity = discrete ? NOTCH_ZOOM : input.ctrlKey ? PINCH_ZOOM : SCROLL_ZOOM
    const { minZoom, maxZoom } = editor.options

    // A new gesture starts from wherever the view is now.
    if (targetZoom === null) {
      applied = editor.viewport
    }

    const base = targetZoom ?? editor.viewport.zoom
    targetZoom = Math.min(maxZoom, Math.max(minZoom, base * Math.exp(-dy * sensitivity)))
    anchor = input.point
    eased = discrete
    schedule()

    return true
  }

  return {
    handle,
    /** Applies pending changes right away, e.g. before reading the viewport in tests */
    flush: () => {
      while (frame !== null || targetZoom !== null || panX !== 0 || panY !== 0) {
        if (frame !== null && typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(frame)
        }

        frame = null
        eased = false
        step()
      }
    },
    dispose: stop,
  }
}
