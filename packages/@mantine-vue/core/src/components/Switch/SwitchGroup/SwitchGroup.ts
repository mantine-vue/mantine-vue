import { InputWrapper } from '../../Input'
import SwitchGroupComponent from './SwitchGroup.vue'

export const SwitchGroup = Object.assign(SwitchGroupComponent, {
  classes: InputWrapper.classes,
})

export { SwitchGroupContextKey, useSwitchGroupContext } from './SwitchGroup.context'
export type {
  SwitchGroupContextValue,
  SwitchGroupOwnProps,
  SwitchGroupProps,
  SwitchGroupSlots,
} from './SwitchGroup.types'
