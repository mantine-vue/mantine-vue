import {
  boxBounds,
  ellipsePoints,
  localToWorld,
  rectFromPoints,
  regularPolygonPoints,
  unionRects,
  rotatePoint,
  type Point,
  type Rect,
} from './geometry'
import type { DiagramNode, DiagramPort, DiagramResizeHandle } from './types'

/**
 * Geometry and editing behavior of a node type. Behaviors are framework agnostic, the Vue
 * layer pairs them with a renderer component.
 */
export interface DiagramNodeBehavior {
  type: string
  /** Defaults merged into new nodes of this type */
  defaults?: Partial<Omit<DiagramNode, 'id' | 'type'>>
  /** Outline in local coordinates, used for hit testing, connector ends and collisions */
  outline?: (node: DiagramNode) => Point[]
  /**
   * Set when the outline reaches outside of the node box, e.g. chairs around a table. Spatial
   * queries then use the outline bounds.
   */
  outlineExceedsBox?: boolean
  /** Default ports, used when the node has no `ports` */
  ports?: (node: DiagramNode) => DiagramPort[]
  /** `false` hides resize handles, `'proportional'` keeps the aspect ratio. `true` by default */
  resizable?: boolean | 'proportional'
  /** Resize handles to show, e.g. only `['w', 'e']` for walls that change length only */
  resizeHandles?: DiagramResizeHandle[]
  /** `true` by default */
  rotatable?: boolean
  /** Whether connectors can attach to the node, `true` by default */
  connectable?: boolean
  /** `true` by default */
  selectable?: boolean
  /** Whether double click edits the label, `true` by default */
  editableText?: boolean
  /** Rotation step in degrees used by the rotate handle while Shift is pressed, `15` by default */
  rotationStep?: number
  minWidth?: number
  minHeight?: number
  /** Adjusts type specific data after a resize, e.g. scales polygon points */
  resize?: (node: DiagramNode, previous: DiagramNode) => DiagramNode
  /** Editable vertices of polygons and polylines */
  points?: {
    get: (node: DiagramNode) => Point[]
    set: (node: DiagramNode, points: Point[]) => DiagramNode
    closed: boolean
    /** Minimum number of vertices, `2` for polylines and `3` for polygons by default */
    min?: number
  }
  /** Rewrites ids stored in `data` when nodes are pasted or duplicated */
  remapReferences?: (node: DiagramNode, ids: ReadonlyMap<string, string>) => DiagramNode
  /** Groups contain other nodes and take the bounds of their children */
  container?: boolean
  /** Text box of the label in local coordinates, the whole box by default */
  labelBox?: (node: DiagramNode) => Rect
}

const rectOutline = (node: DiagramNode): Point[] => [
  { x: 0, y: 0 },
  { x: node.width, y: 0 },
  { x: node.width, y: node.height },
  { x: 0, y: node.height },
]

/** Ports at the middle of the four sides. */
export const sidePorts = (): DiagramPort[] => [
  { id: 'top', x: 0.5, y: 0, side: 'top' },
  { id: 'right', x: 1, y: 0.5, side: 'right' },
  { id: 'bottom', x: 0.5, y: 1, side: 'bottom' },
  { id: 'left', x: 0, y: 0.5, side: 'left' },
]

const scalePoints = (points: Point[], sx: number, sy: number) =>
  points.map((p) => ({ x: p.x * sx, y: p.y * sy }))

/** Reads `data.points` as an array of points. */
export function getDataPoints(node: DiagramNode): Point[] {
  const points = node.data?.points

  return Array.isArray(points)
    ? points
        .filter((p: any) => p && Number.isFinite(p.x) && Number.isFinite(p.y))
        .map((p: any) => ({ x: p.x, y: p.y }))
    : []
}

function scaleDataPoints(node: DiagramNode, previous: DiagramNode): DiagramNode {
  const sx = previous.width > 0 ? node.width / previous.width : 1
  const sy = previous.height > 0 ? node.height / previous.height : 1

  return { ...node, data: { ...node.data, points: scalePoints(getDataPoints(previous), sx, sy) } }
}

/**
 * Builds the box of a node that contains the given world points, keeping its rotation. Returns
 * the box and the points relative to it.
 */
export function fitPointsToBox(worldPoints: readonly Point[], rotation = 0) {
  const pivot = worldPoints[0] ?? { x: 0, y: 0 }
  const unrotated = worldPoints.map((p) => rotatePoint(p, pivot, -rotation))
  const bounds = rectFromPoints(unrotated)
  const center = rotatePoint(
    { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
    pivot,
    rotation,
  )

  return {
    x: center.x - bounds.width / 2,
    y: center.y - bounds.height / 2,
    width: bounds.width,
    height: bounds.height,
    points: unrotated.map((p) => ({ x: p.x - bounds.x, y: p.y - bounds.y })),
  }
}

/** Vertex editing of nodes that store their points in `data.points`, local to the node box. */
export function createPointsBehavior(closed: boolean): NonNullable<DiagramNodeBehavior['points']> {
  return {
    closed,
    min: closed ? 3 : 2,
    get: getDataPoints,
    set: (node, points) => {
      const world = points.map((p) => localToWorld(flipLocal(p, node), node))
      const box = fitPointsToBox(world, node.rotation ?? 0)
      const local = box.points.map((p) => flipLocal(p, { ...node, ...box }))

      return {
        ...node,
        x: box.x,
        y: box.y,
        width: Math.max(box.width, 1),
        height: Math.max(box.height, 1),
        data: { ...node.data, points: local },
      }
    },
  }
}

/** Applies the flips of a node to a local point. Flipping twice restores the point. */
export function flipLocal(
  p: Point,
  node: Pick<DiagramNode, 'width' | 'height' | 'flipX' | 'flipY'>,
) {
  return {
    x: node.flipX ? node.width - p.x : p.x,
    y: node.flipY ? node.height - p.y : p.y,
  }
}

const polygonOutline = (factory: (w: number, h: number) => Point[]) => (node: DiagramNode) =>
  factory(node.width, node.height)

/** Outline points of the built-in polygon shapes in a `w` × `h` box. */
export const SHAPE_OUTLINES: Record<string, (w: number, h: number) => Point[]> = {
  diamond: (w, h) => [
    { x: w / 2, y: 0 },
    { x: w, y: h / 2 },
    { x: w / 2, y: h },
    { x: 0, y: h / 2 },
  ],
  triangle: (w, h) => [
    { x: w / 2, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ],
  hexagon: (w, h) => [
    { x: w * 0.25, y: 0 },
    { x: w * 0.75, y: 0 },
    { x: w, y: h / 2 },
    { x: w * 0.75, y: h },
    { x: w * 0.25, y: h },
    { x: 0, y: h / 2 },
  ],
  parallelogram: (w, h) => [
    { x: w * 0.2, y: 0 },
    { x: w, y: 0 },
    { x: w * 0.8, y: h },
    { x: 0, y: h },
  ],
  trapezoid: (w, h) => [
    { x: w * 0.2, y: 0 },
    { x: w * 0.8, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ],
  star: (w, h) => regularPolygonPoints(5, w, h, { innerRatio: 0.45 }),
  octagon: (w, h) => regularPolygonPoints(8, w, h, { startAngle: -67.5 }),
}

const shape = (type: string, behavior: Omit<DiagramNodeBehavior, 'type'>): DiagramNodeBehavior => ({
  type,
  ports: sidePorts,
  ...behavior,
})

/** Behaviors of the built-in node types. */
export const BUILT_IN_NODE_BEHAVIORS: DiagramNodeBehavior[] = [
  shape('rect', { defaults: { width: 160, height: 80 }, outline: rectOutline }),
  shape('ellipse', {
    defaults: { width: 140, height: 90 },
    outline: (node) => ellipsePoints(node.width, node.height),
  }),
  shape('circle', {
    defaults: { width: 100, height: 100 },
    resizable: 'proportional',
    outline: (node) => ellipsePoints(node.width, node.height),
  }),
  ...Object.entries(SHAPE_OUTLINES).map(([type, factory]) =>
    shape(type, { defaults: { width: 140, height: 100 }, outline: polygonOutline(factory) }),
  ),
  shape('stadium', { defaults: { width: 160, height: 60 }, outline: rectOutline }),
  shape('cylinder', { defaults: { width: 110, height: 130 }, outline: rectOutline }),
  shape('document', { defaults: { width: 150, height: 100 }, outline: rectOutline }),
  shape('note', { defaults: { width: 160, height: 120 }, outline: rectOutline }),
  shape('polygon', {
    defaults: {
      width: 120,
      height: 100,
      data: {
        points: [
          { x: 60, y: 0 },
          { x: 120, y: 100 },
          { x: 0, y: 100 },
        ],
      },
    },
    outline: getDataPoints,
    resize: scaleDataPoints,
    points: createPointsBehavior(true),
  }),
  {
    type: 'line',
    defaults: {
      width: 160,
      height: 1,
      data: {
        points: [
          { x: 0, y: 0 },
          { x: 160, y: 0 },
        ],
      },
    },
    outline: getDataPoints,
    resize: scaleDataPoints,
    points: createPointsBehavior(false),
    connectable: false,
    editableText: false,
  },
  shape('path', { defaults: { width: 100, height: 100 }, outline: rectOutline }),
  {
    type: 'text',
    defaults: { width: 160, height: 40, label: 'Text' },
    outline: rectOutline,
    ports: sidePorts,
  },
  {
    type: 'image',
    defaults: { width: 160, height: 120 },
    outline: rectOutline,
    ports: sidePorts,
    editableText: false,
  },
  {
    type: 'group',
    container: true,
    outline: rectOutline,
    connectable: false,
    editableText: false,
    rotatable: false,
  },
]

/** Fallback for types without a behavior, e.g. custom components that only need a box. */
export const DEFAULT_NODE_BEHAVIOR: DiagramNodeBehavior = {
  type: '*',
  outline: rectOutline,
  ports: sidePorts,
}

/** Lookup of behaviors by type. */
export class DiagramBehaviorRegistry {
  private behaviors = new Map<string, DiagramNodeBehavior[]>()

  constructor(behaviors: readonly DiagramNodeBehavior[] = BUILT_IN_NODE_BEHAVIORS) {
    behaviors.forEach((behavior) => this.register(behavior))
  }

  register(behavior: DiagramNodeBehavior) {
    const stack = this.behaviors.get(behavior.type) ?? []
    stack.push(behavior)
    this.behaviors.set(behavior.type, stack)

    return () => {
      const current = this.behaviors.get(behavior.type)

      if (!current) {
        return
      }

      const index = current.lastIndexOf(behavior)

      if (index !== -1) {
        current.splice(index, 1)
      }

      if (current.length === 0) {
        this.behaviors.delete(behavior.type)
      }
    }
  }

  has(type: string) {
    return (this.behaviors.get(type)?.length ?? 0) > 0
  }

  get(type: string): DiagramNodeBehavior {
    return this.behaviors.get(type)?.at(-1) ?? DEFAULT_NODE_BEHAVIOR
  }

  list() {
    return [...this.behaviors.values()].flatMap((stack) => stack.at(-1) ?? [])
  }
}

/** Outline of a node in world coordinates. */
export function getNodeOutline(node: DiagramNode, behavior: DiagramNodeBehavior): Point[] {
  const local = (behavior.outline ?? rectOutline)(node)
  const outline = local.length >= 2 ? local : rectOutline(node)

  return outline.map((p) => localToWorld(flipLocal(p, node), node))
}

/** Axis aligned bounds of a node, including its rotation. */
export function getNodeBounds(node: DiagramNode): Rect {
  return boxBounds(node)
}

/** Bounds used by spatial queries: the box, or the outline when it exceeds the box. */
export function getNodeQueryBounds(node: DiagramNode, behavior: DiagramNodeBehavior): Rect {
  if (!behavior.outlineExceedsBox) {
    return boxBounds(node)
  }

  return unionRects([boxBounds(node), rectFromPoints(getNodeOutline(node, behavior))])!
}

export function getNodePorts(node: DiagramNode, behavior: DiagramNodeBehavior): DiagramPort[] {
  if (node.ports) {
    return node.ports
  }

  if (behavior.connectable === false) {
    return []
  }

  return behavior.ports?.(node) ?? []
}
