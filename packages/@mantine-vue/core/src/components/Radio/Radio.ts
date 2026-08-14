import { factory } from '../../core'
import { RadioCard } from './RadioCard/RadioCard'
import { RadioGroup } from './RadioGroup/RadioGroup'
import { RadioIndicator } from './RadioIndicator/RadioIndicator'
import type { RadioFactory } from './Radio.types'
import RadioComponent, { mergedClasses, varsResolver } from './Radio.vue'

export const Radio = factory<RadioFactory>(RadioComponent, {
  classes: mergedClasses,
  varsResolver,
  Group: RadioGroup,
  Indicator: RadioIndicator,
  Card: RadioCard,
})

export type {
  RadioCssVariables,
  RadioEmits,
  RadioFactory,
  RadioIconSlotProps,
  RadioOwnProps,
  RadioProps,
  RadioSlots,
  RadioStylesNames,
  RadioVariant,
} from './Radio.types'
