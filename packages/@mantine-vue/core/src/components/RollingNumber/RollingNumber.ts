import { withBoxProps } from '../../core'
import RollingNumberComponent, { varsResolver } from './RollingNumber.vue'
import classes from './RollingNumber.module.css'

export const RollingNumber = withBoxProps(
  Object.assign(RollingNumberComponent, { classes, varsResolver }),
)

export type {
  RollingNumberCssVariables,
  RollingNumberOwnProps,
  RollingNumberProps,
  RollingNumberStylesNames,
} from './RollingNumber.types'
