import { withBoxProps } from '../../core'
import MarkComponent from './Mark.vue'

export const Mark = withBoxProps(MarkComponent)

export type {
  MarkCssVariables,
  MarkOwnProps,
  MarkProps,
  MarkSlots,
  MarkStylesNames,
} from './Mark.types'
