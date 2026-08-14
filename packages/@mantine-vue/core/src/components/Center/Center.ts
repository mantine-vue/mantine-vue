import { polymorphicFactory } from '../../core'
import CenterComponent from './Center.vue'
import type { CenterFactory } from './Center.types'
import classes from './Center.module.css'

export const Center = polymorphicFactory<CenterFactory>(CenterComponent, {
  classes,
})

export type {
  CenterFactory,
  CenterOwnProps,
  CenterProps,
  CenterSlots,
  CenterStylesNames,
} from './Center.types'
