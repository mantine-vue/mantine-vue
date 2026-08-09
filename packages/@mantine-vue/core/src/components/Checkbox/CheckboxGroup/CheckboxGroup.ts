import { InputWrapper } from '../../Input'
import CheckboxGroupComponent from './CheckboxGroup.vue'

export const CheckboxGroup = Object.assign(CheckboxGroupComponent, {
  classes: InputWrapper.classes,
})

export { CheckboxGroupContextKey, useCheckboxGroupContext } from './CheckboxGroup.context'
export type {
  CheckboxGroupContextValue,
  CheckboxGroupOwnProps,
  CheckboxGroupProps,
  CheckboxGroupSlots,
} from './CheckboxGroup.types'
