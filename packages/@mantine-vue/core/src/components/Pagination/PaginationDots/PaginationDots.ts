import { factory } from '../../../core'
import PaginationDotsComponent from './PaginationDots.vue'
import type { PaginationDotsFactory } from './PaginationDots.types'

export const PaginationDots = factory<PaginationDotsFactory>(PaginationDotsComponent)

export type {
  PaginationDotsFactory,
  PaginationDotsOwnProps,
  PaginationDotsProps,
  PaginationDotsSlots,
  PaginationDotsStylesNames,
} from './PaginationDots.types'
