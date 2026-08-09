import { withBoxProps } from '../../core'
import CodeComponent from './Code.vue'

export const Code = withBoxProps(CodeComponent)

export type {
  CodeCssVariables,
  CodeOwnProps,
  CodeProps,
  CodeSlots,
  CodeStylesNames,
} from './Code.types'
