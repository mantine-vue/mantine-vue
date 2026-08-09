import { withBoxProps } from '../../../core'
import InputDescriptionComponent, { varsResolver } from './InputDescription.vue'
import classes from '../Input.module.css'

export const InputDescription = withBoxProps(
  Object.assign(InputDescriptionComponent, { classes, varsResolver }),
)

export type {
  InputDescriptionCssVariables,
  InputDescriptionOwnProps,
  InputDescriptionProps,
  InputDescriptionSlots,
  InputDescriptionStylesNames,
} from './InputDescription.types'
