import { factory } from '../../core'
import TableScrollContainerComponent, { varsResolver } from './TableScrollContainer.vue'
import type { TableScrollContainerFactory } from './TableScrollContainer.types'
import classes from './Table.module.css'

export const TableScrollContainer = factory<TableScrollContainerFactory>(
  TableScrollContainerComponent,
  { classes, varsResolver },
)

export type {
  TableScrollContainerCssVariables,
  TableScrollContainerFactory,
  TableScrollContainerOwnProps,
  TableScrollContainerProps,
  TableScrollContainerSlots,
  TableScrollContainerStylesNames,
} from './TableScrollContainer.types'
