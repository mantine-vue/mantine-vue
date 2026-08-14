import { factory } from '../../../core'
import type { InputClearButtonFactory } from './InputClearButton.types'
import InputClearButtonComponent from './InputClearButton.vue'

export const InputClearButton = factory<InputClearButtonFactory>(InputClearButtonComponent)
export type {
  InputClearButtonFactory,
  InputClearButtonOwnProps,
  InputClearButtonProps,
  InputClearButtonSlots,
} from './InputClearButton.types'
