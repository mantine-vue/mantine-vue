import { factory } from '../../../core'
import CheckboxCardComponent, { varsResolver } from './CheckboxCard.vue'
import type { CheckboxCardFactory } from './CheckboxCard.types'
import classes from './CheckboxCard.module.css'

export const CheckboxCard = factory<CheckboxCardFactory>(CheckboxCardComponent, {
  classes,
  varsResolver,
})

export { CheckboxCardContextKey, useCheckboxCardContext } from './CheckboxCard.context'
export type {
  CheckboxCardContextValue,
  CheckboxCardCssVariables,
  CheckboxCardOwnProps,
  CheckboxCardProps,
  CheckboxCardSlots,
  CheckboxCardStylesNames,
  CheckboxCardFactory,
} from './CheckboxCard.types'
