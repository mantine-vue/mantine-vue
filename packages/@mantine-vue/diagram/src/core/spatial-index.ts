import { rectsIntersect, type Rect } from './geometry'

const OVERFLOW = '*'

/**
 * Uniform grid spatial hash. Diagrams are mostly evenly distributed shapes of similar size, for
 * which a grid answers viewport and neighborhood queries in near constant time and is much
 * cheaper to update during drags than a tree.
 */
export class SpatialIndex<K = string> {
  private cells = new Map<string, Set<K>>()
  private bounds = new Map<K, Rect>()
  private keysByItem = new Map<K, string[]>()

  constructor(readonly cellSize = 256) {}

  get size() {
    return this.bounds.size
  }

  has(id: K) {
    return this.bounds.has(id)
  }

  getBounds(id: K) {
    return this.bounds.get(id)
  }

  set(id: K, rect: Rect) {
    const keys = this.cellKeys(rect)
    const previous = this.keysByItem.get(id)
    this.bounds.set(id, rect)

    if (
      previous &&
      previous.length === keys.length &&
      previous.every((key, i) => key === keys[i])
    ) {
      return
    }

    if (previous) {
      this.removeFromCells(id, previous)
    }

    for (const key of keys) {
      let cell = this.cells.get(key)

      if (!cell) {
        cell = new Set()
        this.cells.set(key, cell)
      }

      cell.add(id)
    }

    this.keysByItem.set(id, keys)
  }

  delete(id: K) {
    const keys = this.keysByItem.get(id)

    if (keys) {
      this.removeFromCells(id, keys)
    }

    this.keysByItem.delete(id)
    this.bounds.delete(id)
  }

  clear() {
    this.cells.clear()
    this.bounds.clear()
    this.keysByItem.clear()
  }

  /** Ids whose bounds intersect `rect`. */
  query(rect: Rect): Set<K> {
    const result = new Set<K>()
    const keys = this.cellKeys(rect)

    // Queries larger than the grid budget are cheaper as a linear scan.
    if (keys[0] === OVERFLOW) {
      for (const [id, bounds] of this.bounds) {
        if (rectsIntersect(bounds, rect)) {
          result.add(id)
        }
      }

      return result
    }

    keys.push(OVERFLOW)

    for (const key of keys) {
      const cell = this.cells.get(key)

      if (!cell) {
        continue
      }

      for (const id of cell) {
        if (!result.has(id) && rectsIntersect(this.bounds.get(id)!, rect)) {
          result.add(id)
        }
      }
    }

    return result
  }

  private removeFromCells(id: K, keys: string[]) {
    for (const key of keys) {
      const cell = this.cells.get(key)
      cell?.delete(id)

      if (cell && cell.size === 0) {
        this.cells.delete(key)
      }
    }
  }

  private cellKeys(rect: Rect) {
    const size = this.cellSize
    const minX = Math.floor(rect.x / size)
    const minY = Math.floor(rect.y / size)
    const maxX = Math.floor((rect.x + Math.max(0, rect.width)) / size)
    const maxY = Math.floor((rect.y + Math.max(0, rect.height)) / size)
    const keys: string[] = []

    // Huge items would touch thousands of cells, they live in one overflow cell instead.
    if ((maxX - minX + 1) * (maxY - minY + 1) > 256) {
      return [OVERFLOW]
    }

    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        keys.push(`${x}:${y}`)
      }
    }

    return keys
  }
}
