import { factory } from '../../core'
import { GridCol } from './GridCol/GridCol'
import GridComponent, { varsResolver } from './Grid.vue'
import type { GridFactory } from './Grid.types'
import classes from './Grid.module.css'

export const Grid = factory<GridFactory>(GridComponent, {
  classes,
  varsResolver,
  Col: GridCol,
})

export type {
  GridCssVariables,
  GridOwnProps,
  GridProps,
  GridSlots,
  GridStylesNames,
  GridFactory,
} from './Grid.types'
