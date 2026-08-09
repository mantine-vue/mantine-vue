import { withBoxProps } from '../../../core'
import PaginationDotsComponent from './PaginationDots.vue'

export const PaginationDots = withBoxProps(PaginationDotsComponent)

export type {
  PaginationDotsOwnProps,
  PaginationDotsProps,
  PaginationDotsSlots,
} from './PaginationDots.types'
