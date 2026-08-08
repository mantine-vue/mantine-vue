import { withBoxProps } from '../../core'
import { GridCol } from './GridCol/GridCol'
import GridComponent, { varsResolver } from './Grid.vue'
import classes from './Grid.module.css'
export const Grid = withBoxProps(
  Object.assign(GridComponent, { classes, varsResolver, Col: GridCol }),
)
export type {
  GridCssVariables,
  GridOwnProps,
  GridProps,
  GridSlots,
  GridStylesNames,
} from './Grid.types'
