import { withBoxProps } from '../../../core'
import PaginationControlComponent from './PaginationControl.vue'

/** Single control of a `Pagination`: a page number or an edge button. */
export const PaginationControl = withBoxProps(PaginationControlComponent)

export type {
  PaginationControlOwnProps,
  PaginationControlProps,
  PaginationControlSlots,
} from './PaginationControl.types'
