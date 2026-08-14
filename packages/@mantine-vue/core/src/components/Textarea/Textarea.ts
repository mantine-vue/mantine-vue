import { factory } from '../../core'
import { InputBase } from '../InputBase'
import type { TextareaFactory } from './Textarea.types'
import TextareaComponent from './Textarea.vue'

export const Textarea = factory<TextareaFactory>(TextareaComponent, { classes: InputBase.classes })

export type {
  TextareaEmits,
  TextareaFactory,
  TextareaOwnProps,
  TextareaProps,
  TextareaSlots,
  TextareaStylesNames,
} from './Textarea.types'
