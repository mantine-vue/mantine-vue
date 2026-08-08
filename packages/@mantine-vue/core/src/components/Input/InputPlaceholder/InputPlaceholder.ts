import { withBoxProps } from '../../../core'
import InputPlaceholderComponent from './InputPlaceholder.vue'

export const InputPlaceholder = withBoxProps(InputPlaceholderComponent)
export type {
  InputPlaceholderOwnProps,
  InputPlaceholderProps,
  InputPlaceholderSlots,
  InputPlaceholderStylesNames,
} from './InputPlaceholder.types'
