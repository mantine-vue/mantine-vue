import { factory } from '../../../core'
import PaginationControlComponent from './PaginationControl.vue'
import type { PaginationControlFactory } from './PaginationControl.types'
import classes from '../Pagination.module.css'

/** Single control of a `Pagination`: a page number or an edge button. */
export const PaginationControl = factory<PaginationControlFactory>(PaginationControlComponent, {
  classes,
})

export type {
  PaginationControlOwnProps,
  PaginationControlProps,
  PaginationControlSlots,
  PaginationControlFactory,
} from './PaginationControl.types'
