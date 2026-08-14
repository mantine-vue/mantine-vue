import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import AutocompleteComponent from './Autocomplete.vue'

export const Autocomplete = Object.assign(AutocompleteComponent, {
  classes: { ...InputBase.classes, ...Combobox.classes },
})

export type {
  AutocompleteOptionRenderPayload,
  AutocompleteOwnProps,
  AutocompleteProps,
  AutocompleteSlots,
  AutocompleteStylesNames,
  RenderAutocompleteOption,
} from './Autocomplete.types'
