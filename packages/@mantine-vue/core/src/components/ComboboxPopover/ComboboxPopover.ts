import { Combobox } from '../Combobox'
import ComboboxPopoverComponent from './ComboboxPopover.vue'
import { ComboboxPopoverTarget } from './ComboboxPopoverTarget'

export const ComboboxPopoverBase = ComboboxPopoverComponent

export const ComboboxPopover = Object.assign(ComboboxPopoverComponent, {
  classes: Combobox.classes,
  Target: ComboboxPopoverTarget,
})

export type {
  ComboboxPopoverProps,
  ComboboxPopoverSlots,
  ComboboxPopoverStylesNames,
} from './ComboboxPopover.types'
