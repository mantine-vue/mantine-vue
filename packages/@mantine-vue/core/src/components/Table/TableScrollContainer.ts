import { withBoxProps } from '../../core'
import TableScrollContainerComponent, { varsResolver } from './TableScrollContainer.vue'
import classes from './Table.module.css'

export const TableScrollContainer = withBoxProps(TableScrollContainerComponent)
Object.assign(TableScrollContainer, { classes, varsResolver })

export type {
  TableScrollContainerCssVariables,
  TableScrollContainerOwnProps,
  TableScrollContainerProps,
  TableScrollContainerSlots,
  TableScrollContainerStylesNames,
} from './TableScrollContainer.types'
