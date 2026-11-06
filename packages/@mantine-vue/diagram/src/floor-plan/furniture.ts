import { metersToWorld } from '../core/units'
import type { DiagramScale } from '../core/types'
import type { DiagramTemplate } from '../vue/types'
import { FURNITURE_TYPE } from './geometry'

export interface FurnitureKind {
  kind: string
  label: string
  category: string
  /** Size in meters, width × depth */
  size: [number, number]
  keywords?: string[]
}

/** Furniture drawn by the built-in `floor-furniture` renderer. */
export const FURNITURE_KINDS: FurnitureKind[] = [
  { kind: 'sofa', label: 'Sofa', category: 'Living room', size: [2, 0.9], keywords: ['couch'] },
  { kind: 'armchair', label: 'Armchair', category: 'Living room', size: [0.85, 0.85] },
  { kind: 'coffee-table', label: 'Coffee table', category: 'Living room', size: [1.1, 0.6] },
  {
    kind: 'tv-stand',
    label: 'TV stand',
    category: 'Living room',
    size: [1.6, 0.45],
    keywords: ['television'],
  },
  { kind: 'bookshelf', label: 'Bookshelf', category: 'Living room', size: [1, 0.35] },
  { kind: 'plant', label: 'Plant', category: 'Living room', size: [0.5, 0.5] },
  { kind: 'piano', label: 'Piano', category: 'Living room', size: [1.5, 0.6] },
  { kind: 'bed-double', label: 'Double bed', category: 'Bedroom', size: [1.6, 2] },
  { kind: 'bed-single', label: 'Single bed', category: 'Bedroom', size: [0.9, 2] },
  {
    kind: 'wardrobe',
    label: 'Wardrobe',
    category: 'Bedroom',
    size: [1.2, 0.6],
    keywords: ['closet'],
  },
  { kind: 'nightstand', label: 'Nightstand', category: 'Bedroom', size: [0.45, 0.4] },
  { kind: 'dining-table', label: 'Dining table', category: 'Dining', size: [1.6, 0.9] },
  { kind: 'round-table', label: 'Round table', category: 'Dining', size: [1, 1] },
  { kind: 'chair', label: 'Chair', category: 'Dining', size: [0.45, 0.5] },
  { kind: 'kitchen-counter', label: 'Counter', category: 'Kitchen', size: [2.4, 0.6] },
  {
    kind: 'stove',
    label: 'Stove',
    category: 'Kitchen',
    size: [0.6, 0.6],
    keywords: ['oven', 'cooker'],
  },
  {
    kind: 'fridge',
    label: 'Fridge',
    category: 'Kitchen',
    size: [0.7, 0.7],
    keywords: ['refrigerator'],
  },
  { kind: 'sink', label: 'Sink', category: 'Kitchen', size: [0.6, 0.5] },
  { kind: 'toilet', label: 'Toilet', category: 'Bathroom', size: [0.4, 0.65], keywords: ['wc'] },
  { kind: 'bathtub', label: 'Bathtub', category: 'Bathroom', size: [1.7, 0.75] },
  { kind: 'shower', label: 'Shower', category: 'Bathroom', size: [0.9, 0.9] },
  { kind: 'washbasin', label: 'Washbasin', category: 'Bathroom', size: [0.55, 0.45] },
  { kind: 'desk', label: 'Desk', category: 'Office', size: [1.4, 0.7] },
  { kind: 'office-chair', label: 'Office chair', category: 'Office', size: [0.6, 0.6] },
  { kind: 'meeting-table', label: 'Meeting table', category: 'Office', size: [2.4, 1.1] },
  { kind: 'cabinet', label: 'Cabinet', category: 'Office', size: [0.8, 0.45] },
]

/**
 * Palette templates of the furniture library. Sizes follow the real world scale of the
 * document, `100` world units per meter by default.
 */
export function createFurnitureTemplates(
  scale: Pick<DiagramScale, 'pixelsPerMeter'> = { pixelsPerMeter: 100 },
  kinds: readonly FurnitureKind[] = FURNITURE_KINDS,
): DiagramTemplate[] {
  return kinds.map((item) => ({
    id: `furniture:${item.kind}`,
    label: item.label,
    category: item.category,
    keywords: item.keywords,
    node: {
      type: FURNITURE_TYPE,
      width: metersToWorld(item.size[0], { ...scale, unit: 'm' }),
      height: metersToWorld(item.size[1], { ...scale, unit: 'm' }),
      data: { kind: item.kind },
    },
  }))
}
