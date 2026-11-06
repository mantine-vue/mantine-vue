import { shallowRef, type ShallowRef } from 'vue'
import type { Point } from '../core/geometry'
import type { DiagramChange } from '../core/store'
import type { DiagramId } from '../core/types'
import type { DiagramController } from '../vue/use-diagram'
import { computeWallOutline, getWallNeighbors, outlinesEqual, WALL_TYPE } from './geometry'

export const FLOOR_PLAN_STATE_KEY = 'floorPlan'

/** Reactive wall join geometry shared by the wall renderers of one diagram. */
export interface FloorPlanRuntime {
  /** Outline of a wall in world coordinates with mitered joins */
  wallOutline: (id: DiagramId) => Readonly<ShallowRef<Point[] | null>>
  /** Recomputes every wall outline */
  refresh: () => void
  dispose: () => void
}

export function getFloorPlanRuntime(controller: DiagramController): FloorPlanRuntime | undefined {
  return controller.state[FLOOR_PLAN_STATE_KEY] as FloorPlanRuntime | undefined
}

/**
 * Keeps wall outlines up to date. A wall change recomputes the walls around the old and the
 * new position of that wall only, and refs are written only when an outline really changed.
 */
export function createFloorPlanRuntime(
  controller: DiagramController,
  tolerance = 1,
): FloorPlanRuntime {
  const { editor } = controller
  const outlines = new Map<DiagramId, ShallowRef<Point[] | null>>()
  const neighborsOf = new Map<DiagramId, Set<DiagramId>>()

  const ref = (id: DiagramId) => {
    let existing = outlines.get(id)

    if (!existing) {
      existing = shallowRef<Point[] | null>(null)
      outlines.set(id, existing)
      update(id)
    }

    return existing
  }

  const update = (id: DiagramId) => {
    const wall = editor.store.getNode(id)
    const target = outlines.get(id)

    if (!wall || wall.type !== WALL_TYPE) {
      if (target) {
        target.value = null
      }

      neighborsOf.delete(id)
      return
    }

    const neighbors = getWallNeighbors(editor, wall, tolerance)
    neighborsOf.set(id, new Set(neighbors.map((node) => node.id)))

    if (!target) {
      return
    }

    const next = computeWallOutline(wall, neighbors, tolerance)

    if (!outlinesEqual(target.value, next)) {
      target.value = next
    }
  }

  const onChange = (change: DiagramChange) => {
    const affected = new Set<DiagramId>()

    for (const id of change.nodes) {
      const node = editor.store.getNode(id)
      const wasWall = neighborsOf.has(id)

      if (!wasWall && node?.type !== WALL_TYPE) {
        continue
      }

      affected.add(id)
      neighborsOf.get(id)?.forEach((neighbor) => affected.add(neighbor))

      // Walls that were joined to it, it may have moved away from them.
      for (const [wallId, neighbors] of neighborsOf) {
        if (neighbors.has(id)) {
          affected.add(wallId)
        }
      }

      if (node?.type === WALL_TYPE) {
        getWallNeighbors(editor, node, tolerance).forEach((neighbor) => affected.add(neighbor.id))
      }
    }

    affected.forEach(update)
  }

  const off = editor.events.on('change', onChange)

  return {
    wallOutline: ref,
    refresh: () => outlines.forEach((_, id) => update(id)),
    dispose: () => {
      off()
      outlines.clear()
      neighborsOf.clear()
    },
  }
}
