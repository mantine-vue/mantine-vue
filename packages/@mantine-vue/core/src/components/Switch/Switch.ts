import { withBoxProps } from '../../core'
import { SwitchGroup } from './SwitchGroup/SwitchGroup'
import SwitchComponent, { mergedClasses, varsResolver } from './Switch.vue'

export const Switch = withBoxProps(
  Object.assign(SwitchComponent, {
    classes: mergedClasses,
    varsResolver,
    Group: SwitchGroup,
  }),
)

export type {
  SwitchCssVariables,
  SwitchOwnProps,
  SwitchProps,
  SwitchSlots,
  SwitchStylesNames,
} from './Switch.types'
