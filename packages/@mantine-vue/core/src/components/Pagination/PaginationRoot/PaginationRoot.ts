import PaginationRootComponent, { varsResolver } from './PaginationRoot.vue'
import classes from '../Pagination.module.css'

/**
 * Owns the pagination state and the context every `Pagination.*` control reads.
 *
 * `classes` and `varsResolver` stay attached because theme extensions and the Styles
 * API validator read them off the component.
 */
export const PaginationRoot = Object.assign(PaginationRootComponent, { classes, varsResolver })

export type {
  PaginationLayout,
  PaginationRootCssVariables,
  PaginationRootOwnProps,
  PaginationRootProps,
  PaginationRootSlots,
  PaginationRootStylesNames,
} from './PaginationRoot.types'
