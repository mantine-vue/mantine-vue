import { factory } from '../../core'
import { CheckboxCard } from './CheckboxCard/CheckboxCard'
import { CheckboxGroup } from './CheckboxGroup/CheckboxGroup'
import { CheckboxIndicator } from './CheckboxIndicator/CheckboxIndicator'
import type { CheckboxFactory } from './Checkbox.types'
import CheckboxComponent, { mergedClasses, varsResolver } from './Checkbox.vue'

export const Checkbox = factory<CheckboxFactory>(CheckboxComponent, {
  classes: mergedClasses,
  varsResolver,
  Group: CheckboxGroup,
  Indicator: CheckboxIndicator,
  Card: CheckboxCard,
})

export type {
  CheckboxCssVariables,
  CheckboxEmits,
  CheckboxFactory,
  CheckboxIconSlotProps,
  CheckboxOwnProps,
  CheckboxProps,
  CheckboxSlots,
  CheckboxStylesNames,
  CheckboxVariant,
} from './Checkbox.types'
