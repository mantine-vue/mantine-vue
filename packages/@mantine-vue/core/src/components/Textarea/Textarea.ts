import { InputBase } from '../InputBase'
import TextareaComponent from './Textarea.vue'

export const Textarea = Object.assign(TextareaComponent, { classes: InputBase.classes })

export type {
  TextareaOwnProps,
  TextareaProps,
  TextareaSlots,
  TextareaStylesNames,
} from './Textarea.types'
