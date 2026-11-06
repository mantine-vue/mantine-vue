import { computed } from 'vue'
import type { DiagramLayer, DiagramNode } from '../core/types'
import type { DiagramController } from '../vue/use-diagram'

export const FLOOR_LAYER_KIND = 'floor'

export interface UseFloorPlanFloorsOptions {
  /** How floors other than the active one are shown: hidden, or faded and locked as a reference */
  others?: 'hidden' | 'ghost'
  /** Opacity of other floors in the `'ghost'` mode, `0.25` by default */
  ghostOpacity?: number
}

/**
 * Multi-floor plans. Every floor is a layer of the kind `'floor'`, so floors are saved with the
 * document and work with every layer feature. Switching floors only changes visibility and is
 * not recorded in the history.
 */
export function useFloorPlanFloors(
  controller: DiagramController,
  options: UseFloorPlanFloorsOptions = {},
) {
  const { editor } = controller
  const others = options.others ?? 'hidden'
  const ghostOpacity = options.ghostOpacity ?? 0.25

  const floors = computed(() => {
    const layers = controller.layers.value
    const tagged = layers.filter((layer) => layer.kind === FLOOR_LAYER_KIND)

    return tagged.length > 0 ? tagged : layers
  })

  const activeFloor = computed(
    () =>
      floors.value.find((floor) => floor.id === controller.activeLayerId.value) ?? floors.value[0],
  )

  const applyVisibility = (activeId: string) => {
    const layers = editor.store.getLayers().map((layer): DiagramLayer => {
      if (!floors.value.some((floor) => floor.id === layer.id)) {
        return layer
      }

      if (layer.id === activeId) {
        return { ...layer, visible: true, locked: false, opacity: undefined }
      }

      return others === 'ghost'
        ? { ...layer, visible: true, locked: true, opacity: ghostOpacity }
        : { ...layer, visible: false, locked: false, opacity: undefined }
    })

    editor.store.transact('Switch floor', () => editor.store.setLayers(layers), { history: false })
  }

  const setActiveFloor = (id: string) => {
    if (!floors.value.some((floor) => floor.id === id)) {
      return
    }

    editor.setActiveLayer(id)
    applyVisibility(id)
    editor.setSelection([])
  }

  /** Adds a floor above the others and makes it active. */
  const addFloor = (name?: string, meta?: Record<string, unknown>) => {
    // The first floor of a plain document becomes a floor layer too.
    const layers = editor.store.getLayers()

    if (!layers.some((layer) => layer.kind === FLOOR_LAYER_KIND)) {
      editor.store.transact('Add floor', () =>
        editor.store.setLayers(
          layers.map((layer, index) =>
            index === 0 ? { ...layer, kind: FLOOR_LAYER_KIND } : layer,
          ),
        ),
      )
    }

    const floor = editor.addLayer({
      name: name ?? `Floor ${floors.value.length + 1}`,
      kind: FLOOR_LAYER_KIND,
      meta,
    })
    setActiveFloor(floor.id)

    return floor
  }

  const removeFloor = (id: string) => {
    if (floors.value.length <= 1) {
      return
    }

    editor.removeLayer(id, null)
    setActiveFloor(floors.value[0].id)
  }

  /** Nodes on a floor, top level only. */
  const nodesOn = (id: string): DiagramNode[] =>
    editor.store
      .getNodes()
      .filter((node) => !node.parentId && editor.store.resolveLayerId(node) === id)

  return { floors, activeFloor, setActiveFloor, addFloor, removeFloor, nodesOn }
}

export interface ImportFloorPlanImageOptions {
  /** Width of the image in world units, its natural width by default */
  width?: number
  /** Height in world units, from the aspect ratio of the image by default */
  height?: number
  /** Top left corner in world units, the origin by default */
  position?: { x: number; y: number }
  opacity?: number
  /** Locks the image so it is not moved by accident, `true` by default */
  lock?: boolean
  layerId?: string
  label?: string
}

function readAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

const FALLBACK_SIZE = { width: 1000, height: 750 }

/** Natural size of an image, a fallback when it cannot be loaded within a few seconds. */
function imageSize(src: string) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(FALLBACK_SIZE)
      return
    }

    const image = new Image()
    const timeout = setTimeout(() => resolve(FALLBACK_SIZE), 3000)
    image.onload = () => {
      clearTimeout(timeout)
      resolve({
        width: image.naturalWidth || FALLBACK_SIZE.width,
        height: image.naturalHeight || FALLBACK_SIZE.height,
      })
    }
    image.onerror = () => {
      clearTimeout(timeout)
      resolve(FALLBACK_SIZE)
    }
    image.src = src
  })
}

/**
 * Adds a scanned or exported floor plan as a locked image behind everything else, to trace walls
 * over it. Files are embedded as data URLs, so the document stays self contained.
 */
export async function importFloorPlanImage(
  controller: DiagramController,
  source: Blob | string,
  options: ImportFloorPlanImageOptions = {},
): Promise<DiagramNode> {
  const { editor } = controller
  const src = typeof source === 'string' ? source : await readAsDataUrl(source)
  const natural =
    options.width && options.height
      ? { width: options.width, height: options.height }
      : await imageSize(src)
  const width = options.width ?? natural.width
  const height = options.height ?? (width / natural.width) * natural.height
  const node = editor.createNode({
    type: 'image',
    x: options.position?.x ?? 0,
    y: options.position?.y ?? 0,
    width,
    height,
    label: options.label ?? 'Floor plan',
    locked: options.lock ?? true,
    layerId: options.layerId,
    data: { src, fit: 'fill', opacity: options.opacity ?? 0.6 },
  })

  editor.store.transact('Import floor plan', () => editor.store.addNode(node, 0))

  return editor.store.getNode(node.id)!
}
