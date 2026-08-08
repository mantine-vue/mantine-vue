import { withBoxProps } from '../../../core'
import CheckboxCardComponent, { varsResolver } from './CheckboxCard.vue'
import classes from './CheckboxCard.module.css'

export const CheckboxCard = withBoxProps(
  Object.assign(CheckboxCardComponent, { classes, varsResolver }),
)

export { CheckboxCardContextKey, useCheckboxCardContext } from './CheckboxCard.context'
export type {
  CheckboxCardContextValue,
  CheckboxCardCssVariables,
  CheckboxCardOwnProps,
  CheckboxCardProps,
  CheckboxCardSlots,
  CheckboxCardStylesNames,
} from './CheckboxCard.types'
