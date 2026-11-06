import {
  computed,
  getCurrentScope,
  markRaw,
  onScopeDispose,
  ref,
  shallowReactive,
  shallowRef,
  triggerRef,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue'
import { DiagramEditor, type DiagramEditingTarget, type DiagramEditorOptions } from '../core/editor'
import type { DiagramChange } from '../core/store'
import type {
  DiagramDocument,
  DiagramEdge,
  DiagramId,
  DiagramInteractionMode,
  DiagramLayer,
  DiagramNode,
  DiagramOverlay,
  DiagramSettings,
  DiagramViewport,
} from '../core/types'
import { BUILT_IN_NODE_TYPES } from '../components/shapes/built-in-node-types'
import { createDefaultTools } from './default-tools'
import type { DiagramExtension, DiagramNodeType, DiagramTemplate } from './types'

export interface UseDiagramOptions extends DiagramEditorOptions {
  /** Node types with renderers, added to the built-in ones */
  nodeTypes?: DiagramNodeType[]
  /** Extensions such as `floorPlanExtension()` or `restaurantExtension()` */
  extensions?: DiagramExtension[]
  /** Templates offered by palettes */
  templates?: DiagramTemplate[]
  /** Registers the rectangle, ellipse, decision, text, connector, line and polygon tools, `true` by default */
  defaultTools?: boolean
}

/**
 * Reactive handle of a diagram editor. State is mirrored into shallow refs per element, so
 * moving one node re-renders that node and its connectors only.
 */
export interface DiagramController {
  /** Framework agnostic editor with the complete programmatic API */
  readonly editor: DiagramEditor
  /** Node ids in rendering order */
  readonly nodeIds: Readonly<ShallowRef<readonly DiagramId[]>>
  /** Edge ids in rendering order */
  readonly edgeIds: Readonly<ShallowRef<readonly DiagramId[]>>
  readonly selection: Readonly<ShallowRef<readonly DiagramId[]>>
  readonly selectionSet: ComputedRef<ReadonlySet<DiagramId>>
  readonly viewport: Readonly<ShallowRef<DiagramViewport>>
  readonly viewportSize: Readonly<ShallowRef<{ width: number; height: number }>>
  readonly overlay: Readonly<ShallowRef<DiagramOverlay>>
  readonly mode: Readonly<Ref<DiagramInteractionMode>>
  readonly tool: Readonly<Ref<string>>
  readonly editing: Readonly<ShallowRef<DiagramEditingTarget | null>>
  readonly layers: Readonly<ShallowRef<readonly DiagramLayer[]>>
  readonly activeLayerId: Readonly<Ref<string>>
  readonly settings: Readonly<ShallowRef<Readonly<DiagramSettings>>>
  readonly canUndo: Readonly<Ref<boolean>>
  readonly canRedo: Readonly<Ref<boolean>>
  /** Increments with every change of the document */
  readonly version: Readonly<Ref<number>>
  /** Increments when the order, layers, groups or visibility of elements change */
  readonly structureVersion: Readonly<Ref<number>>
  /** Increments after every completed transaction, undo, redo and load */
  readonly commitVersion: Readonly<Ref<number>>
  /** Increments when obstacle-aware edge routes need to be recalculated */
  readonly routeVersion: Readonly<Ref<number>>
  /** Increments when editor options change */
  readonly optionsVersion: Readonly<Ref<number>>
  /** Registered node types by type name */
  readonly nodeTypes: ReadonlyMap<string, DiagramNodeType>
  readonly templates: Readonly<ShallowRef<readonly DiagramTemplate[]>>
  /** Shared state of extensions, e.g. colliding node ids or live table statuses */
  readonly state: Record<string, unknown>
  /** Elements of the mounted `Diagram`, used for exports and fullscreen */
  readonly elements: ShallowRef<{ root: HTMLElement | null; content: SVGGElement | null }>

  /** Reactive record of a node, `undefined` once it is removed */
  nodeRef: (id: DiagramId) => Readonly<ShallowRef<DiagramNode | undefined>>
  edgeRef: (id: DiagramId) => Readonly<ShallowRef<DiagramEdge | undefined>>
  registerNodeType: (type: DiagramNodeType) => () => void
  addExtension: (extension: DiagramExtension) => void
  addTemplates: (templates: DiagramTemplate[]) => void
  toDocument: () => DiagramDocument
  load: (document: Partial<DiagramDocument>, options?: { keepHistory?: boolean }) => void
  execute: (commandId: string) => boolean
  destroy: () => void
}

/** Creates an editor with a reactive mirror. Also usable without the `Diagram` component. */
export function useDiagram(options: UseDiagramOptions = {}): DiagramController {
  const {
    nodeTypes = [],
    extensions = [],
    templates: initialTemplates = [],
    defaultTools = true,
    ...editorOptions
  } = options
  const editor = markRaw(
    new DiagramEditor({
      ...editorOptions,
      tools: [...(defaultTools ? createDefaultTools() : []), ...(editorOptions.tools ?? [])],
    }),
  )
  const store = editor.store

  const nodeRefs = new Map<DiagramId, ShallowRef<DiagramNode | undefined>>()
  const edgeRefs = new Map<DiagramId, ShallowRef<DiagramEdge | undefined>>()
  const nodeIds = shallowRef<readonly DiagramId[]>([...store.getNodeOrder()])
  const edgeIds = shallowRef<readonly DiagramId[]>([...store.getEdgeOrder()])
  const selection = shallowRef<readonly DiagramId[]>(editor.getSelectedIds())
  const viewport = shallowRef(editor.viewport)
  const viewportSize = shallowRef({ ...editor.viewportSize })
  const overlay = shallowRef(editor.overlay)
  const mode = ref(editor.mode)
  const tool = ref(editor.activeTool)
  const editing = shallowRef(editor.editing)
  const layers = shallowRef(store.getLayers())
  const activeLayerId = ref(editor.activeLayerId)
  const settings = shallowRef(store.getSettings())
  const canUndo = ref(editor.canUndo)
  const canRedo = ref(editor.canRedo)
  const version = ref(0)
  const structureVersion = ref(0)
  const commitVersion = ref(0)
  const routeVersion = ref(0)
  const optionsVersion = ref(0)
  const registry = new Map<DiagramId, DiagramNodeType>()
  const registryStacks = new Map<DiagramId, DiagramNodeType[]>()
  const templates = shallowRef<readonly DiagramTemplate[]>([])
  const state = shallowReactive<Record<string, unknown>>({})
  const elements = shallowRef<{ root: HTMLElement | null; content: SVGGElement | null }>({
    root: null,
    content: null,
  })
  const cleanups: (() => void)[] = []
  const installedExtensions = new Set<string>()

  const selectionSet = computed<ReadonlySet<DiagramId>>(() => new Set(selection.value))

  const structural = (a: DiagramNode | undefined, b: DiagramNode | undefined) =>
    !a ||
    !b ||
    a.layerId !== b.layerId ||
    a.parentId !== b.parentId ||
    a.hidden !== b.hidden ||
    a.type !== b.type

  const onChange = (change: DiagramChange) => {
    let structureChanged = change.nodeOrder || change.edgeOrder || change.layers

    for (const id of change.nodes) {
      const node = store.getNode(id)
      const existing = nodeRefs.get(id)

      if (existing) {
        structureChanged ||= structural(existing.value, node)
        existing.value = node
      } else {
        structureChanged = true
      }

      if (!node) {
        nodeRefs.delete(id)
      }
    }

    for (const id of change.edges) {
      const edge = store.getEdge(id)
      const existing = edgeRefs.get(id)

      if (existing) {
        structureChanged ||=
          !edge ||
          existing.value?.hidden !== edge.hidden ||
          existing.value?.layerId !== edge.layerId
        existing.value = edge
      }

      if (!edge) {
        edgeRefs.delete(id)
      }
    }

    if (change.nodeOrder) {
      nodeIds.value = [...store.getNodeOrder()]
    }

    if (change.edgeOrder) {
      edgeIds.value = [...store.getEdgeOrder()]
    }

    if (change.layers) {
      layers.value = store.getLayers()
    }

    if (change.settings) {
      settings.value = store.getSettings()
    }

    if (structureChanged) {
      structureVersion.value += 1
    }

    if (change.source !== 'local') {
      commitVersion.value += 1
    }

    version.value += 1
  }

  cleanups.push(
    editor.events.on('change', onChange),
    editor.events.on('commit', () => {
      commitVersion.value += 1
    }),
    editor.events.on('routes', () => {
      routeVersion.value += 1
    }),
    editor.events.on('history', (history) => {
      canUndo.value = history.canUndo
      canRedo.value = history.canRedo
    }),
    editor.events.on('selection', (ids) => {
      selection.value = ids
    }),
    editor.events.on('viewport', (value) => {
      viewport.value = value
    }),
    editor.events.on('resize', (size) => {
      viewportSize.value = { ...size }
    }),
    editor.events.on('overlay', (value) => {
      overlay.value = value
    }),
    editor.events.on('mode', (value) => {
      mode.value = value
    }),
    editor.events.on('tool', (value) => {
      tool.value = value
    }),
    editor.events.on('editing', (value) => {
      editing.value = value
    }),
    editor.events.on('activeLayer', (value) => {
      activeLayerId.value = value
    }),
    editor.events.on('options', () => {
      optionsVersion.value += 1
      mode.value = editor.mode
    }),
  )

  const nodeRef = (id: DiagramId) => {
    let existing = nodeRefs.get(id)

    if (!existing) {
      existing = shallowRef(store.getNode(id))
      nodeRefs.set(id, existing)
    }

    return existing
  }

  const edgeRef = (id: DiagramId) => {
    let existing = edgeRefs.get(id)

    if (!existing) {
      existing = shallowRef(store.getEdge(id))
      edgeRefs.set(id, existing)
    }

    return existing
  }

  const registerNodeType = (type: DiagramNodeType) => {
    const registered = markRaw(type)
    const stack = registryStacks.get(type.type) ?? []
    stack.push(registered)
    registryStacks.set(type.type, stack)
    registry.set(type.type, registered)
    const unregister = editor.registerBehavior(type)
    structureVersion.value += 1

    return () => {
      unregister()

      const current = registryStacks.get(type.type)
      const index = current?.lastIndexOf(registered) ?? -1

      if (current && index !== -1) {
        current.splice(index, 1)
      }

      const previous = current?.at(-1)

      if (previous) {
        registry.set(type.type, previous)
      } else {
        registryStacks.delete(type.type)
        registry.delete(type.type)
      }

      structureVersion.value += 1
    }
  }

  const addTemplates = (items: DiagramTemplate[]) => {
    const ids = new Set(items.map((item) => item.id))
    templates.value = [...templates.value.filter((item) => !ids.has(item.id)), ...items]
  }

  const controller: DiagramController = {
    editor,
    nodeIds,
    edgeIds,
    selection,
    selectionSet,
    viewport,
    viewportSize,
    overlay,
    mode,
    tool,
    editing,
    layers,
    activeLayerId,
    settings,
    canUndo,
    canRedo,
    version,
    structureVersion,
    commitVersion,
    routeVersion,
    optionsVersion,
    nodeTypes: registry,
    templates,
    state,
    elements,
    nodeRef,
    edgeRef,
    registerNodeType,
    addExtension(extension) {
      if (installedExtensions.has(extension.name)) {
        return
      }

      installedExtensions.add(extension.name)
      extension.nodeTypes?.forEach((type) => cleanups.push(registerNodeType(type)))
      extension.tools?.forEach((item) => cleanups.push(editor.registerTool(item)))
      extension.commands?.forEach((item) => cleanups.push(editor.registerCommand(item)))
      Object.entries(extension.routers ?? {}).forEach(([name, router]) =>
        cleanups.push(editor.registerRouter(name, router)),
      )
      extension.plugins?.forEach((plugin) => editor.use(plugin))

      if (extension.templates) {
        addTemplates(extension.templates)
      }

      const cleanup = extension.setup?.(controller)

      if (cleanup) {
        cleanups.push(cleanup)
      }
    },
    addTemplates,
    toDocument: () => editor.toDocument(),
    load: (document, loadOptions) => editor.load(document, loadOptions),
    execute: (commandId) => editor.execute(commandId),
    destroy() {
      cleanups.splice(0).forEach((cleanup) => cleanup())
      editor.destroy()
    },
  }

  BUILT_IN_NODE_TYPES.forEach((type) => registerNodeType(type))
  nodeTypes.forEach((type) => registerNodeType(type))
  extensions.forEach((extension) => controller.addExtension(extension))
  addTemplates(initialTemplates)

  // Node records loaded before the mirror existed.
  triggerRef(nodeIds)

  if (getCurrentScope()) {
    onScopeDispose(() => controller.destroy())
  }

  return controller
}
