import { factory } from '../../../core'
import GridColComponent from './GridCol.vue'
import classes from '../Grid.module.css'
import type { GridColFactory } from './GridCol.types'

export const GridCol = factory<GridColFactory>(GridColComponent, { classes })

export type { GridColOwnProps, GridColProps, GridColSlots, GridColFactory } from './GridCol.types'
