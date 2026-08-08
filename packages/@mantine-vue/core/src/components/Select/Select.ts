import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import SelectComponent from './Select.vue'

export const Select = Object.assign(SelectComponent, {
  classes: { ...InputBase.classes, ...Combobox.classes },
})

export type {
  SelectEmits,
  SelectOptionRenderPayload,
  SelectProps,
  SelectSlots,
  SelectStylesNames,
} from './Select.types'
