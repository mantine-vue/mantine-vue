import { Combobox } from '../Combobox'
import PhoneInputComponent, { mergedClasses } from './PhoneInput.vue'

export const PhoneInput = Object.assign(PhoneInputComponent, {
  classes: { ...Combobox.classes, ...mergedClasses },
})

export type {
  PhoneInputChangeDetails,
  PhoneInputEmits,
  PhoneInputOwnProps,
  PhoneInputProps,
  PhoneInputSlots,
  PhoneInputStylesNames,
} from './PhoneInput.types'
export type { PhoneInputCountryData } from './phone-data'
