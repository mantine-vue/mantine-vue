import { factory } from '../../core'
import { InputBase } from '../InputBase'
import type { NativeSelectFactory } from './NativeSelect.types'
import NativeSelectComponent from './NativeSelect.vue'

export const NativeSelect = factory<NativeSelectFactory>(NativeSelectComponent, {
  classes: InputBase.classes,
})

export type {
  NativeSelectEmits,
  NativeSelectFactory,
  NativeSelectOwnProps,
  NativeSelectProps,
  NativeSelectSlots,
  NativeSelectStylesNames,
} from './NativeSelect.types'
