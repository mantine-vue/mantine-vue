import { InputBase } from '../InputBase'
import FileInputComponent from './FileInput.vue'

export const FileInput = Object.assign(FileInputComponent, { classes: InputBase.classes })

export type { FileInputProps, FileInputSlots, FileInputStylesNames } from './FileInput.types'
