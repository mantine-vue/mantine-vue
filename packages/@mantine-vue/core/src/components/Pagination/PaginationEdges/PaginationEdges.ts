import { withBoxProps } from '../../../core'
import PaginationFirstComponent from './PaginationFirst.vue'
import PaginationLastComponent from './PaginationLast.vue'
import PaginationNextComponent from './PaginationNext.vue'
import PaginationPreviousComponent from './PaginationPrevious.vue'

/**
 * The four edge controls share `PaginationEdge.vue`; each wrapper only fixes the edge
 * it targets so the component keeps its own name in devtools and in
 * `findComponent({ name })` lookups.
 */
export const PaginationNext = withBoxProps(PaginationNextComponent)
export const PaginationPrevious = withBoxProps(PaginationPreviousComponent)
export const PaginationFirst = withBoxProps(PaginationFirstComponent)
export const PaginationLast = withBoxProps(PaginationLastComponent)

export type {
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
