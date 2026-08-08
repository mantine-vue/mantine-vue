import { InputBase } from '../InputBase'
import NativeSelectComponent from './NativeSelect.vue'

export const NativeSelect = Object.assign(NativeSelectComponent, {
  classes: InputBase.classes,
})

export type {
  NativeSelectOwnProps,
  NativeSelectProps,
  NativeSelectSlots,
  NativeSelectStylesNames,
} from './NativeSelect.types'
