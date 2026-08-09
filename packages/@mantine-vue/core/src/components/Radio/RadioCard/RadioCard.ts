import { withBoxProps } from '../../../core'
import RadioCardComponent, { varsResolver } from './RadioCard.vue'
import classes from './RadioCard.module.css'

export const RadioCard = withBoxProps(Object.assign(RadioCardComponent, { classes, varsResolver }))

export { RadioCardContextKey, useRadioCardContext } from './RadioCard.context'
export type {
  RadioCardContextValue,
  RadioCardCssVariables,
  RadioCardOwnProps,
  RadioCardProps,
  RadioCardSlots,
  RadioCardStylesNames,
} from './RadioCard.types'
