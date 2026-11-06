import { Emitter } from './emitter'
import { createDiagramId } from './ids'
import type {
  DiagramDocument,
  DiagramEdge,
  DiagramId,
  DiagramLayer,
  DiagramNode,
  DiagramSettings,
} from './types'

export const DIAGRAM_SCHEMA_VERSION = 1

export const DEFAULT_LAYER_ID = 'default'

/** Where a change came from. Mirrors and adapters use it to avoid feedback loops. */
export type DiagramChangeSource = 'local' | 'history' | 'load' | 'remote'

export interface DiagramChange {
  /** Ids of nodes that were added, updated or removed */
  nodes: ReadonlySet<DiagramId>
  /** Ids of edges that were added, updated or removed */
  edges: ReadonlySet<DiagramId>
  nodeOrder: boolean
  edgeOrder: boolean
  layers: boolean
  settings: boolean
  meta: boolean
  source: DiagramChangeSource
}

interface EntityChange<T> {
  before: T | undefined
  after: T | undefined
}

export interface DiagramHistoryEntry {
  label: string
  timestamp: number
  mergeKey?: string
  nodes: Map<DiagramId, EntityChange<DiagramNode>>
  edges: Map<DiagramId, EntityChange<DiagramEdge>>
  nodeOrder?: [DiagramId[], DiagramId[]]
  edgeOrder?: [DiagramId[], DiagramId[]]
  layers?: [DiagramLayer[], DiagramLayer[]]
  settings?: [DiagramSettings, DiagramSettings]
  meta?: [DiagramDocumentMeta, DiagramDocumentMeta]
  selection?: [DiagramId[], DiagramId[]]
}

interface DiagramDocumentMeta {
  id?: string
  name?: string
  meta?: Record<string, unknown>
}

export interface DiagramTransactionOptions {
  /** Consecutive transactions with the same key merge into one history entry */
  mergeKey?: string
  /** `false` applies the changes without recording them, e.g. for live status updates */
  history?: boolean
  source?: DiagramChangeSource
}

interface ActiveTransaction {
  label: string
  options: DiagramTransactionOptions
  depth: number
  nodes: Map<DiagramId, DiagramNode | undefined>
  edges: Map<DiagramId, DiagramEdge | undefined>
  nodeOrder?: DiagramId[]
  edgeOrder?: DiagramId[]
  layers?: DiagramLayer[]
  settings?: DiagramSettings
  meta?: DiagramDocumentMeta
  selection?: DiagramId[]
}

export interface DiagramStoreEvents {
  change: DiagramChange
  /** A node record was set or removed. Emitted immediately, also inside transactions */
  node: { id: DiagramId; node: DiagramNode | undefined }
  commit: DiagramHistoryEntry
  history: { canUndo: boolean; canRedo: boolean }
}

export interface DiagramStoreOptions {
  /** Maximum number of undo steps, `100` by default */
  historyLimit?: number
  /** Time window in ms for merging transactions with the same `mergeKey`, `1000` by default */
  mergeWindow?: number
}

export type DiagramNodeUpdate =
  | Partial<Omit<DiagramNode, 'id'>>
  | ((node: DiagramNode) => DiagramNode)
export type DiagramEdgeUpdate =
  | Partial<Omit<DiagramEdge, 'id'>>
  | ((edge: DiagramEdge) => DiagramEdge)

/**
 * Deep copy of plain data. Works for reactive proxies too, which `structuredClone` rejects.
 * Functions and class instances other than arrays and plain objects are shared.
 */
export function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T
  }

  const prototype = Object.getPrototypeOf(value)

  if (prototype !== Object.prototype && prototype !== null) {
    return value
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    result[key] = cloneDeep((value as Record<string, unknown>)[key])
  }

  return result as T
}

/**
 * Owns the diagram document: nodes, edges, layers and settings, plus undo history.
 *
 * Records are immutable. Every update replaces the record, which lets the history keep
 * references instead of copies and lets renderers compare by identity.
 */
export class DiagramStore {
  readonly events = new Emitter<DiagramStoreEvents>()

  private nodes = new Map<DiagramId, DiagramNode>()
  private edges = new Map<DiagramId, DiagramEdge>()
  private nodeOrder: DiagramId[] = []
  private edgeOrder: DiagramId[] = []
  private layers: DiagramLayer[] = [{ id: DEFAULT_LAYER_ID, name: 'Layer 1', visible: true }]
  private settings: DiagramSettings = {}
  private documentMeta: DiagramDocumentMeta = {}

  private edgesByNode = new Map<DiagramId, Set<DiagramId>>()
  private childrenByParent = new Map<DiagramId, Set<DiagramId>>()
  private nodeIndex: Map<DiagramId, number> | null = null
  private nodesCache: DiagramNode[] | null = null
  private edgesCache: DiagramEdge[] | null = null

  private transaction: ActiveTransaction | null = null
  private undoStack: DiagramHistoryEntry[] = []
  private redoStack: DiagramHistoryEntry[] = []

  private batchDepth = 0
  private pending: {
    nodes: Set<DiagramId>
    edges: Set<DiagramId>
    nodeOrder: boolean
    edgeOrder: boolean
    layers: boolean
    settings: boolean
    meta: boolean
    source: DiagramChangeSource
  } = this.emptyPending()

  historyLimit: number
  mergeWindow: number

  /** Lets the editor record and restore the selection with each history entry. */
  selectionHooks: {
    capture: () => DiagramId[]
    restore: (ids: DiagramId[]) => void
  } | null = null

  constructor(document?: Partial<DiagramDocument>, options: DiagramStoreOptions = {}) {
    this.historyLimit = options.historyLimit ?? 100
    this.mergeWindow = options.mergeWindow ?? 1000

    if (document) {
      this.load(document, { source: 'load' })
    }
  }

  /* Reading */

  getNode(id: DiagramId | undefined | null) {
    return id == null ? undefined : this.nodes.get(id)
  }

  getEdge(id: DiagramId | undefined | null) {
    return id == null ? undefined : this.edges.get(id)
  }

  hasNode(id: DiagramId) {
    return this.nodes.has(id)
  }

  hasEdge(id: DiagramId) {
    return this.edges.has(id)
  }

  get nodeCount() {
    return this.nodes.size
  }

  get edgeCount() {
    return this.edges.size
  }

  /** Nodes in rendering order, back to front. The array is cached until the next change. */
  getNodes(): readonly DiagramNode[] {
    if (!this.nodesCache) {
      this.nodesCache = this.nodeOrder.map((id) => this.nodes.get(id)!)
    }

    return this.nodesCache
  }

  getEdges(): readonly DiagramEdge[] {
    if (!this.edgesCache) {
      this.edgesCache = this.edgeOrder.map((id) => this.edges.get(id)!)
    }

    return this.edgesCache
  }

  getNodeOrder(): readonly DiagramId[] {
    return this.nodeOrder
  }

  getEdgeOrder(): readonly DiagramId[] {
    return this.edgeOrder
  }

  /** Index of a node in the rendering order, `-1` when it does not exist. */
  getNodeIndex(id: DiagramId) {
    if (!this.nodeIndex) {
      this.nodeIndex = new Map(this.nodeOrder.map((nodeId, index) => [nodeId, index]))
    }

    return this.nodeIndex.get(id) ?? -1
  }

  /** Edges attached to a node. */
  getConnectedEdges(nodeId: DiagramId): DiagramEdge[] {
    const ids = this.edgesByNode.get(nodeId)

    return ids ? [...ids].map((id) => this.edges.get(id)!).filter(Boolean) : []
  }

  getChildren(parentId: DiagramId): DiagramNode[] {
    const ids = this.childrenByParent.get(parentId)

    if (!ids) {
      return []
    }

    return [...ids]
      .map((id) => this.nodes.get(id)!)
      .filter(Boolean)
      .sort((a, b) => this.getNodeIndex(a.id) - this.getNodeIndex(b.id))
  }

  /** All nested children of a group, depth first. */
  getDescendants(parentId: DiagramId): DiagramNode[] {
    const result: DiagramNode[] = []
    const visit = (id: DiagramId) => {
      for (const child of this.getChildren(id)) {
        result.push(child)
        visit(child.id)
      }
    }

    visit(parentId)

    return result
  }

  /** Ancestors of a node, closest first. */
  getAncestors(id: DiagramId): DiagramNode[] {
    const result: DiagramNode[] = []
    const seen = new Set<DiagramId>()
    let current = this.nodes.get(id)?.parentId

    while (current && !seen.has(current)) {
      seen.add(current)
      const parent = this.nodes.get(current)

      if (!parent) {
        break
      }

      result.push(parent)
      current = parent.parentId
    }

    return result
  }

  getLayers(): readonly DiagramLayer[] {
    return this.layers
  }

  getLayer(id: string | undefined) {
    return this.layers.find((layer) => layer.id === (id ?? this.layers[0]?.id))
  }

  /** Layer id a node or edge belongs to, falling back to the first layer. */
  resolveLayerId(element: { layerId?: string }) {
    if (element.layerId && this.layers.some((layer) => layer.id === element.layerId)) {
      return element.layerId
    }

    return this.layers[0]?.id ?? DEFAULT_LAYER_ID
  }

  getSettings(): Readonly<DiagramSettings> {
    return this.settings
  }

  /** Generates an id that is not used by any node or edge. */
  createId(prefix = 'node') {
    let id = createDiagramId(prefix)

    while (this.nodes.has(id) || this.edges.has(id)) {
      id = createDiagramId(prefix)
    }

    return id
  }

  /* Transactions */

  get inTransaction() {
    return this.transaction !== null
  }

  /**
   * Opens a transaction. Changes made until `commit()` become a single history entry. Nested
   * calls join the open transaction.
   */
  begin(label: string, options: DiagramTransactionOptions = {}) {
    if (this.transaction) {
      this.transaction.depth += 1
      return
    }

    this.transaction = {
      label,
      options,
      depth: 1,
      nodes: new Map(),
      edges: new Map(),
      selection: this.selectionHooks?.capture(),
    }
  }

  commit(): DiagramHistoryEntry | null {
    const tx = this.transaction

    if (!tx) {
      return null
    }

    tx.depth -= 1

    if (tx.depth > 0) {
      return null
    }

    this.transaction = null

    const entry = this.createEntry(tx)

    if (!entry) {
      return entry
    }

    if (tx.options.history !== false) {
      this.pushEntry(entry)
    }

    this.events.emit('commit', entry)

    return entry
  }

  /** Reverts every change of the open transaction. */
  rollback() {
    const tx = this.transaction

    if (!tx) {
      return
    }

    this.transaction = null

    const entry = this.createEntry(tx)

    if (entry) {
      this.batch(() => this.applyEntry(entry, 'before'), tx.options.source ?? 'local')
    }
  }

  /** Runs `fn` inside a transaction and commits it, even when `fn` throws. */
  transact<T>(label: string, fn: () => T, options: DiagramTransactionOptions = {}): T {
    this.begin(label, options)
    let failed = true

    try {
      const result = this.batch(fn, options.source)
      failed = false
      return result
    } finally {
      if (failed && this.transaction?.depth === 1) {
        this.rollback()
      } else {
        this.commit()
      }
    }
  }

  /** Groups change notifications. Listeners receive a single `change` event at the end. */
  batch<T>(fn: () => T, source?: DiagramChangeSource): T {
    this.batchDepth += 1

    if (source) {
      this.pending.source = source
    }

    try {
      return fn()
    } finally {
      this.batchDepth -= 1

      if (this.batchDepth === 0) {
        this.flush()
      }
    }
  }

  private run<T>(label: string, fn: () => T): T {
    if (this.transaction) {
      return this.batch(fn)
    }

    return this.transact(label, fn)
  }

  /* Nodes */

  addNode(node: DiagramNode, index?: number): DiagramNode {
    if (this.nodes.has(node.id) || this.edges.has(node.id)) {
      throw new Error(`[@mantine-vue/diagram] Duplicate id "${node.id}"`)
    }

    const record = cloneDeep(node)

    this.run('Add node', () => {
      this.recordNode(record.id)
      this.recordNodeOrder()
      this.setNodeRecord(record.id, record)
      const order = [...this.nodeOrder]
      order.splice(index ?? order.length, 0, record.id)
      this.setNodeOrderInternal(order)
    })

    return record
  }

  updateNode(id: DiagramId, update: DiagramNodeUpdate): DiagramNode | undefined {
    const current = this.nodes.get(id)

    if (!current) {
      return undefined
    }

    const next = typeof update === 'function' ? update(current) : { ...current, ...update, id }

    if (next === current) {
      return current
    }

    this.run('Update node', () => {
      this.recordNode(id)
      this.setNodeRecord(id, { ...next, id })
    })

    return this.nodes.get(id)
  }

  /** Merges `data` into the data of a node. */
  updateNodeData(id: DiagramId, data: Record<string, any>) {
    return this.updateNode(id, (node) => ({ ...node, data: { ...node.data, ...data } }))
  }

  /** Removes a node, its connected edges and detaches its children. */
  removeNode(id: DiagramId) {
    const node = this.nodes.get(id)

    if (!node) {
      return
    }

    this.run('Remove node', () => {
      for (const edge of this.getConnectedEdges(id)) {
        this.removeEdge(edge.id)
      }

      for (const child of this.getChildren(id)) {
        this.updateNode(child.id, { parentId: node.parentId })
      }

      this.recordNode(id)
      this.recordNodeOrder()
      this.setNodeRecord(id, undefined)
      this.setNodeOrderInternal(this.nodeOrder.filter((nodeId) => nodeId !== id))
    })
  }

  /** Replaces the rendering order. Ids that do not exist are ignored, missing ones are kept. */
  setNodeOrder(order: readonly DiagramId[]) {
    const seen = new Set<DiagramId>()
    const next = order.filter((id) => this.nodes.has(id) && !seen.has(id) && seen.add(id))

    for (const id of this.nodeOrder) {
      if (!seen.has(id)) {
        next.push(id)
      }
    }

    if (next.every((id, index) => this.nodeOrder[index] === id)) {
      return
    }

    this.run('Reorder', () => {
      this.recordNodeOrder()
      this.setNodeOrderInternal(next)
    })
  }

  /* Edges */

  addEdge(edge: DiagramEdge, index?: number): DiagramEdge {
    if (this.nodes.has(edge.id) || this.edges.has(edge.id)) {
      throw new Error(`[@mantine-vue/diagram] Duplicate id "${edge.id}"`)
    }

    const record = cloneDeep(edge)

    this.run('Add edge', () => {
      this.recordEdge(record.id)
      this.recordEdgeOrder()
      this.setEdgeRecord(record.id, record)
      const order = [...this.edgeOrder]
      order.splice(index ?? order.length, 0, record.id)
      this.setEdgeOrderInternal(order)
    })

    return record
  }

  updateEdge(id: DiagramId, update: DiagramEdgeUpdate): DiagramEdge | undefined {
    const current = this.edges.get(id)

    if (!current) {
      return undefined
    }

    const next = typeof update === 'function' ? update(current) : { ...current, ...update, id }

    if (next === current) {
      return current
    }

    this.run('Update edge', () => {
      this.recordEdge(id)
      this.setEdgeRecord(id, { ...next, id })
    })

    return this.edges.get(id)
  }

  removeEdge(id: DiagramId) {
    if (!this.edges.has(id)) {
      return
    }

    this.run('Remove edge', () => {
      this.recordEdge(id)
      this.recordEdgeOrder()
      this.setEdgeRecord(id, undefined)
      this.setEdgeOrderInternal(this.edgeOrder.filter((edgeId) => edgeId !== id))
    })
  }

  setEdgeOrder(order: readonly DiagramId[]) {
    const seen = new Set<DiagramId>()
    const next = order.filter((id) => this.edges.has(id) && !seen.has(id) && seen.add(id))

    for (const id of this.edgeOrder) {
      if (!seen.has(id)) {
        next.push(id)
      }
    }

    this.run('Reorder', () => {
      this.recordEdgeOrder()
      this.setEdgeOrderInternal(next)
    })
  }

  /* Layers, settings and metadata */

  setLayers(layers: DiagramLayer[]) {
    if (layers.length === 0) {
      throw new Error('[@mantine-vue/diagram] A diagram needs at least one layer')
    }

    this.run('Update layers', () => {
      if (this.transaction && !this.transaction.layers) {
        this.transaction.layers = this.layers
      }

      this.layers = layers.map((layer) => ({ ...layer }))
      this.pending.layers = true
    })
  }

  updateLayer(id: string, patch: Partial<Omit<DiagramLayer, 'id'>>) {
    this.setLayers(this.layers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)))
  }

  setSettings(settings: DiagramSettings) {
    this.run('Update settings', () => {
      if (this.transaction && !this.transaction.settings) {
        this.transaction.settings = this.settings
      }

      this.settings = cloneDeep(settings)
      this.pending.settings = true
    })
  }

  updateSettings(patch: Partial<DiagramSettings>) {
    this.setSettings({ ...this.settings, ...patch })
  }

  setDocumentMeta(meta: DiagramDocumentMeta) {
    this.run('Update document', () => {
      if (this.transaction && !this.transaction.meta) {
        this.transaction.meta = this.documentMeta
      }

      this.documentMeta = { ...this.documentMeta, ...meta }
      this.pending.meta = true
    })
  }

  getDocumentMeta(): Readonly<DiagramDocumentMeta> {
    return this.documentMeta
  }

  /* Documents */

  /** Replaces the whole document. The history is cleared unless `keepHistory` is set. */
  load(
    document: Partial<DiagramDocument>,
    options: { keepHistory?: boolean; source?: DiagramChangeSource } = {},
  ) {
    const nodes = (document.nodes ?? []).map((node) => cloneDeep(node))
    const edges = (document.edges ?? []).map((edge) => cloneDeep(edge))

    this.batch(() => {
      for (const id of this.nodes.keys()) {
        this.pending.nodes.add(id)
      }

      for (const id of this.edges.keys()) {
        this.pending.edges.add(id)
      }

      for (const id of this.nodes.keys()) {
        this.events.emit('node', { id, node: undefined })
      }

      this.nodes = new Map()
      this.edges = new Map()
      this.edgesByNode = new Map()
      this.childrenByParent = new Map()

      for (const node of nodes) {
        this.setNodeRecord(node.id, node)
      }

      for (const edge of edges) {
        this.setEdgeRecord(edge.id, edge)
      }

      this.setNodeOrderInternal(nodes.map((node) => node.id))
      this.setEdgeOrderInternal(edges.map((edge) => edge.id))
      this.layers =
        document.layers && document.layers.length > 0
          ? document.layers.map((layer) => ({ ...layer }))
          : [{ id: DEFAULT_LAYER_ID, name: 'Layer 1', visible: true }]
      this.settings = cloneDeep(document.settings ?? {})
      this.documentMeta = { id: document.id, name: document.name, meta: cloneDeep(document.meta) }
      this.pending.layers = true
      this.pending.settings = true
      this.pending.meta = true
    }, options.source ?? 'load')

    if (!options.keepHistory) {
      this.clearHistory()
    }
  }

  /** Snapshot of the document. Records are shared with the store and must not be mutated. */
  toDocument(): DiagramDocument {
    const { id, name, meta } = this.documentMeta
    const document: DiagramDocument = {
      version: DIAGRAM_SCHEMA_VERSION,
      nodes: [...this.getNodes()],
      edges: [...this.getEdges()],
      layers: [...this.layers],
      settings: this.settings,
    }

    if (id !== undefined) {
      document.id = id
    }

    if (name !== undefined) {
      document.name = name
    }

    if (meta !== undefined) {
      document.meta = meta
    }

    return document
  }

  /* History */

  get canUndo() {
    return this.undoStack.length > 0
  }

  get canRedo() {
    return this.redoStack.length > 0
  }

  get undoLabel() {
    return this.undoStack[this.undoStack.length - 1]?.label
  }

  get redoLabel() {
    return this.redoStack[this.redoStack.length - 1]?.label
  }

  getHistory(): { undo: readonly DiagramHistoryEntry[]; redo: readonly DiagramHistoryEntry[] } {
    return { undo: this.undoStack, redo: this.redoStack }
  }

  undo() {
    if (this.transaction) {
      this.commit()
    }

    const entry = this.undoStack.pop()

    if (!entry) {
      return false
    }

    this.batch(() => this.applyEntry(entry, 'before'), 'history')
    this.redoStack.push(entry)
    this.emitHistory()

    return true
  }

  redo() {
    const entry = this.redoStack.pop()

    if (!entry) {
      return false
    }

    this.batch(() => this.applyEntry(entry, 'after'), 'history')
    this.undoStack.push(entry)
    this.emitHistory()

    return true
  }

  clearHistory() {
    this.undoStack = []
    this.redoStack = []
    this.emitHistory()
  }

  /* Internals */

  private emptyPending() {
    return {
      nodes: new Set<DiagramId>(),
      edges: new Set<DiagramId>(),
      nodeOrder: false,
      edgeOrder: false,
      layers: false,
      settings: false,
      meta: false,
      source: 'local' as DiagramChangeSource,
    }
  }

  private flush() {
    const pending = this.pending
    this.pending = this.emptyPending()

    if (
      pending.nodes.size === 0 &&
      pending.edges.size === 0 &&
      !pending.nodeOrder &&
      !pending.edgeOrder &&
      !pending.layers &&
      !pending.settings &&
      !pending.meta
    ) {
      return
    }

    this.events.emit('change', pending)
  }

  private recordNode(id: DiagramId) {
    if (this.transaction && !this.transaction.nodes.has(id)) {
      this.transaction.nodes.set(id, this.nodes.get(id))
    }
  }

  private recordEdge(id: DiagramId) {
    if (this.transaction && !this.transaction.edges.has(id)) {
      this.transaction.edges.set(id, this.edges.get(id))
    }
  }

  private recordNodeOrder() {
    if (this.transaction && !this.transaction.nodeOrder) {
      this.transaction.nodeOrder = this.nodeOrder
    }
  }

  private recordEdgeOrder() {
    if (this.transaction && !this.transaction.edgeOrder) {
      this.transaction.edgeOrder = this.edgeOrder
    }
  }

  private setNodeRecord(id: DiagramId, node: DiagramNode | undefined) {
    const previous = this.nodes.get(id)

    if (previous?.parentId && previous.parentId !== node?.parentId) {
      this.childrenByParent.get(previous.parentId)?.delete(id)
    }

    if (node) {
      this.nodes.set(id, node)

      if (node.parentId) {
        let children = this.childrenByParent.get(node.parentId)

        if (!children) {
          children = new Set()
          this.childrenByParent.set(node.parentId, children)
        }

        children.add(id)
      }
    } else {
      this.nodes.delete(id)
    }

    this.nodesCache = null
    this.pending.nodes.add(id)
    this.events.emit('node', { id, node })
  }

  private setEdgeRecord(id: DiagramId, edge: DiagramEdge | undefined) {
    const previous = this.edges.get(id)

    if (previous) {
      for (const nodeId of [previous.source.nodeId, previous.target.nodeId]) {
        if (nodeId) {
          this.edgesByNode.get(nodeId)?.delete(id)
        }
      }
    }

    if (edge) {
      this.edges.set(id, edge)

      for (const nodeId of [edge.source.nodeId, edge.target.nodeId]) {
        if (nodeId) {
          let set = this.edgesByNode.get(nodeId)

          if (!set) {
            set = new Set()
            this.edgesByNode.set(nodeId, set)
          }

          set.add(id)
        }
      }
    } else {
      this.edges.delete(id)
    }

    this.edgesCache = null
    this.pending.edges.add(id)
  }

  private setNodeOrderInternal(order: DiagramId[]) {
    this.nodeOrder = order
    this.nodeIndex = null
    this.nodesCache = null
    this.pending.nodeOrder = true
  }

  private setEdgeOrderInternal(order: DiagramId[]) {
    this.edgeOrder = order
    this.edgesCache = null
    this.pending.edgeOrder = true
  }

  private createEntry(tx: ActiveTransaction): DiagramHistoryEntry | null {
    const entry: DiagramHistoryEntry = {
      label: tx.label,
      timestamp: Date.now(),
      mergeKey: tx.options.mergeKey,
      nodes: new Map(),
      edges: new Map(),
    }

    for (const [id, before] of tx.nodes) {
      const after = this.nodes.get(id)

      if (before !== after) {
        entry.nodes.set(id, { before, after })
      }
    }

    for (const [id, before] of tx.edges) {
      const after = this.edges.get(id)

      if (before !== after) {
        entry.edges.set(id, { before, after })
      }
    }

    if (tx.nodeOrder && tx.nodeOrder !== this.nodeOrder) {
      entry.nodeOrder = [tx.nodeOrder, this.nodeOrder]
    }

    if (tx.edgeOrder && tx.edgeOrder !== this.edgeOrder) {
      entry.edgeOrder = [tx.edgeOrder, this.edgeOrder]
    }

    if (tx.layers && tx.layers !== this.layers) {
      entry.layers = [tx.layers, this.layers]
    }

    if (tx.settings && tx.settings !== this.settings) {
      entry.settings = [tx.settings, this.settings]
    }

    if (tx.meta && tx.meta !== this.documentMeta) {
      entry.meta = [tx.meta, this.documentMeta]
    }

    const empty =
      entry.nodes.size === 0 &&
      entry.edges.size === 0 &&
      !entry.nodeOrder &&
      !entry.edgeOrder &&
      !entry.layers &&
      !entry.settings &&
      !entry.meta

    if (empty) {
      return null
    }

    if (tx.selection && this.selectionHooks) {
      entry.selection = [tx.selection, this.selectionHooks.capture()]
    }

    return entry
  }

  private pushEntry(entry: DiagramHistoryEntry) {
    const last = this.undoStack[this.undoStack.length - 1]

    if (
      last &&
      entry.mergeKey &&
      last.mergeKey === entry.mergeKey &&
      entry.timestamp - last.timestamp <= this.mergeWindow
    ) {
      this.mergeInto(last, entry)
    } else {
      this.undoStack.push(entry)

      if (this.undoStack.length > this.historyLimit) {
        this.undoStack.splice(0, this.undoStack.length - this.historyLimit)
      }
    }

    this.redoStack = []
    this.emitHistory()
  }

  private mergeInto(target: DiagramHistoryEntry, entry: DiagramHistoryEntry) {
    for (const [id, change] of entry.nodes) {
      const existing = target.nodes.get(id)
      target.nodes.set(id, {
        before: existing ? existing.before : change.before,
        after: change.after,
      })
    }

    for (const [id, change] of entry.edges) {
      const existing = target.edges.get(id)
      target.edges.set(id, {
        before: existing ? existing.before : change.before,
        after: change.after,
      })
    }

    const mergePair = <T>(a: [T, T] | undefined, b: [T, T] | undefined): [T, T] | undefined =>
      b ? [a ? a[0] : b[0], b[1]] : a

    target.nodeOrder = mergePair(target.nodeOrder, entry.nodeOrder)
    target.edgeOrder = mergePair(target.edgeOrder, entry.edgeOrder)
    target.layers = mergePair(target.layers, entry.layers)
    target.settings = mergePair(target.settings, entry.settings)
    target.meta = mergePair(target.meta, entry.meta)
    target.selection = mergePair(target.selection, entry.selection)
    target.timestamp = entry.timestamp
  }

  private applyEntry(entry: DiagramHistoryEntry, side: 'before' | 'after') {
    const pick = <T>(pair: [T, T]) => (side === 'before' ? pair[0] : pair[1])

    // Edges first, so the node edge index is consistent when nodes are re-added.
    for (const [id, change] of entry.edges) {
      this.setEdgeRecord(id, change[side])
    }

    for (const [id, change] of entry.nodes) {
      this.setNodeRecord(id, change[side])
    }

    for (const [id, change] of entry.edges) {
      if (change[side]) {
        this.setEdgeRecord(id, change[side])
      }
    }

    if (entry.nodeOrder) {
      this.setNodeOrderInternal(pick(entry.nodeOrder))
    }

    if (entry.edgeOrder) {
      this.setEdgeOrderInternal(pick(entry.edgeOrder))
    }

    if (entry.layers) {
      this.layers = pick(entry.layers)
      this.pending.layers = true
    }

    if (entry.settings) {
      this.settings = pick(entry.settings)
      this.pending.settings = true
    }

    if (entry.meta) {
      this.documentMeta = pick(entry.meta)
      this.pending.meta = true
    }

    if (entry.selection && this.selectionHooks) {
      this.selectionHooks.restore(pick(entry.selection))
    }
  }

  private emitHistory() {
    this.events.emit('history', { canUndo: this.canUndo, canRedo: this.canRedo })
  }
}
