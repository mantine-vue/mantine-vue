import type { Point, Rect } from './geometry'

export type DiagramId = string

/** Visual style shared by nodes and edges. Colors accept CSS colors and Mantine theme colors. */
export interface DiagramStyle {
  /** Fill color, e.g. `'#fff'`, `'blue.1'` or `'transparent'` */
  fill?: string
  /** Outline color */
  stroke?: string
  /** Outline width in world units */
  strokeWidth?: number
  /** SVG dash pattern, e.g. `'6 4'` */
  strokeDasharray?: string
  /** Opacity of the whole element, 0–1 */
  opacity?: number
  /** Opacity of the fill only, 0–1 */
  fillOpacity?: number
  /** Drop shadow: `true` for the theme shadow or a custom one */
  shadow?: boolean | DiagramShadow
  /** Corner radius of rectangular shapes and orthogonal connectors */
  cornerRadius?: number
  /** Label color */
  textColor?: string
  /** Label font size in world units */
  fontSize?: number
  fontWeight?: number | 'normal' | 'bold'
  fontFamily?: string
  fontStyle?: 'normal' | 'italic'
  textAlign?: 'start' | 'middle' | 'end'
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

export interface DiagramShadow {
  x?: number
  y?: number
  blur?: number
  color?: string
}

export type DiagramSide = 'top' | 'right' | 'bottom' | 'left'

/** A connection point on a node, positioned relative to the node box (0–1 on both axes). */
export interface DiagramPort {
  id: string
  /** Horizontal position, 0 = left edge, 1 = right edge */
  x: number
  /** Vertical position, 0 = top edge, 1 = bottom edge */
  y: number
  /** Direction a connector leaves the port in, derived from the position when omitted */
  side?: DiagramSide
  /** Whether the port accepts outgoing, incoming or both kinds of connections, `'both'` by default */
  kind?: 'source' | 'target' | 'both'
  /** Maximum number of connectors attached to this port */
  maxConnections?: number
  label?: string
}

/** A run of rich text with its own formatting. */
export interface DiagramTextRun {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  fontSize?: number
}

/** A paragraph of rich text. */
export type DiagramRichText = DiagramTextRun[][]

export interface DiagramNode<TData extends Record<string, any> = Record<string, any>> {
  /** Stable identifier, unique among nodes and edges */
  id: DiagramId
  /** Registered node type, e.g. `'rect'`, `'ellipse'` or a custom one */
  type: string
  /** Left edge of the unrotated box in world coordinates */
  x: number
  /** Top edge of the unrotated box in world coordinates */
  y: number
  width: number
  height: number
  /** Clockwise rotation in degrees around the center of the box */
  rotation?: number
  /** Mirrors the shape horizontally */
  flipX?: boolean
  /** Mirrors the shape vertically */
  flipY?: boolean
  /** Group that contains the node */
  parentId?: DiagramId
  /** Layer of the node, the first layer when omitted */
  layerId?: string
  /** Plain text label */
  label?: string
  /** Formatted label, takes precedence over `label` when rendering */
  richText?: DiagramRichText
  style?: DiagramStyle
  /** Connection ports, the node type defaults are used when omitted */
  ports?: DiagramPort[]
  /** Locked nodes can be selected but not moved, resized, rotated or deleted */
  locked?: boolean
  /** Hidden nodes are not rendered and cannot be selected */
  hidden?: boolean
  /** Type specific data, e.g. polygon points or the number of seats of a table */
  data?: TData
  /** Application metadata, never read by the diagram */
  meta?: Record<string, unknown>
}

export interface DiagramEdgeEndpoint {
  /** Connected node, omit for a free end at `point` */
  nodeId?: DiagramId
  /** Port of the connected node, omit to connect to the node outline */
  portId?: string
  /** World position of a free end */
  point?: Point
}

/** Built-in arrowheads. Custom markers can be registered under any other name. */
export type DiagramArrowhead =
  | 'none'
  | 'arrow'
  | 'triangle'
  | 'open-triangle'
  | 'diamond'
  | 'open-diamond'
  | 'circle'
  | 'open-circle'
  | 'bar'
  | (string & {})

export interface DiagramEdgeLabel {
  text: string
  /** Position along the connector, 0 = source, 1 = target, `0.5` by default */
  position?: number
  /** Offset perpendicular to the connector in world units */
  offset?: number
}

export interface DiagramEdge<TData extends Record<string, any> = Record<string, any>> {
  id: DiagramId
  source: DiagramEdgeEndpoint
  target: DiagramEdgeEndpoint
  /** Router, `'straight'`, `'orthogonal'`, `'bezier'`, `'rounded'` or a custom one */
  type?: string
  /** Control points the connector passes through */
  waypoints?: Point[]
  /** Single label shown at the middle */
  label?: string
  /** Additional labels at arbitrary positions */
  labels?: DiagramEdgeLabel[]
  style?: DiagramStyle
  sourceArrow?: DiagramArrowhead
  /** Arrowhead at the target end, `'arrow'` by default */
  targetArrow?: DiagramArrowhead
  layerId?: string
  locked?: boolean
  hidden?: boolean
  data?: TData
  meta?: Record<string, unknown>
}

export interface DiagramLayer {
  id: string
  name: string
  /** Hidden layers are not rendered */
  visible?: boolean
  /** Elements on locked layers cannot be selected on the canvas */
  locked?: boolean
  /** Opacity of the layer, 0–1 */
  opacity?: number
  /** Free form classification, e.g. `'floor'` for multi-floor plans */
  kind?: string
  meta?: Record<string, unknown>
}

export type DiagramLengthUnit = 'px' | 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'ft-in'

export interface DiagramScale {
  /** World units per meter. `100` means that one world unit is one centimeter. */
  pixelsPerMeter: number
  /** Unit used to display lengths */
  unit: DiagramLengthUnit
  /** Fraction digits of displayed lengths */
  precision?: number
}

export interface DiagramGuide {
  id: string
  /** `'x'` is a vertical line at `x = value`, `'y'` a horizontal line at `y = value` */
  axis: 'x' | 'y'
  value: number
}

export interface DiagramSettings {
  /** Grid size in world units */
  gridSize?: number
  /** Real world scale for measurements, rulers and floor plans */
  scale?: DiagramScale
  /** Page or floor boundary, rendered behind the content */
  bounds?: Rect
  /** Canvas background color */
  background?: string
  /** User guide lines */
  guides?: DiagramGuide[]
}

/** Serializable diagram document. */
export interface DiagramDocument {
  /** Schema version used for migrations */
  version: number
  id?: string
  name?: string
  /** Nodes in rendering order, back to front */
  nodes: DiagramNode[]
  /** Edges in rendering order, back to front */
  edges: DiagramEdge[]
  layers?: DiagramLayer[]
  settings?: DiagramSettings
  meta?: Record<string, unknown>
}

export type DiagramElement = DiagramNode | DiagramEdge

export interface DiagramViewport {
  /** Horizontal screen offset of the world origin */
  x: number
  /** Vertical screen offset of the world origin */
  y: number
  zoom: number
}

export type DiagramResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

/** What is under the pointer, resolved by the renderer and passed to tools. */
export type DiagramHitTarget =
  | { kind: 'canvas' }
  | { kind: 'node'; id: DiagramId }
  | { kind: 'edge'; id: DiagramId }
  | { kind: 'resize'; handle: DiagramResizeHandle }
  | { kind: 'rotate' }
  | { kind: 'port'; nodeId: DiagramId; portId: string }
  | { kind: 'edge-end'; edgeId: DiagramId; end: 'source' | 'target' }
  | { kind: 'waypoint'; edgeId: DiagramId; index: number }
  | { kind: 'segment'; edgeId: DiagramId; index: number }
  | { kind: 'vertex'; nodeId: DiagramId; index: number }
  | { kind: 'guide'; id: string }

export interface DiagramPointerEvent {
  /** Pointer position in world coordinates */
  world: Point
  /** Pointer position relative to the canvas element */
  screen: Point
  target: DiagramHitTarget
  button: number
  pointerId: number
  pointerType: string
  shiftKey: boolean
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  /** Click count of the gesture, 2 for double clicks */
  detail: number
}

/** A guide line shown while moving or resizing elements. */
export interface DiagramSnapLine {
  axis: 'x' | 'y'
  value: number
  from: number
  to: number
}

/** A measurement shown while drawing or transforming. */
export interface DiagramMeasurement {
  from: Point
  to: Point
  text: string
}

/** Transient state of the current interaction, rendered on top of the content. */
export interface DiagramOverlay {
  snapLines: DiagramSnapLine[]
  marquee: Rect | null
  lasso: Point[] | null
  /** Connector being drawn */
  connection: {
    from: Point
    to: Point
    targetNodeId?: DiagramId
    targetPortId?: string
    valid: boolean
  } | null
  /** Shape being drawn, as a polygon or polyline in world coordinates */
  draft: { points: Point[]; closed: boolean; rect?: Rect } | null
  measurements: DiagramMeasurement[]
  /** Node whose ports are shown */
  hoverNodeId: DiagramId | null
}

export type DiagramInteractionMode = 'edit' | 'select' | 'view'
