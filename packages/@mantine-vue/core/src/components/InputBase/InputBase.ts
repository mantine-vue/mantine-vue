import { withBoxProps } from '../../core'
import { Input } from '../Input'
import InputBaseComponent from './InputBase.vue'

export const InputBase = withBoxProps(Object.assign(InputBaseComponent, { classes: Input.classes }))

export type {
  InputBaseOwnProps,
  InputBaseProps,
  InputBaseSlots,
  InputBaseStylesNames,
  InputBaseVariant,
} from './InputBase.types'
