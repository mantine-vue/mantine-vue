import type { VNodeChild } from 'vue'
import type { BoxProps, Factory, MantineColor, MantineRadius } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ConnectionRules } from '../../core/connectors'
import type { DiagramCommand, DiagramPlugin, DiagramTool } from '../../core/editor'
import type { Point, Rect } from '../../core/geometry'
import type { DiagramRouter } from '../../core/routing'
import type {
  DiagramDocument,
  DiagramEdge,
  DiagramEdgeEndpoint,
  DiagramInteractionMode,
  DiagramNode,
  DiagramPointerEvent,
  DiagramViewport,
} from '../../core/types'
import type { DiagramLabelsOverride } from '../../labels'
import type { DiagramExtension, DiagramNodeType, DiagramTemplate } from '../../vue/types'
import type { DiagramController } from '../../vue/use-diagram'

export type DiagramStylesNames =
  | 'root'
  | 'provider'
  | 'canvas'
  | 'svg'
  | 'page'
  | 'node'
  | 'htmlNode'
  | 'edge'
  | 'edgePath'
  | 'edgeLabel'
  | 'selectionLayer'
  | 'selectionFrame'
  | 'resizeHandle'
  | 'rotateHandle'
  | 'rotateLine'
  | 'vertexHandle'
  | 'edgeSelection'
  | 'segmentHandle'
  | 'waypointHandle'
  | 'edgeEndHandle'
  | 'port'
  | 'overlayLayer'
  | 'snapLine'
  | 'guide'
  | 'marquee'
  | 'draft'
  | 'draftPoint'
  | 'connectionPreview'
  | 'measurement'
  | 'measurementLine'
  | 'textEditor'
  | 'panel'
  | 'toolbar'
  | 'toolbarDivider'
  | 'controls'
  | 'zoomLabel'
  | 'minimap'
  | 'minimapCanvas'
  | 'ruler'
  | 'rulerHighlight'
  | 'rulerCorner'
  | 'sidePanel'
  | 'sidePanelTitle'
  | 'layerRow'
  | 'layerName'
  | 'objectRow'
  | 'paletteGrid'
  | 'paletteItem'
  | 'liveRegion'

type DiagramCssVariable =
  | '--diagram-accent'
  | '--diagram-accent-light'
  | '--diagram-radius'
  | '--diagram-background'

export type DiagramCssVariables = {
  root: DiagramCssVariable
  provider: DiagramCssVariable
}

export interface DiagramGridOptions {
  /** `'lines'` or `'dots'` */
  type?: 'lines' | 'dots'
  /** Every n-th line is drawn stronger, `5` by default, `0` disables major lines */
  majorEvery?: number
}

export type DiagramMenuItem =
  | string
  | '-'
  | {
      id: string
      label: string
      /** Name of a built-in icon */
      icon?: string
      color?: MantineColor
      disabled?: boolean
      onClick: (controller: DiagramController) => void
    }

/** Where and for what the context menu is open. */
export interface DiagramMenuState {
  /** Client position */
  x: number
  y: number
  scope: 'selection' | 'canvas'
  /** World position */
  point: Point
}

export interface DiagramContextMenuContext {
  controller: DiagramController
  scope: 'selection' | 'canvas'
  /** World position the menu was opened at */
  point: Point
}

export interface DiagramSlots {
  /** Panels rendered over the canvas, e.g. `DiagramToolbar`, `DiagramControls` or `DiagramMinimap` */
  default?: () => VNodeChild
}

export interface DiagramEmits {
  'update:modelValue': [document: DiagramDocument]
  'update:selection': [ids: string[]]
  'update:viewport': [viewport: DiagramViewport]
  'update:mode': [mode: DiagramInteractionMode]
  /** A change was committed to the history, or undone or redone */
  change: [document: DiagramDocument]
  nodeClick: [node: DiagramNode, event: DiagramPointerEvent]
  nodeDoubleClick: [node: DiagramNode]
  edgeClick: [edge: DiagramEdge, event: DiagramPointerEvent]
  canvasClick: [point: Point]
  canvasDoubleClick: [point: Point]
  /** A connector was created by the user */
  connect: [edge: DiagramEdge]
  /** A connector was dropped where it could not connect, e.g. to create a node there */
  connectEnd: [payload: { source: DiagramEdgeEndpoint; point: Point; edgeId?: string }]
  /** The controller is ready, also exposed through a template ref */
  ready: [controller: DiagramController]
}

export interface DiagramExposed {
  controller: DiagramController
}

export interface DiagramOwnProps extends StylesApiProps<DiagramFactory> {
  /** Controller from `useDiagram`, to drive the diagram from outside. Props that configure the editor are ignored then */
  controller?: DiagramController

  /** Controlled document, bound with `v-model`. Updated after every committed change */
  modelValue?: DiagramDocument

  /** Document loaded on mount when the component is uncontrolled */
  defaultValue?: Partial<DiagramDocument>

  /** Controlled selection, bound with `v-model:selection` */
  selection?: string[]

  /** Controlled viewport, bound with `v-model:viewport` */
  viewport?: DiagramViewport

  /**
   * `'edit'` allows every change, `'select'` only selection, `'view'` only panning and zooming
   *
   * @default 'edit'
   */
  mode?: DiagramInteractionMode

  /** Node types with renderers, added to the built-in ones */
  nodeTypes?: DiagramNodeType[]

  /** Extensions, e.g. `floorPlanExtension()` or `restaurantExtension()` */
  extensions?: DiagramExtension[]

  /** Additional pointer tools */
  tools?: DiagramTool[]

  /** Additional commands */
  commands?: DiagramCommand[]

  /** Core plugins */
  plugins?: DiagramPlugin[]

  /** Additional connector routers by name */
  routers?: Record<string, DiagramRouter>

  /** Templates offered by `DiagramPalette` */
  templates?: DiagramTemplate[]

  /**
   * Background grid, `false` hides it
   *
   * @default true
   */
  grid?: boolean | DiagramGridOptions

  /**
   * Grid size in world units when the document does not set one
   *
   * @default 20
   */
  gridSize?: number

  /**
   * Snaps moved and resized elements to the grid
   *
   * @default true
   */
  snapToGrid?: boolean

  /**
   * Snaps to the edges and centers of nearby elements and shows guides
   *
   * @default true
   */
  smartGuides?: boolean

  /** Shows rulers with the units of the document scale. Dragging from a ruler creates a guide */
  rulers?: boolean

  /**
   * Smallest zoom level
   *
   * @default 0.1
   */
  minZoom?: number

  /**
   * Largest zoom level
   *
   * @default 4
   */
  maxZoom?: number

  /** World area the viewport is limited to */
  translateExtent?: Rect

  /** Fits the content into the view on mount */
  fitView?: boolean

  /**
   * What the mouse wheel does without modifier keys. Pinch and Ctrl + wheel always zoom
   *
   * @default 'pan'
   */
  wheelMode?: 'pan' | 'zoom'

  /**
   * Nodes are culled outside of the viewport once a diagram has this many nodes, `false`
   * renders every node
   *
   * @default 300
   */
  culling?: number | false

  /**
   * Maximum number of undo steps
   *
   * @default 100
   */
  historyLimit?: number

  /** Rules and validation of new connections */
  connectionRules?: ConnectionRules & { radius?: number }

  /** Defaults of new connectors, e.g. `{ type: 'bezier' }` */
  defaultEdge?: Partial<Omit<DiagramEdge, 'id' | 'source' | 'target'>>

  /** Rejects interactive moves, resizes and rotations, e.g. to prevent overlaps */
  validateTransform?: (controller: DiagramController, nodes: readonly DiagramNode[]) => boolean

  /** Shortcut overrides by command id, `false` disables keyboard shortcuts */
  shortcuts?: Record<string, string | string[] | null> | false

  /** Items of the context menu, a function to build them per opening or `false` to disable it */
  contextMenu?:
    | DiagramMenuItem[]
    | ((context: DiagramContextMenuContext) => DiagramMenuItem[])
    | false

  /** Accent color of selections, handles and guides */
  color?: MantineColor

  /** Border radius of the canvas and panels */
  radius?: MantineRadius

  /** Canvas background color */
  background?: string

  /** Overrides of user facing texts */
  labels?: DiagramLabelsOverride
}

export interface DiagramProps extends Omit<BoxProps, keyof DiagramOwnProps>, DiagramOwnProps {}

export type DiagramFactory = Factory<{
  props: DiagramProps
  ref: HTMLDivElement
  slots: DiagramSlots
  emits: DiagramEmits
  element: 'div'
  stylesNames: DiagramStylesNames
  vars: DiagramCssVariables
  exposed: DiagramExposed
}>
