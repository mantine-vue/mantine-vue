import { polymorphicFactory } from '../../core'
import PaperComponent, { varsResolver } from './Paper.vue'
import type { PaperFactory } from './Paper.types'
import classes from './Paper.module.css'

export const Paper = polymorphicFactory<PaperFactory>(PaperComponent, {
  classes,
  varsResolver,
})

export type {
  PaperCssVariables,
  PaperFactory,
  PaperOwnProps,
  PaperProps,
  PaperSlots,
  PaperStylesNames,
} from './Paper.types'
