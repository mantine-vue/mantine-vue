import { factory } from '../../core'
import RollingNumberComponent, { varsResolver } from './RollingNumber.vue'
import type { RollingNumberFactory } from './RollingNumber.types'
import classes from './RollingNumber.module.css'

export const RollingNumber = factory<RollingNumberFactory>(RollingNumberComponent, {
  classes,
  varsResolver,
})

export type {
  RollingNumberCssVariables,
  RollingNumberFactory,
  RollingNumberOwnProps,
  RollingNumberProps,
  RollingNumberStylesNames,
} from './RollingNumber.types'
