import { factory } from '../../core'
import AlertComponent, { varsResolver } from './Alert.vue'
import type { AlertFactory } from './Alert.types'
import classes from './Alert.module.css'

export const Alert = factory<AlertFactory>(AlertComponent, {
  classes,
  varsResolver,
})

export type {
  AlertCssVariables,
  AlertOwnProps,
  AlertProps,
  AlertSlots,
  AlertStylesNames,
  AlertVariant,
  AlertFactory,
} from './Alert.types'
