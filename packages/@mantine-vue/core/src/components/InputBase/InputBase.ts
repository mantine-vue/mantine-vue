import { polymorphicFactory } from '../../core'
import { Input } from '../Input'
import InputBaseComponent from './InputBase.vue'
import type { InputBaseFactory } from './InputBase.types'

// `InputBase` renders through `Input`, so it shares that component's stylesheet rather than
// owning one of its own.
export const InputBase = polymorphicFactory<InputBaseFactory>(InputBaseComponent, {
  classes: Input.classes,
})

export type {
  InputBaseFactory,
  InputBaseOwnProps,
  InputBaseProps,
  InputBaseSlots,
  InputBaseStylesNames,
  InputBaseVariant,
} from './InputBase.types'
