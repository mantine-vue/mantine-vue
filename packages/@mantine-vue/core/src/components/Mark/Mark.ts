import { factory } from '../../core'
import MarkComponent, { varsResolver } from './Mark.vue'
import type { MarkFactory } from './Mark.types'
import classes from './Mark.module.css'

export const Mark = factory<MarkFactory>(MarkComponent, {
  classes,
  varsResolver,
})

export type {
  MarkCssVariables,
  MarkOwnProps,
  MarkProps,
  MarkSlots,
  MarkStylesNames,
  MarkFactory,
} from './Mark.types'
