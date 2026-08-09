import { InputBase } from '../InputBase'
import MaskInputComponent from './MaskInput.vue'

export const MaskInput = Object.assign(MaskInputComponent, { classes: InputBase.classes })

export type { MaskInputProps, MaskInputSlots, MaskInputStylesNames } from './MaskInput.types'
