import { clamp, type Point, type Rect } from './geometry'
import type { DiagramViewport } from './types'

export interface ViewportConstraints {
  minZoom: number
  maxZoom: number
  /** World area the viewport may show, unbounded when omitted */
  translateExtent?: Rect
}

export interface ViewportSize {
  width: number
  height: number
}

export const DEFAULT_VIEWPORT: DiagramViewport = { x: 0, y: 0, zoom: 1 }

export function screenToWorld(p: Point, viewport: DiagramViewport): Point {
  return { x: (p.x - viewport.x) / viewport.zoom, y: (p.y - viewport.y) / viewport.zoom }
}

export function worldToScreen(p: Point, viewport: DiagramViewport): Point {
  return { x: p.x * viewport.zoom + viewport.x, y: p.y * viewport.zoom + viewport.y }
}

/** World rectangle visible in a viewport of the given size. */
export function getVisibleRect(viewport: DiagramViewport, size: ViewportSize): Rect {
  return {
    x: -viewport.x / viewport.zoom,
    y: -viewport.y / viewport.zoom,
    width: size.width / viewport.zoom,
    height: size.height / viewport.zoom,
  }
}

/** Applies zoom limits and the translate extent. */
export function constrainViewport(
  viewport: DiagramViewport,
  size: ViewportSize,
  constraints: ViewportConstraints,
): DiagramViewport {
  const zoom = clamp(viewport.zoom, constraints.minZoom, constraints.maxZoom)
  let { x, y } = viewport
  const extent = constraints.translateExtent

  if (extent && size.width > 0 && size.height > 0) {
    const extentWidth = extent.width * zoom
    const extentHeight = extent.height * zoom

    // The extent is smaller than the viewport: center it. Otherwise keep it covering the view.
    x =
      extentWidth <= size.width
        ? (size.width - extentWidth) / 2 - extent.x * zoom
        : clamp(x, size.width - (extent.x + extent.width) * zoom, -extent.x * zoom)
    y =
      extentHeight <= size.height
        ? (size.height - extentHeight) / 2 - extent.y * zoom
        : clamp(y, size.height - (extent.y + extent.height) * zoom, -extent.y * zoom)
  }

  return { x, y, zoom }
}

/** Zooms around a screen point, which keeps pointing at the same world position. */
export function zoomAtPoint(
  viewport: DiagramViewport,
  screenPoint: Point,
  nextZoom: number,
): DiagramViewport {
  const world = screenToWorld(screenPoint, viewport)

  return {
    zoom: nextZoom,
    x: screenPoint.x - world.x * nextZoom,
    y: screenPoint.y - world.y * nextZoom,
  }
}

/** Viewport that shows `rect` centered with `padding` screen pixels around it. */
export function fitRect(
  rect: Rect,
  size: ViewportSize,
  options: { padding?: number; minZoom?: number; maxZoom?: number } = {},
): DiagramViewport {
  const { padding = 40, minZoom = 0.05, maxZoom = 1 } = options
  const availableWidth = Math.max(1, size.width - padding * 2)
  const availableHeight = Math.max(1, size.height - padding * 2)
  const zoom = clamp(
    Math.min(availableWidth / Math.max(rect.width, 1), availableHeight / Math.max(rect.height, 1)),
    minZoom,
    maxZoom,
  )

  return {
    zoom,
    x: size.width / 2 - (rect.x + rect.width / 2) * zoom,
    y: size.height / 2 - (rect.y + rect.height / 2) * zoom,
  }
}

export function viewportsEqual(a: DiagramViewport, b: DiagramViewport) {
  return (
    Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6 && Math.abs(a.zoom - b.zoom) < 1e-9
  )
}

export function interpolateViewport(
  from: DiagramViewport,
  to: DiagramViewport,
  t: number,
): DiagramViewport {
  // Interpolating the zoom logarithmically keeps the perceived speed constant.
  const zoom = Math.exp(Math.log(from.zoom) + (Math.log(to.zoom) - Math.log(from.zoom)) * t)
  const progress = from.zoom === to.zoom ? t : (zoom - from.zoom) / (to.zoom - from.zoom)

  return {
    zoom,
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  }
}
