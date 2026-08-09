import { withBoxProps } from '../../core'
import { RadioCard } from './RadioCard/RadioCard'
import { RadioGroup } from './RadioGroup/RadioGroup'
import { RadioIndicator } from './RadioIndicator/RadioIndicator'
import RadioComponent, { mergedClasses, varsResolver } from './Radio.vue'

export const Radio = withBoxProps(
  Object.assign(RadioComponent, {
    classes: mergedClasses,
    varsResolver,
    Group: RadioGroup,
    Indicator: RadioIndicator,
    Card: RadioCard,
  }),
)

export type {
  RadioCssVariables,
  RadioIconSlotProps,
  RadioOwnProps,
  RadioProps,
  RadioSlots,
  RadioStylesNames,
  RadioVariant,
} from './Radio.types'
