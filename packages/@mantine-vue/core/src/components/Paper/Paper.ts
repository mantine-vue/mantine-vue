import { withBoxProps } from '../../core'
import PaperComponent from './Paper.vue'

export const Paper = withBoxProps(PaperComponent)

export type {
  PaperCssVariables,
  PaperOwnProps,
  PaperProps,
  PaperSlots,
  PaperStylesNames,
} from './Paper.types'
