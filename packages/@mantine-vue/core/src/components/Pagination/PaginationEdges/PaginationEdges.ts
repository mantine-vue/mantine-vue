import { factory } from '../../../core'
import type { PaginationEdgeFactory } from './PaginationEdges.types'
import PaginationFirstComponent from './PaginationFirst.vue'
import PaginationLastComponent from './PaginationLast.vue'
import PaginationNextComponent from './PaginationNext.vue'
import PaginationPreviousComponent from './PaginationPrevious.vue'

/**
 * The four edge controls share `PaginationEdge.vue`; each wrapper only fixes the edge
 * it targets so the component keeps its own name in devtools and in
 * `findComponent({ name })` lookups.
 */
export const PaginationNext = factory<PaginationEdgeFactory>(PaginationNextComponent)
export const PaginationPrevious = factory<PaginationEdgeFactory>(PaginationPreviousComponent)
export const PaginationFirst = factory<PaginationEdgeFactory>(PaginationFirstComponent)
export const PaginationLast = factory<PaginationEdgeFactory>(PaginationLastComponent)

export type {
  PaginationEdgeFactory,
  PaginationEdgeKind,
  PaginationEdgeOwnProps,
  PaginationEdgeProps,
  PaginationEdgeSlots,
} from './PaginationEdges.types'

/** The edge controls share one props interface; each name is kept for discoverability. */
export type {
  PaginationEdgeProps as PaginationNextProps,
  PaginationEdgeProps as PaginationPreviousProps,
  PaginationEdgeProps as PaginationFirstProps,
  PaginationEdgeProps as PaginationLastProps,
} from './PaginationEdges.types'
