import { InputBase } from '../InputBase'
import ColorInputComponent from './ColorInput.vue'
import classes from './ColorInput.module.css'

export const ColorInput = Object.assign(ColorInputComponent, {
  classes: { ...InputBase.classes, ...classes },
})

export type { ColorInputProps, ColorInputSlots, ColorInputStylesNames } from './ColorInput.types'
