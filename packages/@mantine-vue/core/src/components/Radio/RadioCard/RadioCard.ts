import { factory } from '../../../core'
import RadioCardComponent, { varsResolver } from './RadioCard.vue'
import type { RadioCardFactory } from './RadioCard.types'
import classes from './RadioCard.module.css'

export const RadioCard = factory<RadioCardFactory>(RadioCardComponent, {
  classes,
  varsResolver,
})

export { RadioCardContextKey, useRadioCardContext } from './RadioCard.context'
export type {
  RadioCardContextValue,
  RadioCardCssVariables,
  RadioCardOwnProps,
  RadioCardProps,
  RadioCardSlots,
  RadioCardStylesNames,
  RadioCardFactory,
} from './RadioCard.types'
