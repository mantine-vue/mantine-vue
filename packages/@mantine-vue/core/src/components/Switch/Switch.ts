import { factory } from '../../core'
import { SwitchGroup } from './SwitchGroup/SwitchGroup'
import type { SwitchFactory } from './Switch.types'
import SwitchComponent, { mergedClasses, varsResolver } from './Switch.vue'

export const Switch = factory<SwitchFactory>(SwitchComponent, {
  classes: mergedClasses,
  varsResolver,
  Group: SwitchGroup,
})

export type {
  SwitchCssVariables,
  SwitchEmits,
  SwitchFactory,
  SwitchOwnProps,
  SwitchProps,
  SwitchSlots,
  SwitchStylesNames,
} from './Switch.types'
