import { withBoxProps } from '../../core'
import AlertComponent from './Alert.vue'

export const Alert = withBoxProps(AlertComponent)

export type {
  AlertCssVariables,
  AlertOwnProps,
  AlertProps,
  AlertSlots,
  AlertStylesNames,
  AlertVariant,
} from './Alert.types'
