import { factory } from '../../../core'
import PaginationLabelComponent from './PaginationLabel.vue'
import type { PaginationLabelFactory } from './PaginationLabel.types'

export const PaginationLabel = factory<PaginationLabelFactory>(PaginationLabelComponent)

export type {
  PaginationLabelFactory,
  PaginationLabelProps,
  PaginationLabelSlots,
  PaginationLabelStylesNames,
} from './PaginationLabel.types'
