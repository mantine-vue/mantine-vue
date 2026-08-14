import { factory } from '../../core'
import DividerComponent, { varsResolver } from './Divider.vue'
import type { DividerFactory } from './Divider.types'
import classes from './Divider.module.css'

export const Divider = factory<DividerFactory>(DividerComponent, { classes, varsResolver })

export type {
  DividerOwnProps,
  DividerProps,
  DividerSlots,
  DividerVariant,
  DividerFactory,
} from './Divider.types'
