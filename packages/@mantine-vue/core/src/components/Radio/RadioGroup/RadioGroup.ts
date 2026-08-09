import { InputWrapper } from '../../Input'
import RadioGroupComponent from './RadioGroup.vue'

export const RadioGroup = Object.assign(RadioGroupComponent, {
  classes: InputWrapper.classes,
})

export { RadioGroupContextKey, useRadioGroupContext } from './RadioGroup.context'
export type {
  RadioGroupContextValue,
  RadioGroupOwnProps,
  RadioGroupProps,
  RadioGroupSlots,
} from './RadioGroup.types'
