import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import MultiSelectComponent from './MultiSelect.vue'

export const MultiSelect = Object.assign(MultiSelectComponent, {
  classes: { ...InputBase.classes, ...Combobox.classes },
})

export type {
  MultiSelectOptionRenderPayload,
  MultiSelectPillRenderPayload,
  MultiSelectProps,
  MultiSelectSlots,
  MultiSelectStylesNames,
} from './MultiSelect.types'
