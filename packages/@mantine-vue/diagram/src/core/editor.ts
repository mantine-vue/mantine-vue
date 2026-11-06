import {
  alignRects,
  distributeRects,
  type DiagramAlignment,
  type DiagramDistribution,
} from './alignment'
import { createBuiltInCommands } from './commands'
import {
  clonePayload,
  createClipboardPayload,
  parseClipboard,
  serializeClipboard,
  type DiagramClipboardPayload,
} from './clipboard'
import { isConnectionValid, resolveEdgeEndpoints, type ConnectionRules } from './connectors'
import { Emitter } from './emitter'
import {
  boxCenter,
  distanceToPolyline,
  expandRect,
  pointInPolygon,
  polygonsIntersect,
  rectContainsRect,
  rectFromPoints,
  rectsIntersect,
  rotatePoint,
  unionRects,
  type Point,
  type Rect,
} from './geometry'
import { gridLayout, layeredLayout, treeLayout, type DiagramLayoutOptions } from './layout'
import { applyDiagramPatch, type DiagramPatch } from './patch'
import { BUILT_IN_ROUTERS, type DiagramRouter, type RouteResult } from './routing'
import {
  DiagramBehaviorRegistry,
  BUILT_IN_NODE_BEHAVIORS,
  getNodeBounds,
  getNodeOutline,
  getNodeQueryBounds,
  type DiagramNodeBehavior,
} from './shapes'
import { SpatialIndex } from './spatial-index'
import { createPanTool } from './tools/basic-tools'
import { createSelectTool } from './tools/select-tool'
import {
  DEFAULT_LAYER_ID,
  DiagramStore,
  type DiagramChange,
  type DiagramHistoryEntry,
} from './store'
import type {
  DiagramDocument,
  DiagramEdge,
  DiagramEdgeEndpoint,
  DiagramHitTarget,
  DiagramId,
  DiagramInteractionMode,
  DiagramLayer,
  DiagramNode,
  DiagramOverlay,
  DiagramPointerEvent,
  DiagramSettings,
  DiagramViewport,
} from './types'
import { PIXEL_SCALE } from './units'
import {
  constrainViewport,
  DEFAULT_VIEWPORT,
  fitRect,
  getVisibleRect,
  interpolateViewport,
  screenToWorld,
  viewportsEqual,
  worldToScreen,
  zoomAtPoint,
  type ViewportSize,
} from './viewport'

/** A pointer tool: select, pan, draw a shape, draw walls and so on. */
export interface DiagramTool {
  id: string
  /** Label shown in toolbars */
  label?: string
  /** CSS cursor of the canvas while the tool is active */
  cursor?: string
  /** Icon name of the built-in icon set, or a key a custom toolbar understands */
  icon?: string
  /** Tools that create elements are disabled outside of the edit mode */
  edits?: boolean
  activate?: (editor: DiagramEditor) => void
  deactivate?: (editor: DiagramEditor) => void
  pointerDown?: (editor: DiagramEditor, event: DiagramPointerEvent) => void
  pointerMove?: (editor: DiagramEditor, event: DiagramPointerEvent) => void
  pointerUp?: (editor: DiagramEditor, event: DiagramPointerEvent) => void
  doubleClick?: (editor: DiagramEditor, event: DiagramPointerEvent) => void
  /** Returns `true` when the key was handled and must not reach the shortcuts */
  keyDown?: (editor: DiagramEditor, event: DiagramKeyEvent) => boolean
  /** Aborts the current gesture */
  cancel?: (editor: DiagramEditor) => void
}

export interface DiagramKeyEvent {
  key: string
  shiftKey: boolean
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
}

export interface DiagramCommand {
  id: string
  label: string
  /** Default shortcuts in the format of `@mantine-vue/hooks` hotkeys, e.g. `'mod+Z'` */
  shortcuts?: string[]
  /** Whether the command works outside of the edit mode, `false` by default */
  readOnly?: boolean
  /**
   * Keeps the shortcuts away from the browser while the command is disabled, e.g. so that
   * Ctrl + + at the largest zoom level does not zoom the page instead
   */
  captureShortcuts?: boolean
  isEnabled?: (editor: DiagramEditor) => boolean
  run: (editor: DiagramEditor) => void
}

/** Extends an editor with node types, tools, commands and event handlers. */
export interface DiagramPlugin {
  name: string
  /** Called once per editor. The returned function runs when the editor is destroyed */
  install: (editor: DiagramEditor) => void | (() => void)
}

/** Called after nodes were moved, resized or rotated interactively, inside the same transaction. */
export type DiagramTransformHook = (editor: DiagramEditor, ids: ReadonlySet<DiagramId>) => void

export interface DiagramEditorOptions {
  document?: Partial<DiagramDocument>
  /** Behaviors added to (or replacing) the built-in node types */
  behaviors?: readonly DiagramNodeBehavior[]
  /** Connector routers added to the built-in ones */
  routers?: Record<string, DiagramRouter>
  tools?: readonly DiagramTool[]
  commands?: readonly DiagramCommand[]
  plugins?: readonly DiagramPlugin[]
  historyLimit?: number
  mode?: DiagramInteractionMode
  minZoom?: number
  maxZoom?: number
  /** World area the viewport may show */
  translateExtent?: Rect
  viewport?: DiagramViewport
  /** Default grid size when the document does not define one, `20` by default */
  gridSize?: number
  snapToGrid?: boolean
  /** Snap to the edges and centers of other elements, `true` by default */
  smartGuides?: boolean
  /** Snapping distance in screen pixels, `6` by default */
  snapThreshold?: number
  connection?: ConnectionRules & {
    /** Distance in screen pixels within which ports attract connectors, `24` by default */
    radius?: number
  }
  /** Defaults of new edges */
  defaultEdge?: Partial<Omit<DiagramEdge, 'id' | 'source' | 'target'>>
  /** `'contain'` selects elements fully inside the marquee, `'intersect'` touching ones */
  marqueeMode?: 'contain' | 'intersect'
  /** Offset of pasted and duplicated elements in world units, `20` by default */
  pasteOffset?: number
  /** Distance moved by arrow keys, and with Shift */
  nudge?: { small: number; large: number }
  /** Rejects interactive transforms, e.g. to prevent overlapping furniture */
  validateTransform?: (editor: DiagramEditor, nodes: readonly DiagramNode[]) => boolean
  /** Rotation step of the rotate handle while Shift is pressed, `15` by default */
  rotationStep?: number
}

export interface DiagramEditorEvents {
  change: DiagramChange
  commit: DiagramHistoryEntry
  routes: void
  history: { canUndo: boolean; canRedo: boolean }
  selection: DiagramId[]
  viewport: DiagramViewport
  resize: ViewportSize
  overlay: DiagramOverlay
  tool: string
  mode: DiagramInteractionMode
  options: void
  editing: DiagramEditingTarget | null
  activeLayer: string
  nodeClick: { node: DiagramNode; event: DiagramPointerEvent }
  nodeDoubleClick: { node: DiagramNode; event: DiagramPointerEvent }
  edgeClick: { edge: DiagramEdge; event: DiagramPointerEvent }
  canvasClick: { point: Point; event: DiagramPointerEvent }
  canvasDoubleClick: { point: Point; event: DiagramPointerEvent }
  connect: DiagramEdge
  /** A connector was dropped where it could not connect */
  connectEnd: { source: DiagramEdgeEndpoint; point: Point; edgeId?: DiagramId }
}

export interface DiagramEditingTarget {
  kind: 'node' | 'edge'
  id: DiagramId
}

export const EMPTY_OVERLAY: DiagramOverlay = {
  snapLines: [],
  marquee: null,
  lasso: null,
  connection: null,
  draft: null,
  measurements: [],
  hoverNodeId: null,
}

type ResolvedOptions = Required<
  Omit<
    DiagramEditorOptions,
    | 'document'
    | 'behaviors'
    | 'routers'
    | 'tools'
    | 'commands'
    | 'plugins'
    | 'translateExtent'
    | 'viewport'
    | 'validateTransform'
    | 'historyLimit'
  >
> &
  Pick<DiagramEditorOptions, 'translateExtent' | 'validateTransform'>

/**
 * Framework agnostic diagram editor. Owns the document store, selection, viewport, tools,
 * commands and plugins. The Vue layer mirrors its state into refs.
 */
export class DiagramEditor {
  readonly store: DiagramStore
  readonly behaviors: DiagramBehaviorRegistry
  readonly events = new Emitter<DiagramEditorEvents>()
  readonly index = new SpatialIndex<DiagramId>(256)

  options: ResolvedOptions
  /** Set by renderers that honor `prefers-reduced-motion` */
  reducedMotion = false

  private routers = new Map<string, DiagramRouter>(Object.entries(BUILT_IN_ROUTERS))
  private tools = new Map<string, DiagramTool>()
  private commands = new Map<string, DiagramCommand>()
  private transformHooks = new Set<DiagramTransformHook>()
  private pluginCleanups: (() => void)[] = []
  private installedPlugins = new Set<string>()
  private routeCache = new WeakMap<DiagramEdge, { key: unknown[]; result: RouteResult }>()
  private obstacleVersion = 0
  private obstacleSignatures = new Map<DiagramId, string>()

  private selectionSet = new Set<DiagramId>()
  private viewportState: DiagramViewport
  private size: ViewportSize = { width: 0, height: 0 }
  private overlayState: DiagramOverlay = EMPTY_OVERLAY
  private modeState: DiagramInteractionMode
  private toolId = 'select'
  private activeLayer: string
  private editingState: DiagramEditingTarget | null = null
  private clipboard: DiagramClipboardPayload | null = null
  private pasteCount = 0
  private animation: number | null = null
  private panGesture: { start: Point; viewport: DiagramViewport; pointerId: number } | null = null
  private unsubscribeStore: (() => void)[] = []

  /** Group whose children are selected individually after a double click */
  enteredGroupId: DiagramId | null = null

  constructor(options: DiagramEditorOptions = {}) {
    this.store = new DiagramStore(undefined, { historyLimit: options.historyLimit })
    this.behaviors = new DiagramBehaviorRegistry([
      ...BUILT_IN_NODE_BEHAVIORS,
      ...(options.behaviors ?? []),
    ])
    this.options = {
      mode: options.mode ?? 'edit',
      minZoom: options.minZoom ?? 0.1,
      maxZoom: options.maxZoom ?? 4,
      translateExtent: options.translateExtent,
      gridSize: options.gridSize ?? 20,
      snapToGrid: options.snapToGrid ?? true,
      smartGuides: options.smartGuides ?? true,
      snapThreshold: options.snapThreshold ?? 6,
      connection: options.connection ?? {},
      defaultEdge: options.defaultEdge ?? { type: 'orthogonal', targetArrow: 'arrow' },
      marqueeMode: options.marqueeMode ?? 'contain',
      pasteOffset: options.pasteOffset ?? 20,
      nudge: options.nudge ?? { small: 1, large: 10 },
      validateTransform: options.validateTransform,
      rotationStep: options.rotationStep ?? 15,
    }
    this.modeState = this.options.mode
    this.viewportState = options.viewport ?? DEFAULT_VIEWPORT

    for (const [name, router] of Object.entries(options.routers ?? {})) {
      this.routers.set(name, router)
    }

    this.store.selectionHooks = {
      capture: () => [...this.selectionSet],
      restore: (ids) => this.setSelection(ids),
    }

    this.unsubscribeStore.push(
      // The index follows every record right away, so queries inside transactions are exact.
      this.store.events.on('node', ({ id, node }) => {
        const previous = this.obstacleSignatures.get(id)
        const next = node
          ? JSON.stringify([
              node.x,
              node.y,
              node.width,
              node.height,
              node.rotation ?? 0,
              node.hidden ?? false,
              node.layerId,
              node.type,
            ])
          : undefined

        if (previous !== next) {
          this.obstacleVersion += 1
          this.events.emit('routes', undefined)
        }

        if (next === undefined) {
          this.obstacleSignatures.delete(id)
        } else {
          this.obstacleSignatures.set(id, next)
        }

        if (node) {
          this.index.set(id, getNodeQueryBounds(node, this.behaviors.get(node.type)))
        } else {
          this.index.delete(id)
        }
      }),
      this.store.events.on('change', (change) => this.onStoreChange(change)),
      this.store.events.on('commit', (entry) => {
        this.events.emit('commit', entry)
      }),
      this.store.events.on('history', (state) => this.events.emit('history', state)),
    )

    if (options.document) {
      this.store.load(options.document)
    }

    this.activeLayer = this.store.getLayers()[0]?.id ?? DEFAULT_LAYER_ID
    this.registerTool(createSelectTool())
    this.registerTool(createPanTool())
    createBuiltInCommands().forEach((command) => this.registerCommand(command))
    options.tools?.forEach((tool) => this.registerTool(tool))
    options.commands?.forEach((command) => this.registerCommand(command))
    options.plugins?.forEach((plugin) => this.use(plugin))
  }

  /* Lifecycle */

  destroy() {
    this.cancelInteraction()

    if (this.store.inTransaction) {
      this.store.rollback()
    }

    this.stopAnimation()
    this.pluginCleanups.splice(0).forEach((cleanup) => cleanup())
    this.unsubscribeStore.splice(0).forEach((unsubscribe) => unsubscribe())
    this.events.clear()
  }

  use(plugin: DiagramPlugin) {
    if (this.installedPlugins.has(plugin.name)) {
      return
    }

    this.installedPlugins.add(plugin.name)
    const cleanup = plugin.install(this)

    if (cleanup) {
      this.pluginCleanups.push(cleanup)
    }
  }

  hasPlugin(name: string) {
    return this.installedPlugins.has(name)
  }

  setOptions(options: Partial<ResolvedOptions>) {
    this.options = { ...this.options, ...options }

    if (options.mode && options.mode !== this.modeState) {
      this.setMode(options.mode)
    }

    if (
      options.minZoom !== undefined ||
      options.maxZoom !== undefined ||
      'translateExtent' in options
    ) {
      this.setViewport(this.viewportState)
    }

    this.events.emit('options', undefined)
  }

  /* Registries */

  registerBehavior(behavior: DiagramNodeBehavior) {
    const unregister = this.behaviors.register(behavior)

    // Bounds of existing nodes of the type may depend on the behavior.
    for (const node of this.store.getNodes()) {
      if (node.type === behavior.type) {
        this.index.set(node.id, getNodeQueryBounds(node, behavior))
      }
    }

    this.obstacleVersion += 1
    this.events.emit('routes', undefined)

    return () => {
      unregister()

      for (const node of this.store.getNodes()) {
        if (node.type === behavior.type) {
          this.index.set(node.id, getNodeQueryBounds(node, this.behaviors.get(node.type)))
        }
      }

      this.obstacleVersion += 1
      this.events.emit('routes', undefined)
    }
  }

  getBehavior(type: string) {
    return this.behaviors.get(type)
  }

  registerRouter(name: string, router: DiagramRouter) {
    this.routers.set(name, router)

    return () => {
      if (this.routers.get(name) === router) {
        this.routers.delete(name)
      }
    }
  }

  getRouterNames() {
    return [...this.routers.keys()]
  }

  registerTool(tool: DiagramTool) {
    this.tools.set(tool.id, tool)

    return () => {
      if (this.tools.get(tool.id) === tool) {
        this.tools.delete(tool.id)
      }
    }
  }

  getTool(id: string) {
    return this.tools.get(id)
  }

  getTools() {
    return [...this.tools.values()]
  }

  registerCommand(command: DiagramCommand) {
    this.commands.set(command.id, command)

    return () => {
      if (this.commands.get(command.id) === command) {
        this.commands.delete(command.id)
      }
    }
  }

  getCommand(id: string) {
    return this.commands.get(id)
  }

  getCommands() {
    return [...this.commands.values()]
  }

  canExecute(id: string) {
    const command = this.commands.get(id)

    if (!command || (!command.readOnly && !this.canEdit)) {
      return false
    }

    return command.isEnabled ? command.isEnabled(this) : true
  }

  /** Runs a command when it is enabled. Returns whether it ran. */
  execute(id: string) {
    const command = this.commands.get(id)

    if (!command || !this.canExecute(id)) {
      return false
    }

    command.run(this)
    return true
  }

  addTransformHook(hook: DiagramTransformHook) {
    this.transformHooks.add(hook)

    return () => this.transformHooks.delete(hook)
  }

  /** Runs transform hooks for interactively transformed nodes. */
  notifyTransform(ids: Iterable<DiagramId>) {
    const set = new Set(ids)

    if (set.size === 0) {
      return
    }

    this.store.batch(() => this.transformHooks.forEach((hook) => hook(this, set)))
  }

  /* Mode and tools */

  get mode() {
    return this.modeState
  }

  /** Whether the document can be changed by the user */
  get canEdit() {
    return this.modeState === 'edit'
  }

  setMode(mode: DiagramInteractionMode) {
    if (mode === this.modeState) {
      return
    }

    this.cancelInteraction()
    this.modeState = mode
    this.options = { ...this.options, mode }

    if (mode !== 'edit') {
      this.cancelTextEdit()

      if (this.tools.get(this.toolId)?.edits) {
        this.setTool('select')
      }
    }

    if (mode === 'view') {
      this.clearSelection()
    }

    this.events.emit('mode', mode)
  }

  get activeTool() {
    return this.toolId
  }

  setTool(id: string) {
    const tool = this.tools.get(id)

    if (!tool || id === this.toolId || (tool.edits && !this.canEdit)) {
      return
    }

    const previous = this.tools.get(this.toolId)
    previous?.cancel?.(this)
    previous?.deactivate?.(this)
    this.toolId = id
    this.setOverlay(EMPTY_OVERLAY)
    tool.activate?.(this)
    this.events.emit('tool', id)
  }

  /** Aborts the gesture of the active tool and clears transient overlays. */
  cancelInteraction() {
    this.panGesture = null
    this.tools.get(this.toolId)?.cancel?.(this)
    this.setOverlay(EMPTY_OVERLAY)
  }

  /* Pointer and keyboard dispatch */

  /** Pans with the middle button and in the view mode, everything else goes to the active tool. */
  pointerDown(event: DiagramPointerEvent, options: { pan?: boolean } = {}) {
    if (options.pan || event.button === 1 || this.modeState === 'view' || this.toolId === 'pan') {
      this.panGesture = {
        start: event.screen,
        viewport: this.viewportState,
        pointerId: event.pointerId,
      }
      return
    }

    this.tools.get(this.toolId)?.pointerDown?.(this, event)
  }

  pointerMove(event: DiagramPointerEvent) {
    if (this.panGesture) {
      if (event.pointerId === this.panGesture.pointerId) {
        const { start, viewport } = this.panGesture
        this.setViewport({
          ...viewport,
          x: viewport.x + event.screen.x - start.x,
          y: viewport.y + event.screen.y - start.y,
        })
      }

      return
    }

    this.tools.get(this.toolId)?.pointerMove?.(this, event)
  }

  pointerUp(event: DiagramPointerEvent) {
    if (this.panGesture) {
      const moved =
        Math.abs(event.screen.x - this.panGesture.start.x) +
        Math.abs(event.screen.y - this.panGesture.start.y)
      this.panGesture = null

      // A click without movement still selects in the view mode (e.g. a table on a floor plan).
      if (moved < 3 && this.modeState === 'view') {
        this.emitClick(event)
      }

      return
    }

    this.tools.get(this.toolId)?.pointerUp?.(this, event)
  }

  doubleClick(event: DiagramPointerEvent) {
    this.tools.get(this.toolId)?.doubleClick?.(this, event)
  }

  keyDown(event: DiagramKeyEvent) {
    return this.tools.get(this.toolId)?.keyDown?.(this, event) ?? false
  }

  get isPanning() {
    return this.panGesture !== null
  }

  /** Emits the click event matching the target of a pointer event. */
  emitClick(event: DiagramPointerEvent) {
    const { target } = event

    if (target.kind === 'node') {
      const node = this.store.getNode(target.id)

      if (node) {
        this.events.emit('nodeClick', { node, event })
      }
    } else if (target.kind === 'edge') {
      const edge = this.store.getEdge(target.id)

      if (edge) {
        this.events.emit('edgeClick', { edge, event })
      }
    } else if (target.kind === 'canvas') {
      this.events.emit('canvasClick', { point: event.world, event })
    }
  }

  /* Overlay */

  get overlay() {
    return this.overlayState
  }

  setOverlay(patch: Partial<DiagramOverlay>) {
    const next = { ...this.overlayState, ...patch }
    const changed = (Object.keys(next) as (keyof DiagramOverlay)[]).some(
      (key) => next[key] !== this.overlayState[key],
    )

    if (changed) {
      this.overlayState = next
      this.events.emit('overlay', next)
    }
  }

  /* Selection */

  get selection(): ReadonlySet<DiagramId> {
    return this.selectionSet
  }

  getSelectedIds(): DiagramId[] {
    return [...this.selectionSet]
  }

  getSelectedNodes(): DiagramNode[] {
    return [...this.selectionSet]
      .map((id) => this.store.getNode(id))
      .filter((node): node is DiagramNode => !!node)
  }

  getSelectedEdges(): DiagramEdge[] {
    return [...this.selectionSet]
      .map((id) => this.store.getEdge(id))
      .filter((edge): edge is DiagramEdge => !!edge)
  }

  isSelected(id: DiagramId) {
    return this.selectionSet.has(id)
  }

  /** Replaces the selection. Unknown, hidden and unselectable elements are dropped. */
  setSelection(ids: Iterable<DiagramId>) {
    const next = new Set<DiagramId>()

    for (const id of ids) {
      const node = this.store.getNode(id)
      const edge = node ? undefined : this.store.getEdge(id)

      if (node && this.isNodeSelectable(node)) {
        next.add(id)
      } else if (edge && this.isEdgeSelectable(edge)) {
        next.add(id)
      }
    }

    if (
      next.size === this.selectionSet.size &&
      [...next].every((id) => this.selectionSet.has(id))
    ) {
      return
    }

    this.selectionSet = next

    if (this.editingState && !next.has(this.editingState.id)) {
      this.cancelTextEdit()
    }

    this.events.emit('selection', [...next])
  }

  select(
    ids: DiagramId | Iterable<DiagramId>,
    options: { additive?: boolean; toggle?: boolean } = {},
  ) {
    const list = typeof ids === 'string' ? [ids] : [...ids]

    if (options.toggle) {
      const next = new Set(this.selectionSet)

      for (const id of list) {
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
      }

      this.setSelection(next)
    } else {
      this.setSelection(options.additive ? [...this.selectionSet, ...list] : list)
    }
  }

  clearSelection() {
    this.enteredGroupId = null
    this.setSelection([])
  }

  selectAll() {
    this.setSelection([
      ...this.store
        .getNodes()
        .filter((node) => !this.isInsideGroup(node) && this.isNodeSelectable(node))
        .map((node) => node.id),
      ...this.store
        .getEdges()
        .filter((edge) => this.isEdgeSelectable(edge))
        .map((edge) => edge.id),
    ])
  }

  private isInsideGroup(node: DiagramNode) {
    return Boolean(node.parentId && this.store.hasNode(node.parentId))
  }

  /**
   * Element that a click on `nodeId` selects: the outermost group, or the child of the group
   * that was entered with a double click.
   */
  resolveSelectionTarget(nodeId: DiagramId): DiagramId {
    const ancestors = this.store.getAncestors(nodeId)

    if (ancestors.length === 0) {
      return nodeId
    }

    const path = [nodeId, ...ancestors.map((node) => node.id)]

    if (this.enteredGroupId) {
      const index = path.indexOf(this.enteredGroupId)

      if (index > 0) {
        return path[index - 1]
      }
    }

    return path[path.length - 1]
  }

  /* Layers and visibility */

  get activeLayerId() {
    return this.activeLayer
  }

  setActiveLayer(id: string) {
    if (!this.store.getLayers().some((layer) => layer.id === id) || id === this.activeLayer) {
      return
    }

    this.activeLayer = id
    this.events.emit('activeLayer', id)
  }

  addLayer(layer: Partial<DiagramLayer> = {}) {
    const id = layer.id ?? this.store.createId('layer')
    const next: DiagramLayer = {
      visible: true,
      ...layer,
      id,
      name: layer.name ?? `Layer ${this.store.getLayers().length + 1}`,
    }
    this.store.transact('Add layer', () => this.store.setLayers([...this.store.getLayers(), next]))
    this.setActiveLayer(id)

    return next
  }

  /** Removes a layer and moves its elements to `moveTo`, or deletes them when it is `null`. */
  removeLayer(id: string, moveTo: string | null = null) {
    const layers = this.store.getLayers()

    if (layers.length <= 1 || !layers.some((layer) => layer.id === id)) {
      return
    }

    const remaining = layers.filter((layer) => layer.id !== id)
    const target = moveTo && remaining.some((layer) => layer.id === moveTo) ? moveTo : null

    this.store.transact('Remove layer', () => {
      const nodes = this.store.getNodes().filter((node) => this.store.resolveLayerId(node) === id)
      const edges = this.store.getEdges().filter((edge) => this.store.resolveLayerId(edge) === id)

      if (target) {
        nodes.forEach((node) => this.store.updateNode(node.id, { layerId: target }))
        edges.forEach((edge) => this.store.updateEdge(edge.id, { layerId: target }))
      } else {
        edges.forEach((edge) => this.store.removeEdge(edge.id))
        nodes.forEach((node) => this.store.removeNode(node.id))
      }

      // Elements without a layer id belong to the first layer, keep them where they are.
      if (layers[0].id === id && target) {
        this.store
          .getNodes()
          .filter((node) => !node.layerId)
          .forEach((node) => this.store.updateNode(node.id, { layerId: target }))
      }

      this.store.setLayers(remaining)
    })

    if (this.activeLayer === id) {
      this.setActiveLayer(target ?? remaining[0].id)
    }

    this.setSelection(this.selectionSet)
  }

  updateLayer(id: string, patch: Partial<Omit<DiagramLayer, 'id'>>) {
    this.store.transact('Update layer', () => this.store.updateLayer(id, patch))

    if (patch.visible === false || patch.locked) {
      this.setSelection(this.selectionSet)
    }
  }

  moveLayer(id: string, direction: 'up' | 'down') {
    const layers = [...this.store.getLayers()]
    const index = layers.findIndex((layer) => layer.id === id)
    const target = direction === 'up' ? index + 1 : index - 1

    if (index < 0 || target < 0 || target >= layers.length) {
      return
    }

    ;[layers[index], layers[target]] = [layers[target], layers[index]]
    this.store.transact('Reorder layers', () => this.store.setLayers(layers))
  }

  moveToLayer(ids: Iterable<DiagramId>, layerId: string) {
    this.store.transact('Move to layer', () => {
      for (const id of this.expandWithDescendants(ids)) {
        if (this.store.hasNode(id)) {
          this.store.updateNode(id, { layerId })
        } else if (this.store.hasEdge(id)) {
          this.store.updateEdge(id, { layerId })
        }
      }
    })
  }

  getLayerOf(element: { layerId?: string }) {
    return this.store.getLayer(this.store.resolveLayerId(element))
  }

  isNodeVisible(node: DiagramNode) {
    if (node.hidden) {
      return false
    }

    return this.getLayerOf(node)?.visible !== false
  }

  isEdgeVisible(edge: DiagramEdge) {
    if (edge.hidden || this.getLayerOf(edge)?.visible === false) {
      return false
    }

    // Connectors of hidden nodes disappear with them.
    for (const end of [edge.source, edge.target]) {
      const node = end.nodeId ? this.store.getNode(end.nodeId) : undefined

      if (node && !this.isNodeVisible(node)) {
        return false
      }
    }

    return true
  }

  isNodeSelectable(node: DiagramNode) {
    return (
      this.modeState !== 'view' &&
      this.isNodeVisible(node) &&
      this.getLayerOf(node)?.locked !== true &&
      this.behaviors.get(node.type).selectable !== false
    )
  }

  isEdgeSelectable(edge: DiagramEdge) {
    return (
      this.modeState !== 'view' &&
      this.isEdgeVisible(edge) &&
      this.getLayerOf(edge)?.locked !== true
    )
  }

  /** Whether a node may be moved, resized or rotated by the user. */
  isNodeEditable(node: DiagramNode) {
    if (!this.canEdit || node.locked || this.getLayerOf(node)?.locked) {
      return false
    }

    return !this.store.getAncestors(node.id).some((ancestor) => ancestor.locked)
  }

  /** Whether an edge may be changed by the user. */
  isEdgeEditable(edge: DiagramEdge) {
    return this.canEdit && !edge.locked && this.getLayerOf(edge)?.locked !== true
  }

  /* Viewport */

  get viewport() {
    return this.viewportState
  }

  get viewportSize(): Readonly<ViewportSize> {
    return this.size
  }

  setViewportSize(size: ViewportSize) {
    if (size.width === this.size.width && size.height === this.size.height) {
      return
    }

    this.size = { width: size.width, height: size.height }
    this.events.emit('resize', this.size)
    this.setViewport(this.viewportState)
  }

  /** Moves the viewport. `animate` takes a duration in ms or `true` for 240 ms. */
  setViewport(viewport: DiagramViewport, options: { animate?: boolean | number } = {}) {
    const next = constrainViewport(viewport, this.size, this.options)
    const duration = options.animate === true ? 240 : options.animate || 0

    this.stopAnimation()

    if (duration > 0 && !this.reducedMotion && typeof requestAnimationFrame === 'function') {
      const from = this.viewportState
      const start = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - (1 - t) ** 3
        this.applyViewport(t >= 1 ? next : interpolateViewport(from, next, eased))
        this.animation = t >= 1 ? null : requestAnimationFrame(step)
      }

      this.animation = requestAnimationFrame(step)
      return
    }

    this.applyViewport(next)
  }

  private applyViewport(viewport: DiagramViewport) {
    if (viewportsEqual(viewport, this.viewportState)) {
      return
    }

    this.viewportState = viewport
    this.events.emit('viewport', viewport)
  }

  private stopAnimation() {
    if (this.animation !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animation)
    }

    this.animation = null
  }

  panBy(dx: number, dy: number) {
    const { x, y, zoom } = this.viewportState
    this.setViewport({ x: x + dx, y: y + dy, zoom })
  }

  /** Zooms keeping the world position under the screen point `center` in place. */
  zoomTo(zoom: number, center?: Point, options: { animate?: boolean | number } = {}) {
    const point = center ?? { x: this.size.width / 2, y: this.size.height / 2 }
    const clamped = Math.min(this.options.maxZoom, Math.max(this.options.minZoom, zoom))
    this.setViewport(zoomAtPoint(this.viewportState, point, clamped), options)
  }

  zoomBy(factor: number, center?: Point, options: { animate?: boolean | number } = {}) {
    this.zoomTo(this.viewportState.zoom * factor, center, options)
  }

  zoomIn() {
    this.zoomBy(1.2, undefined, { animate: true })
  }

  zoomOut() {
    this.zoomBy(1 / 1.2, undefined, { animate: true })
  }

  /** Fits a world rectangle into the viewport. */
  fitBounds(
    rect: Rect,
    options: { padding?: number; maxZoom?: number; animate?: boolean | number } = {},
  ) {
    if (this.size.width <= 0 || this.size.height <= 0) {
      return
    }

    this.setViewport(
      fitRect(rect, this.size, {
        padding: options.padding ?? 40,
        minZoom: this.options.minZoom,
        maxZoom: Math.min(options.maxZoom ?? 1, this.options.maxZoom),
      }),
      { animate: options.animate },
    )
  }

  /** Fits all visible content, or the given elements. */
  fitView(
    options: {
      ids?: Iterable<DiagramId>
      padding?: number
      maxZoom?: number
      animate?: boolean | number
    } = {},
  ) {
    const bounds = this.getContentBounds(options.ids)

    if (bounds) {
      this.fitBounds(bounds, options)
    }
  }

  zoomToSelection(options: { padding?: number; animate?: boolean | number } = {}) {
    if (this.selectionSet.size > 0) {
      this.fitView({ ids: this.selectionSet, maxZoom: this.options.maxZoom, ...options })
    }
  }

  centerOn(point: Point, options: { zoom?: number; animate?: boolean | number } = {}) {
    const zoom = options.zoom ?? this.viewportState.zoom
    this.setViewport(
      { zoom, x: this.size.width / 2 - point.x * zoom, y: this.size.height / 2 - point.y * zoom },
      options,
    )
  }

  screenToWorld(p: Point) {
    return screenToWorld(p, this.viewportState)
  }

  worldToScreen(p: Point) {
    return worldToScreen(p, this.viewportState)
  }

  getVisibleRect(): Rect {
    return getVisibleRect(this.viewportState, this.size)
  }

  /* Spatial queries */

  private onStoreChange(change: DiagramChange) {
    if (change.layers) {
      this.obstacleVersion += 1
      this.events.emit('routes', undefined)
    }

    if (change.layers && !this.store.getLayers().some((layer) => layer.id === this.activeLayer)) {
      this.activeLayer = this.store.getLayers()[0].id
      this.events.emit('activeLayer', this.activeLayer)
    }

    // Removed, hidden and newly layer-locked elements leave the selection.
    if (
      [...this.selectionSet].some((id) => {
        const node = this.store.getNode(id)
        const edge = node ? undefined : this.store.getEdge(id)

        return node ? !this.isNodeSelectable(node) : edge ? !this.isEdgeSelectable(edge) : true
      })
    ) {
      this.setSelection(this.selectionSet)
    }

    if (this.editingState) {
      const exists =
        this.editingState.kind === 'node'
          ? this.store.hasNode(this.editingState.id)
          : this.store.hasEdge(this.editingState.id)

      if (!exists) {
        this.cancelTextEdit()
      }
    }

    this.events.emit('change', change)
  }

  /** Bounds of visible nodes and edges, or of the given elements. */
  getContentBounds(ids?: Iterable<DiagramId>): Rect | null {
    const rects: Rect[] = []
    const filter = ids ? new Set(ids) : null

    for (const node of this.store.getNodes()) {
      if ((!filter || filter.has(node.id)) && this.isNodeVisible(node)) {
        rects.push(getNodeBounds(node))
      }
    }

    for (const edge of this.store.getEdges()) {
      if ((!filter || filter.has(edge.id)) && this.isEdgeVisible(edge)) {
        rects.push(rectFromPoints(this.getEdgeRoute(edge).points))
      }
    }

    return unionRects(rects)
  }

  /** Visible node ids whose bounds intersect `rect`, unordered. */
  queryNodes(rect: Rect): Set<DiagramId> {
    return this.index.query(rect)
  }

  getNodeOutline(node: DiagramNode) {
    return getNodeOutline(node, this.behaviors.get(node.type))
  }

  /**
   * Topmost element at a world point. Nodes are hit inside their outline, edges within
   * `tolerance` screen pixels.
   */
  hitTest(p: Point, tolerance = 6): DiagramHitTarget {
    const worldTolerance = tolerance / this.viewportState.zoom
    const candidates = [
      ...this.index.query(expandRect({ x: p.x, y: p.y, width: 0, height: 0 }, worldTolerance)),
    ]
      .map((id) => this.store.getNode(id)!)
      .filter((node) => node && this.isNodeSelectable(node))
      .sort((a, b) => this.store.getNodeIndex(b.id) - this.store.getNodeIndex(a.id))

    const edges = this.store.getEdges()

    for (let index = edges.length - 1; index >= 0; index -= 1) {
      const edge = edges[index]

      if (
        this.isEdgeSelectable(edge) &&
        distanceToPolyline(p, this.getEdgeRoute(edge).points) <= worldTolerance
      ) {
        // Edges are drawn below nodes, a node on top of the edge wins.
        const covering = candidates.find((node) => pointInPolygon(p, this.getNodeOutline(node)))

        return covering ? { kind: 'node', id: covering.id } : { kind: 'edge', id: edge.id }
      }
    }

    for (const node of candidates) {
      if (this.behaviors.get(node.type).container) {
        continue
      }

      const outline = this.getNodeOutline(node)
      const points = this.behaviors.get(node.type).points
      const hit =
        points && !points.closed
          ? distanceToPolyline(p, outline) <= worldTolerance
          : pointInPolygon(p, outline)

      if (hit) {
        return { kind: 'node', id: node.id }
      }
    }

    return { kind: 'canvas' }
  }

  /** Selectable top level nodes inside (or touching) a world rectangle. */
  getNodesInRect(rect: Rect, mode = this.options.marqueeMode): DiagramNode[] {
    const result = new Map<DiagramId, DiagramNode>()

    for (const id of this.index.query(rect)) {
      const node = this.store.getNode(id)

      if (!node || !this.isNodeSelectable(node)) {
        continue
      }

      const bounds = getNodeBounds(node)
      const hit =
        mode === 'contain'
          ? rectContainsRect(rect, bounds)
          : polygonsIntersect(this.getNodeOutline(node), [
              { x: rect.x, y: rect.y },
              { x: rect.x + rect.width, y: rect.y },
              { x: rect.x + rect.width, y: rect.y + rect.height },
              { x: rect.x, y: rect.y + rect.height },
            ])

      if (hit) {
        const targetId = this.resolveSelectionTarget(node.id)
        const target = this.store.getNode(targetId)

        if (target && (mode === 'intersect' || rectContainsRect(rect, getNodeBounds(target)))) {
          result.set(targetId, target)
        }
      }
    }

    return [...result.values()]
  }

  /** Selectable top level nodes whose outline lies inside a lasso polygon. */
  getNodesInPolygon(polygon: readonly Point[]): DiagramNode[] {
    const bounds = rectFromPoints(polygon)
    const result = new Map<DiagramId, DiagramNode>()

    for (const id of this.index.query(bounds)) {
      const node = this.store.getNode(id)

      if (
        node &&
        this.isNodeSelectable(node) &&
        this.getNodeOutline(node).every((p) => pointInPolygon(p, polygon))
      ) {
        const targetId = this.resolveSelectionTarget(node.id)
        const target = this.store.getNode(targetId)

        if (target) {
          result.set(targetId, target)
        }
      }
    }

    return [...result.values()]
  }

  /* Edges */

  /** Route of an edge, cached until the edge, its nodes or the obstacles change. */
  getEdgeRoute(edge: DiagramEdge): RouteResult {
    const source = edge.source.nodeId ? this.store.getNode(edge.source.nodeId) : undefined
    const target = edge.target.nodeId ? this.store.getNode(edge.target.nodeId) : undefined
    const routerName = edge.type ?? 'straight'
    const avoids = routerName === 'orthogonal' || routerName === 'rounded'
    const key = [source, target, routerName, avoids ? this.obstacleVersion : 0]
    const cached = this.routeCache.get(edge)

    if (cached && cached.key.every((value, index) => value === key[index])) {
      return cached.result
    }

    const router = this.routers.get(routerName) ?? BUILT_IN_ROUTERS.straight
    const ends = resolveEdgeEndpoints(edge, {
      getNode: (id) => this.store.getNode(id),
      behaviors: this.behaviors,
    })
    const result = router({
      source: ends.source,
      target: ends.target,
      waypoints: edge.waypoints ?? [],
      cornerRadius: edge.style?.cornerRadius,
      obstacles: (area) =>
        [...this.index.query(area)]
          .map((id) => this.store.getNode(id)!)
          .filter(
            (node) =>
              node &&
              node.id !== source?.id &&
              node.id !== target?.id &&
              this.isNodeVisible(node) &&
              !this.behaviors.get(node.type).container &&
              this.behaviors.get(node.type).connectable !== false,
          )
          .map((node) => getNodeBounds(node)),
    })

    this.routeCache.set(edge, { key, result })

    return result
  }

  isConnectionValid(request: Parameters<typeof isConnectionValid>[0]) {
    return isConnectionValid(
      request,
      {
        getNode: (id) => this.store.getNode(id),
        behaviors: this.behaviors,
        edges: this.store.getEdges(),
      },
      this.options.connection,
    )
  }

  /* Creating elements */

  /** Builds a node from a partial one, applying the defaults of its type. */
  createNode(partial: Partial<DiagramNode> & { type: string }): DiagramNode {
    const defaults = this.behaviors.get(partial.type).defaults ?? {}
    const node: DiagramNode = {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      ...defaults,
      ...partial,
      id:
        partial.id ??
        this.store.createId(partial.type.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'node'),
      style: defaults.style || partial.style ? { ...defaults.style, ...partial.style } : undefined,
      data:
        defaults.data || partial.data
          ? { ...structuredCopy(defaults.data), ...partial.data }
          : undefined,
    }

    if (!node.style) {
      delete node.style
    }

    if (!node.data) {
      delete node.data
    }

    if (!node.layerId && this.activeLayer !== this.store.getLayers()[0]?.id) {
      node.layerId = this.activeLayer
    }

    return node
  }

  addNode(partial: Partial<DiagramNode> & { type: string }, options: { select?: boolean } = {}) {
    const node = this.store.transact('Add node', () => this.store.addNode(this.createNode(partial)))

    if (options.select) {
      this.setSelection([node.id])
    }

    return node
  }

  addNodes(
    partials: (Partial<DiagramNode> & { type: string })[],
    options: { select?: boolean } = {},
  ) {
    const nodes = this.store.transact('Add nodes', () =>
      partials.map((partial) => this.store.addNode(this.createNode(partial))),
    )

    if (options.select) {
      this.setSelection(nodes.map((node) => node.id))
    }

    return nodes
  }

  createEdge(partial: Partial<DiagramEdge> & Pick<DiagramEdge, 'source' | 'target'>): DiagramEdge {
    const defaults = this.options.defaultEdge
    const edge: DiagramEdge = {
      ...defaults,
      ...partial,
      id: partial.id ?? this.store.createId('edge'),
      style: defaults.style || partial.style ? { ...defaults.style, ...partial.style } : undefined,
    }

    if (!edge.style) {
      delete edge.style
    }

    if (!edge.layerId && this.activeLayer !== this.store.getLayers()[0]?.id) {
      edge.layerId = this.activeLayer
    }

    return edge
  }

  addEdge(partial: Partial<DiagramEdge> & Pick<DiagramEdge, 'source' | 'target'>) {
    return this.store.transact('Add edge', () => this.store.addEdge(this.createEdge(partial)))
  }

  /** Connects two nodes when the connection rules allow it. Returns the new edge or `null`. */
  connect(
    source: { nodeId: DiagramId; portId?: string },
    target: { nodeId: DiagramId; portId?: string },
    partial: Partial<DiagramEdge> = {},
  ): DiagramEdge | null {
    const valid = this.isConnectionValid({
      sourceNodeId: source.nodeId,
      sourcePortId: source.portId,
      targetNodeId: target.nodeId,
      targetPortId: target.portId,
    })

    if (!valid) {
      return null
    }

    const edge = this.addEdge({ ...partial, source, target })
    this.events.emit('connect', edge)

    return edge
  }

  /* Updating elements */

  updateNode(id: DiagramId, update: Parameters<DiagramStore['updateNode']>[1], label = 'Edit') {
    return this.store.transact(label, () => this.store.updateNode(id, update))
  }

  updateEdge(id: DiagramId, update: Parameters<DiagramStore['updateEdge']>[1], label = 'Edit') {
    return this.store.transact(label, () => this.store.updateEdge(id, update))
  }

  /** Updates nodes and edges with the same patch, e.g. a style change from a properties panel. */
  updateElements(
    ids: Iterable<DiagramId>,
    update: (element: DiagramNode | DiagramEdge) => Partial<DiagramNode & DiagramEdge>,
    label = 'Edit',
    options: { mergeKey?: string } = {},
  ) {
    this.store.transact(
      label,
      () => {
        for (const id of ids) {
          const node = this.store.getNode(id)

          if (node) {
            this.store.updateNode(id, update(node) as Partial<DiagramNode>)
            continue
          }

          const edge = this.store.getEdge(id)

          if (edge) {
            this.store.updateEdge(id, update(edge) as Partial<DiagramEdge>)
          }
        }
      },
      options,
    )
  }

  /** Ids plus the descendants of groups among them. */
  expandWithDescendants(ids: Iterable<DiagramId>): Set<DiagramId> {
    const result = new Set<DiagramId>()

    for (const id of ids) {
      result.add(id)

      if (this.store.hasNode(id)) {
        this.store.getDescendants(id).forEach((node) => result.add(node.id))
      }
    }

    return result
  }

  /** Nodes that move with the given ones: themselves and descendants, locked ones excluded. */
  getTransformableNodes(ids: Iterable<DiagramId>): DiagramNode[] {
    const result: DiagramNode[] = []

    for (const id of this.expandWithDescendants(ids)) {
      const node = this.store.getNode(id)

      if (node && this.isNodeEditable(node)) {
        result.push(node)
      }
    }

    return result
  }

  /**
   * Sets the positions of nodes, shifting the waypoints of edges between moved nodes too.
   * `originals` are the records before the gesture, which avoids accumulating rounding errors.
   */
  applyMove(
    originals: readonly DiagramNode[],
    dx: number,
    dy: number,
    originalEdges: readonly DiagramEdge[] = [],
  ) {
    this.store.batch(() => {
      for (const node of originals) {
        this.store.updateNode(node.id, { x: node.x + dx, y: node.y + dy })
      }

      for (const edge of originalEdges) {
        this.store.updateEdge(edge.id, {
          waypoints: edge.waypoints?.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          source: edge.source.point
            ? { point: { x: edge.source.point.x + dx, y: edge.source.point.y + dy } }
            : edge.source,
          target: edge.target.point
            ? { point: { x: edge.target.point.x + dx, y: edge.target.point.y + dy } }
            : edge.target,
        })
      }

      this.refreshGroups(originals.map((node) => node.id))
      this.notifyTransform(originals.map((node) => node.id))
    })
  }

  /** Edges whose waypoints move together with a set of nodes. */
  getEdgesMovingWith(
    nodeIds: ReadonlySet<DiagramId>,
    selectedEdges: Iterable<DiagramId> = [],
  ): DiagramEdge[] {
    const result = new Map<DiagramId, DiagramEdge>()
    const moving = (end: DiagramEdgeEndpoint) => (end.nodeId ? nodeIds.has(end.nodeId) : false)

    for (const id of selectedEdges) {
      const edge = this.store.getEdge(id)

      if (edge && this.isEdgeEditable(edge)) {
        result.set(id, edge)
      }
    }

    for (const nodeId of nodeIds) {
      for (const edge of this.store.getConnectedEdges(nodeId)) {
        if (this.isEdgeEditable(edge) && moving(edge.source) && moving(edge.target)) {
          result.set(edge.id, edge)
        }
      }
    }

    return [...result.values()].filter(
      (edge) =>
        (edge.waypoints && edge.waypoints.length > 0) || edge.source.point || edge.target.point,
    )
  }

  /** Moves nodes and selected edges by an offset as one undoable step. */
  moveBy(ids: Iterable<DiagramId>, dx: number, dy: number, options: { mergeKey?: string } = {}) {
    const list = [...ids]
    const nodes = this.getTransformableNodes(list)
    const nodeIds = new Set(nodes.map((node) => node.id))
    const edges = this.getEdgesMovingWith(
      nodeIds,
      list.filter((id) => this.store.hasEdge(id)),
    )

    if (nodes.length === 0 && edges.length === 0) {
      return
    }

    if (this.options.validateTransform) {
      const moved = nodes.map((node) => ({ ...node, x: node.x + dx, y: node.y + dy }))

      if (!this.options.validateTransform(this, moved)) {
        return
      }
    }

    this.store.transact('Move', () => this.applyMove(nodes, dx, dy, edges), options)
  }

  /** Recomputes the bounds of the groups containing the given nodes, innermost first. */
  refreshGroups(ids: Iterable<DiagramId>) {
    const groups = new Set<DiagramId>()

    for (const id of ids) {
      this.store.getAncestors(id).forEach((ancestor) => groups.add(ancestor.id))
    }

    const ordered = [...groups].sort(
      (a, b) => this.store.getAncestors(b).length - this.store.getAncestors(a).length,
    )

    for (const groupId of ordered) {
      const children = this.store.getChildren(groupId)
      const bounds = unionRects(children.map((child) => getNodeBounds(child)))

      if (bounds) {
        this.store.updateNode(groupId, { ...bounds, rotation: 0 })
      }
    }
  }

  /** Sets the box of a node, letting its type adjust type specific data. */
  setNodeBox(
    id: DiagramId,
    box: Partial<Pick<DiagramNode, 'x' | 'y' | 'width' | 'height' | 'rotation'>>,
  ) {
    const node = this.store.getNode(id)

    if (!node) {
      return
    }

    const behavior = this.behaviors.get(node.type)

    if (behavior.container && (box.width !== undefined || box.height !== undefined)) {
      const from = getNodeBounds(node)
      const to = { ...from, ...box }
      this.scaleNodes([node, ...this.store.getDescendants(id)], from, to as Rect)
      return
    }

    let next: DiagramNode = {
      ...node,
      ...box,
      width: Math.max(box.width ?? node.width, behavior.minWidth ?? 1),
      height: Math.max(box.height ?? node.height, behavior.minHeight ?? 1),
    }

    if (behavior.resize && (next.width !== node.width || next.height !== node.height)) {
      next = behavior.resize(next, node)
    }

    this.store.updateNode(id, () => next)
    this.refreshGroups([id])
  }

  /** Maps nodes from one frame rectangle to another, used to resize multiple nodes and groups. */
  scaleNodes(originals: readonly DiagramNode[], from: Rect, to: Rect) {
    const sx = from.width > 0 ? to.width / from.width : 1
    const sy = from.height > 0 ? to.height / from.height : 1

    this.store.batch(() => {
      for (const node of originals) {
        const behavior = this.behaviors.get(node.type)

        if (behavior.container) {
          continue
        }

        const center = boxCenter(node)
        const nextCenter = {
          x: to.x + (center.x - from.x) * sx,
          y: to.y + (center.y - from.y) * sy,
        }
        const quarter = Math.round(((((node.rotation ?? 0) % 180) + 180) % 180) / 90) % 2 === 1
        const rotated = (node.rotation ?? 0) % 90 !== 0
        const [wScale, hScale] = rotated
          ? [Math.min(sx, sy), Math.min(sx, sy)]
          : quarter
            ? [sy, sx]
            : [sx, sy]
        const width = Math.max(behavior.minWidth ?? 1, node.width * wScale)
        const height = Math.max(behavior.minHeight ?? 1, node.height * hScale)
        let next: DiagramNode = {
          ...node,
          x: nextCenter.x - width / 2,
          y: nextCenter.y - height / 2,
          width,
          height,
        }

        if (behavior.resize) {
          next = behavior.resize(next, node)
        }

        this.store.updateNode(node.id, () => next)
      }

      const leaves = originals.filter((node) => !this.behaviors.get(node.type).container)
      this.refreshGroups(leaves.map((node) => node.id))
    })
  }

  /** Rotates nodes around a pivot by `delta` degrees, starting from their original records. */
  applyRotation(originals: readonly DiagramNode[], delta: number, pivot: Point) {
    this.store.batch(() => {
      for (const node of originals) {
        const behavior = this.behaviors.get(node.type)

        if (behavior.container) {
          continue
        }

        const center = rotatePoint(boxCenter(node), pivot, delta)
        this.store.updateNode(node.id, {
          x: center.x - node.width / 2,
          y: center.y - node.height / 2,
          rotation: normalizeRotation((node.rotation ?? 0) + delta),
        })
      }

      const ids = originals.map((node) => node.id)
      this.refreshGroups(ids)
      this.notifyTransform(ids)
    })
  }

  rotateBy(ids: Iterable<DiagramId>, delta: number) {
    const nodes = this.getTransformableNodes(ids).filter(
      (node) =>
        this.behaviors.get(node.type).rotatable !== false ||
        this.store.getAncestors(node.id).length > 0,
    )
    const bounds = unionRects(nodes.map((node) => getNodeBounds(node)))

    if (!bounds || nodes.length === 0) {
      return
    }

    const pivot =
      nodes.length === 1
        ? boxCenter(nodes[0])
        : { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
    this.store.transact('Rotate', () => this.applyRotation(nodes, delta, pivot))
  }

  /** Mirrors nodes across the center of their bounds. */
  flip(ids: Iterable<DiagramId>, axis: 'horizontal' | 'vertical') {
    const nodes = this.getTransformableNodes(ids)
    const bounds = unionRects(nodes.map((node) => getNodeBounds(node)))

    if (!bounds) {
      return
    }

    const horizontal = axis === 'horizontal'
    const mid = horizontal ? bounds.x + bounds.width / 2 : bounds.y + bounds.height / 2

    this.store.transact('Flip', () => {
      for (const node of nodes) {
        if (this.behaviors.get(node.type).container) {
          continue
        }

        const center = boxCenter(node)
        const nextCenter = horizontal
          ? { x: mid * 2 - center.x, y: center.y }
          : { x: center.x, y: mid * 2 - center.y }
        this.store.updateNode(node.id, {
          x: nextCenter.x - node.width / 2,
          y: nextCenter.y - node.height / 2,
          rotation: node.rotation ? normalizeRotation(-node.rotation) : node.rotation,
          ...(horizontal ? { flipX: !node.flipX } : { flipY: !node.flipY }),
        })
      }

      this.refreshGroups(nodes.map((node) => node.id))
      this.notifyTransform(nodes.map((node) => node.id))
    })
  }

  /* Deleting */

  /** Deletes elements with the children of groups and the connected edges. Locked ones stay. */
  deleteElements(ids: Iterable<DiagramId>, options: { force?: boolean } = {}) {
    const list = [...this.expandWithDescendants(ids)]

    this.store.transact('Delete', () => {
      for (const id of list) {
        const edge = this.store.getEdge(id)

        if (edge && (options.force || this.isEdgeEditable(edge))) {
          this.store.removeEdge(id)
        }
      }

      const removed: DiagramId[] = []

      for (const id of list) {
        const node = this.store.getNode(id)

        if (node && (options.force || this.isNodeEditable(node))) {
          removed.push(id)
          this.store.removeNode(id)
        }
      }

      // Empty groups are useless, remove them. Shrinking ones get new bounds.
      const parents = new Set<DiagramId>()

      for (const id of removed) {
        for (const ancestor of this.store.getAncestors(id)) {
          parents.add(ancestor.id)
        }
      }

      for (const parentId of parents) {
        if (this.store.hasNode(parentId) && this.store.getChildren(parentId).length === 0) {
          this.store.removeNode(parentId)
        }
      }

      this.refreshGroups(
        [...parents]
          .filter((id) => this.store.hasNode(id))
          .flatMap((id) => this.store.getChildren(id).map((child) => child.id)),
      )
    })
  }

  deleteSelection() {
    if (this.canEdit) {
      this.deleteElements(this.selectionSet)
    }
  }

  /* Grouping */

  /** Groups top level nodes. Returns the group or `null` when fewer than two nodes qualify. */
  group(ids: Iterable<DiagramId> = this.selectionSet): DiagramNode | null {
    const nodes = [...ids]
      .map((id) => this.store.getNode(id))
      .filter((node): node is DiagramNode => !!node && this.isNodeEditable(node))

    if (nodes.length < 2) {
      return null
    }

    const bounds = unionRects(nodes.map((node) => getNodeBounds(node)))!
    const parentId = nodes.every((node) => node.parentId === nodes[0].parentId)
      ? nodes[0].parentId
      : undefined
    const topIndex = Math.max(...nodes.map((node) => this.store.getNodeIndex(node.id)))

    const group = this.store.transact('Group', () => {
      const created = this.store.addNode(
        this.createNode({
          type: 'group',
          ...bounds,
          parentId,
          layerId: nodes[0].layerId,
        }),
        topIndex + 1,
      )

      for (const node of nodes) {
        this.store.updateNode(node.id, { parentId: created.id })
      }

      // Keep the children right below the group in the rendering order.
      const ordered = this.store.getNodeOrder().filter((id) => id !== created.id)
      const lastChild = Math.max(...nodes.map((node) => ordered.indexOf(node.id)))
      ordered.splice(lastChild + 1, 0, created.id)
      this.store.setNodeOrder(ordered)

      return created
    })

    this.setSelection([group.id])

    return group
  }

  /** Dissolves groups, selecting their former children. */
  ungroup(ids: Iterable<DiagramId> = this.selectionSet) {
    const groups = [...ids]
      .map((id) => this.store.getNode(id))
      .filter(
        (node): node is DiagramNode =>
          !!node && this.behaviors.get(node.type).container === true && this.isNodeEditable(node),
      )

    if (groups.length === 0) {
      return
    }

    const children: DiagramId[] = []

    this.store.transact('Ungroup', () => {
      for (const group of groups) {
        for (const child of this.store.getChildren(group.id)) {
          children.push(child.id)
          this.store.updateNode(child.id, { parentId: group.parentId })
        }

        this.store.removeNode(group.id)
      }
    })

    if (this.enteredGroupId && groups.some((group) => group.id === this.enteredGroupId)) {
      this.enteredGroupId = null
    }

    this.setSelection(children)
  }

  /* Locking and visibility */

  setLocked(ids: Iterable<DiagramId>, locked: boolean) {
    this.updateElements(ids, () => ({ locked }), locked ? 'Lock' : 'Unlock')
  }

  setHidden(ids: Iterable<DiagramId>, hidden: boolean) {
    this.updateElements(ids, () => ({ hidden }), hidden ? 'Hide' : 'Show')

    if (hidden) {
      this.setSelection(this.selectionSet)
    }
  }

  /* Z-order */

  /** Changes the rendering order. Groups move with their descendants. */
  reorder(ids: Iterable<DiagramId>, direction: 'front' | 'back' | 'forward' | 'backward') {
    const moving = this.expandWithDescendants([...ids].filter((id) => this.store.hasNode(id)))

    if (moving.size === 0) {
      return
    }

    const order = [...this.store.getNodeOrder()]
    const block = order.filter((id) => moving.has(id))
    const rest = order.filter((id) => !moving.has(id))
    let insertAt: number

    if (direction === 'front') {
      insertAt = rest.length
    } else if (direction === 'back') {
      insertAt = 0
    } else {
      // Step over the next (or previous) overlapping element that is not part of the block.
      const bounds = unionRects(block.map((id) => getNodeBounds(this.store.getNode(id)!)))!
      const firstIndex = order.indexOf(block[0])
      const lastIndex = order.indexOf(block[block.length - 1])
      const overlaps = (id: DiagramId) =>
        rectsIntersect(getNodeBounds(this.store.getNode(id)!), bounds)

      if (direction === 'forward') {
        const next =
          order.slice(lastIndex + 1).find((id) => !moving.has(id) && overlaps(id)) ??
          order.slice(lastIndex + 1).find((id) => !moving.has(id))
        insertAt = next ? rest.indexOf(next) + 1 : rest.length
        // Keep groups contiguous: step over the descendants of the element too.
        if (next) {
          const descendants = new Set(this.store.getDescendants(next).map((node) => node.id))
          while (insertAt < rest.length && descendants.has(rest[insertAt])) {
            insertAt += 1
          }
        }
      } else {
        const previous =
          order
            .slice(0, firstIndex)
            .reverse()
            .find((id) => !moving.has(id) && overlaps(id)) ??
          order
            .slice(0, firstIndex)
            .reverse()
            .find((id) => !moving.has(id))
        insertAt = previous ? rest.indexOf(previous) : 0
      }
    }

    rest.splice(insertAt, 0, ...block)
    this.store.transact('Reorder', () => this.store.setNodeOrder(rest))
  }

  /* Alignment */

  private selectionRects() {
    return this.getSelectedNodes()
      .filter((node) => this.isNodeEditable(node))
      .map((node) => ({ id: node.id, rect: getNodeBounds(node) }))
  }

  align(alignment: DiagramAlignment, ids?: Iterable<DiagramId>) {
    const items = ids
      ? [...ids]
          .map((id) => this.store.getNode(id))
          .filter((node): node is DiagramNode => !!node)
          .map((node) => ({ id: node.id, rect: getNodeBounds(node) }))
      : this.selectionRects()
    this.applyOffsets(alignRects(items, alignment), 'Align')
  }

  distribute(direction: DiagramDistribution, ids?: Iterable<DiagramId>) {
    const items = ids
      ? [...ids]
          .map((id) => this.store.getNode(id))
          .filter((node): node is DiagramNode => !!node)
          .map((node) => ({ id: node.id, rect: getNodeBounds(node) }))
      : this.selectionRects()
    this.applyOffsets(distributeRects(items, direction), 'Distribute')
  }

  /** Gives the selected nodes the size of the first selected one. */
  matchSize(dimension: 'width' | 'height' | 'both') {
    const [reference, ...others] = this.getSelectedNodes().filter((node) =>
      this.isNodeEditable(node),
    )

    if (!reference || others.length === 0) {
      return
    }

    this.store.transact('Match size', () => {
      for (const node of others) {
        this.setNodeBox(node.id, {
          width: dimension !== 'height' ? reference.width : node.width,
          height: dimension !== 'width' ? reference.height : node.height,
        })
      }
    })
  }

  private applyOffsets(offsets: Map<DiagramId, [number, number]>, label: string) {
    if (offsets.size === 0) {
      return
    }

    this.store.transact(label, () => {
      for (const [id, [dx, dy]] of offsets) {
        const nodes = this.getTransformableNodes([id])
        const edges = this.getEdgesMovingWith(new Set(nodes.map((node) => node.id)))
        this.applyMove(nodes, dx, dy, edges)
      }
    })
  }

  /* Layouts */

  /** Arranges nodes (all top level nodes by default) with a built-in layout. */
  applyLayout(
    kind: 'tree' | 'layered' | 'grid',
    options: DiagramLayoutOptions & {
      ids?: Iterable<DiagramId>
      animate?: boolean
      columns?: number
    } = {},
  ) {
    const filter = options.ids ? new Set(options.ids) : null
    const nodes = this.store
      .getNodes()
      .filter(
        (node) =>
          (filter ? filter.has(node.id) : !node.parentId) &&
          this.isNodeVisible(node) &&
          !node.locked,
      )
    const ids = new Set(nodes.map((node) => node.id))
    const edges = this.store
      .getEdges()
      .filter((edge) => ids.has(edge.source.nodeId ?? '') && ids.has(edge.target.nodeId ?? ''))
    const origin =
      options.origin ??
      (() => {
        const bounds = unionRects(nodes.map((node) => getNodeBounds(node)))
        return bounds ? { x: bounds.x, y: bounds.y } : { x: 0, y: 0 }
      })()
    const result =
      kind === 'tree'
        ? treeLayout(nodes, edges, { ...options, origin })
        : kind === 'layered'
          ? layeredLayout(nodes, edges, { ...options, origin })
          : gridLayout(nodes, { columns: options.columns, gap: options.nodeGap, origin })

    this.store.transact('Layout', () => {
      for (const node of nodes) {
        const position = result.get(node.id)

        if (position) {
          const moving = this.getTransformableNodes([node.id])
          this.applyMove(moving, position.x - node.x, position.y - node.y)
        }
      }

      // Waypoints from the previous arrangement would make no sense anymore.
      for (const edge of edges) {
        if (edge.waypoints?.length) {
          this.store.updateEdge(edge.id, { waypoints: undefined })
        }
      }
    })
  }

  /* Clipboard */

  /** Copies the selection. Returns the clipboard text for the system clipboard. */
  copy(ids: Iterable<DiagramId> = this.selectionSet): string | null {
    const list = [...ids]

    if (list.length === 0) {
      return null
    }

    this.clipboard = createClipboardPayload(this.store, list)
    this.pasteCount = 0

    return serializeClipboard(this.clipboard)
  }

  cut(ids: Iterable<DiagramId> = this.selectionSet): string | null {
    const list = [...ids]
    const text = this.copy(list)

    if (text) {
      this.deleteElements(list)
      this.pasteCount = -1
    }

    return text
  }

  get hasClipboard() {
    return this.clipboard !== null
  }

  /**
   * Pastes the internal clipboard, or clipboard text from another editor. Pasting at a point
   * centers the content there, otherwise every paste is offset a little further.
   */
  paste(options: { text?: string; at?: Point } = {}): DiagramId[] {
    const payload = options.text ? parseClipboard(options.text) : this.clipboard

    if (!payload || !this.canEdit || payload.nodes.length + payload.edges.length === 0) {
      return []
    }

    if (options.text && payload !== this.clipboard) {
      this.clipboard = payload
      this.pasteCount = 0
    }

    this.pasteCount += 1
    let offset = {
      x: this.options.pasteOffset * this.pasteCount,
      y: this.options.pasteOffset * this.pasteCount,
    }

    if (options.at) {
      const bounds = unionRects(payload.nodes.map((node) => getNodeBounds(node)))

      if (bounds) {
        offset = {
          x: options.at.x - (bounds.x + bounds.width / 2),
          y: options.at.y - (bounds.y + bounds.height / 2),
        }
      }
    }

    const { nodes, edges } = clonePayload(payload, {
      createId: (prefix) =>
        this.store.createId(prefix.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'node'),
      offset,
      behaviors: this.behaviors,
      hasNode: (id) => this.store.hasNode(id),
    })

    this.store.transact('Paste', () => {
      for (const node of nodes) {
        this.store.addNode(
          this.activeLayer !== this.store.getLayers()[0]?.id && !node.layerId
            ? { ...node, layerId: this.activeLayer }
            : node,
        )
      }

      for (const edge of edges) {
        this.store.addEdge(edge)
      }

      // Placing is a transform: extensions attach openings, number tables and so on.
      this.notifyTransform(nodes.map((node) => node.id))
    })

    const top = [
      ...nodes.filter((node) => !node.parentId).map((node) => node.id),
      ...edges.map((edge) => edge.id),
    ]
    this.setSelection(top)

    return top
  }

  duplicate(ids: Iterable<DiagramId> = this.selectionSet): DiagramId[] {
    const list = [...ids]

    if (list.length === 0 || !this.canEdit) {
      return []
    }

    const payload = createClipboardPayload(this.store, list)
    const previous = this.clipboard
    const previousCount = this.pasteCount
    this.clipboard = payload
    this.pasteCount = 0
    const result = this.paste()
    this.clipboard = previous
    this.pasteCount = previousCount

    return result
  }

  /* Text editing */

  get editing() {
    return this.editingState
  }

  startTextEdit(target: DiagramEditingTarget) {
    if (!this.canEdit) {
      return false
    }

    if (target.kind === 'node') {
      const node = this.store.getNode(target.id)

      if (
        !node ||
        !this.isNodeEditable(node) ||
        this.behaviors.get(node.type).editableText === false
      ) {
        return false
      }
    } else {
      const edge = this.store.getEdge(target.id)

      if (!edge || !this.isEdgeEditable(edge)) {
        return false
      }
    }

    this.editingState = target
    this.setSelection([target.id])
    this.events.emit('editing', target)

    return true
  }

  commitTextEdit(text: string) {
    const target = this.editingState

    if (!target) {
      return
    }

    this.editingState = null

    if (target.kind === 'node') {
      const node = this.store.getNode(target.id)

      if (node && (node.label ?? '') !== text) {
        this.updateNode(target.id, { label: text, richText: undefined }, 'Edit text')
      }
    } else {
      const edge = this.store.getEdge(target.id)

      if (edge && (edge.label ?? '') !== text) {
        this.updateEdge(target.id, { label: text || undefined }, 'Edit text')
      }
    }

    this.events.emit('editing', null)
  }

  cancelTextEdit() {
    if (this.editingState) {
      this.editingState = null
      this.events.emit('editing', null)
    }
  }

  /* Documents */

  toDocument(): DiagramDocument {
    return this.store.toDocument()
  }

  /** Replaces the document and clears the history. */
  load(document: Partial<DiagramDocument>, options: { keepHistory?: boolean } = {}) {
    this.cancelInteraction()
    this.cancelTextEdit()
    this.store.load(document, options)
    this.enteredGroupId = null
    this.setSelection(
      [...this.selectionSet].filter((id) => this.store.hasNode(id) || this.store.hasEdge(id)),
    )
  }

  applyPatch(patch: DiagramPatch, options: { history?: boolean; label?: string } = {}) {
    applyDiagramPatch(this.store, patch, options)
  }

  get settings(): Readonly<DiagramSettings> {
    return this.store.getSettings()
  }

  updateSettings(patch: Partial<DiagramSettings>, label = 'Update settings') {
    this.store.transact(label, () => this.store.updateSettings(patch))
  }

  /** Grid size of the document, or the editor default. */
  get gridSize() {
    return this.store.getSettings().gridSize ?? this.options.gridSize
  }

  get scale() {
    return this.store.getSettings().scale ?? PIXEL_SCALE
  }

  undo() {
    this.cancelInteraction()
    this.cancelTextEdit()
    return this.store.undo()
  }

  redo() {
    this.cancelInteraction()
    this.cancelTextEdit()
    return this.store.redo()
  }

  get canUndo() {
    return this.store.canUndo
  }

  get canRedo() {
    return this.store.canRedo
  }
}

function normalizeRotation(deg: number) {
  const value = deg % 360
  const normalized = value < 0 ? value + 360 : value

  return Math.abs(normalized - 360) < 1e-9 ? 0 : Math.round(normalized * 1e6) / 1e6
}

function structuredCopy<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value))
}
