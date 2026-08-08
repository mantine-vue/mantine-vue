import { withBoxProps } from '../../core'
import { CheckboxCard } from './CheckboxCard/CheckboxCard'
import { CheckboxGroup } from './CheckboxGroup/CheckboxGroup'
import { CheckboxIndicator } from './CheckboxIndicator/CheckboxIndicator'
import CheckboxComponent, { mergedClasses, varsResolver } from './Checkbox.vue'

export const Checkbox = withBoxProps(
  Object.assign(CheckboxComponent, {
    classes: mergedClasses,
    varsResolver,
    Group: CheckboxGroup,
    Indicator: CheckboxIndicator,
    Card: CheckboxCard,
  }),
)

export type {
  CheckboxCssVariables,
  CheckboxIconSlotProps,
  CheckboxOwnProps,
  CheckboxProps,
  CheckboxSlots,
  CheckboxStylesNames,
  CheckboxVariant,
} from './Checkbox.types'
