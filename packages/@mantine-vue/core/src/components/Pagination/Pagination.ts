import PaginationComponent from './Pagination.vue'
import { PaginationControl } from './PaginationControl/PaginationControl'
import { PaginationDots } from './PaginationDots/PaginationDots'
import {
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from './PaginationEdges/PaginationEdges'
import { PaginationItems } from './PaginationItems/PaginationItems'
import { PaginationLabel } from './PaginationLabel/PaginationLabel'
import { PaginationRoot } from './PaginationRoot/PaginationRoot'
import classes from './Pagination.module.css'

export const Pagination = Object.assign(PaginationComponent, {
  classes,
  Root: PaginationRoot,
  Control: PaginationControl,
  Dots: PaginationDots,
  First: PaginationFirst,
  Last: PaginationLast,
  Next: PaginationNext,
  Previous: PaginationPrevious,
  Items: PaginationItems,
  Label: PaginationLabel,
})

export type { PaginationOwnProps, PaginationProps } from './Pagination.types'
