import { describe, expect, it } from 'vitest'
import {
  boxBounds,
  boxCorners,
  distanceToSegment,
  localToWorld,
  niceStep,
  pointAlongPolyline,
  pointInPolygon,
  polygonArea,
  polygonCentroid,
  polygonDistance,
  polygonsIntersect,
  polygonsOverlap,
  rayPolygonExit,
  rotatePoint,
  segmentIntersection,
  simplifyPolyline,
  snapAngle,
  worldToLocal,
} from '../core/geometry'
import { SpatialIndex } from '../core/spatial-index'
import {
  constrainViewport,
  fitRect,
  getVisibleRect,
  screenToWorld,
  worldToScreen,
  zoomAtPoint,
} from '../core/viewport'
import { snapRect } from '../core/snapping'
import { alignRects, distributeRects } from '../core/alignment'

const square = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 },
]

describe('geometry', () => {
  it('rotates points around a center', () => {
    const p = rotatePoint({ x: 10, y: 0 }, { x: 0, y: 0 }, 90)
    expect(p.x).toBeCloseTo(0)
    expect(p.y).toBeCloseTo(10)
  })

  it('computes bounds and corners of rotated boxes', () => {
    const box = { x: 0, y: 0, width: 100, height: 20, rotation: 90 }
    const bounds = boxBounds(box)
    expect(bounds.width).toBeCloseTo(20)
    expect(bounds.height).toBeCloseTo(100)
    expect(bounds.x).toBeCloseTo(40)
    expect(boxCorners(box)).toHaveLength(4)
  })

  it('round trips local and world coordinates', () => {
    const box = { x: 30, y: 40, width: 80, height: 60, rotation: 33 }
    const world = localToWorld({ x: 12, y: 7 }, box)
    const local = worldToLocal(world, box)
    expect(local.x).toBeCloseTo(12)
    expect(local.y).toBeCloseTo(7)
  })

  it('intersects segments', () => {
    expect(
      segmentIntersection({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 0 }),
    ).toEqual({
      x: 5,
      y: 5,
    })
    expect(
      segmentIntersection({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }),
    ).toBeNull()
    expect(distanceToSegment({ x: 5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(5)
  })

  it('measures polygons', () => {
    expect(polygonArea(square)).toBe(100)
    expect(polygonCentroid(square)).toEqual({ x: 5, y: 5 })
    expect(pointInPolygon({ x: 5, y: 5 }, square)).toBe(true)
    expect(pointInPolygon({ x: 15, y: 5 }, square)).toBe(false)
    expect(pointInPolygon({ x: 10, y: 5 }, square)).toBe(true)
  })

  it('detects polygon overlap and distance', () => {
    const shifted = square.map((p) => ({ x: p.x + 5, y: p.y + 5 }))
    const touching = square.map((p) => ({ x: p.x + 10, y: p.y }))
    const far = square.map((p) => ({ x: p.x + 30, y: p.y }))

    expect(polygonsIntersect(square, shifted)).toBe(true)
    expect(polygonsOverlap(square, shifted)).toBe(true)
    expect(polygonsIntersect(square, touching)).toBe(true)
    expect(polygonsOverlap(square, touching)).toBe(false)
    expect(polygonDistance(square, far)).toBe(20)
    expect(polygonDistance(square, shifted)).toBe(0)
  })

  it('finds where a ray leaves a polygon', () => {
    const exit = rayPolygonExit({ x: 5, y: 5 }, { x: 50, y: 5 }, square)
    expect(exit.x).toBeCloseTo(10)
    expect(exit.y).toBeCloseTo(5)
  })

  it('walks along polylines', () => {
    const result = pointAlongPolyline(
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ],
      0.75,
    )
    expect(result.point).toEqual({ x: 10, y: 5 })
    expect(result.angle).toBe(90)
  })

  it('simplifies collinear points', () => {
    expect(
      simplifyPolyline([
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ]),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ])
  })

  it('snaps angles and picks nice steps', () => {
    expect(snapAngle(44, 15)).toBe(45)
    expect(snapAngle(-10, 90)).toBe(0)
    expect(niceStep(37)).toBe(50)
    expect(niceStep(0.13)).toBeCloseTo(0.2)
  })
})

describe('spatial index', () => {
  it('queries items by area', () => {
    const index = new SpatialIndex(100)
    index.set('a', { x: 0, y: 0, width: 10, height: 10 })
    index.set('b', { x: 500, y: 500, width: 10, height: 10 })
    index.set('huge', { x: -10_000, y: -10_000, width: 20_000, height: 20_000 })

    expect([...index.query({ x: -5, y: -5, width: 20, height: 20 })].sort()).toEqual(['a', 'huge'])

    index.set('a', { x: 490, y: 490, width: 20, height: 20 })
    expect([...index.query({ x: 500, y: 500, width: 1, height: 1 })].sort()).toEqual([
      'a',
      'b',
      'huge',
    ])

    index.delete('huge')
    expect([...index.query({ x: -5, y: -5, width: 20, height: 20 })]).toEqual([])
    // Larger than the grid budget falls back to a scan.
    expect(index.query({ x: -1e6, y: -1e6, width: 2e6, height: 2e6 }).size).toBe(2)
  })
})

describe('viewport', () => {
  const viewport = { x: 100, y: 50, zoom: 2 }

  it('converts coordinates', () => {
    expect(screenToWorld({ x: 300, y: 250 }, viewport)).toEqual({ x: 100, y: 100 })
    expect(worldToScreen({ x: 100, y: 100 }, viewport)).toEqual({ x: 300, y: 250 })
    expect(getVisibleRect(viewport, { width: 400, height: 200 })).toEqual({
      x: -50,
      y: -25,
      width: 200,
      height: 100,
    })
  })

  it('zooms around a point', () => {
    const next = zoomAtPoint(viewport, { x: 300, y: 250 }, 4)
    expect(screenToWorld({ x: 300, y: 250 }, next)).toEqual({ x: 100, y: 100 })
  })

  it('fits rectangles and applies constraints', () => {
    const fitted = fitRect(
      { x: 0, y: 0, width: 200, height: 100 },
      { width: 500, height: 500 },
      { padding: 50, maxZoom: 5 },
    )
    expect(fitted.zoom).toBe(2)
    expect(worldToScreen({ x: 100, y: 50 }, fitted)).toEqual({ x: 250, y: 250 })

    const constrained = constrainViewport(
      { x: 0, y: 0, zoom: 10 },
      { width: 100, height: 100 },
      { minZoom: 0.5, maxZoom: 3 },
    )
    expect(constrained.zoom).toBe(3)

    // The extent is smaller than the viewport, it gets centered.
    const centered = constrainViewport(
      { x: 999, y: 999, zoom: 1 },
      { width: 400, height: 400 },
      { minZoom: 0.1, maxZoom: 4, translateExtent: { x: 0, y: 0, width: 200, height: 200 } },
    )
    expect(centered).toEqual({ x: 100, y: 100, zoom: 1 })
  })
})

describe('snapping', () => {
  it('aligns with other rectangles and reports guide lines', () => {
    const result = snapRect(
      { x: 103, y: 300, width: 50, height: 50 },
      { targets: [{ x: 100, y: 0, width: 80, height: 40 }], threshold: 5 },
    )

    expect(result.dx).toBe(-3)
    expect(result.dy).toBe(0)
    expect(result.lines).toEqual([{ axis: 'x', value: 100, from: 0, to: 350 }])
  })

  it('falls back to the grid', () => {
    const result = snapRect({ x: 23, y: 38, width: 10, height: 10 }, { gridSize: 20, threshold: 2 })
    expect(result).toEqual({ dx: -3, dy: 2, lines: [] })
  })

  it('snaps to guides without drawing snap lines', () => {
    const result = snapRect(
      { x: 0, y: 47, width: 10, height: 10 },
      { guides: [{ id: 'g', axis: 'y', value: 50 }], threshold: 5 },
    )
    // The center (52) is closer to the guide than the top edge (47).
    expect(result.dy).toBe(-2)
    expect(result.lines).toEqual([])
  })
})

describe('alignment', () => {
  const items = [
    { id: 'a', rect: { x: 0, y: 0, width: 10, height: 10 } },
    { id: 'b', rect: { x: 50, y: 20, width: 20, height: 10 } },
    { id: 'c', rect: { x: 100, y: 40, width: 10, height: 30 } },
  ]

  it('aligns edges and centers', () => {
    expect(alignRects(items, 'left')).toEqual(
      new Map([
        ['b', [-50, 0]],
        ['c', [-100, 0]],
      ]),
    )
    expect(alignRects(items, 'bottom').get('a')).toEqual([0, 60])
  })

  it('distributes with equal gaps', () => {
    const offsets = distributeRects(
      [items[0], { id: 'b', rect: { x: 20, y: 0, width: 20, height: 10 } }, items[2]],
      'horizontal',
    )
    // Gaps of (110 - 40) / 2 = 35: b starts at 10 + 35.
    expect(offsets.get('b')).toEqual([25, 0])
  })
})
