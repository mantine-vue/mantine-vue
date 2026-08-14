import { factory } from '../../../core'
import InputPlaceholderComponent from './InputPlaceholder.vue'
import type { InputPlaceholderFactory } from './InputPlaceholder.types'

export const InputPlaceholder = factory<InputPlaceholderFactory>(InputPlaceholderComponent)
export type {
  InputPlaceholderOwnProps,
  InputPlaceholderProps,
  InputPlaceholderSlots,
  InputPlaceholderStylesNames,
  InputPlaceholderFactory,
} from './InputPlaceholder.types'
