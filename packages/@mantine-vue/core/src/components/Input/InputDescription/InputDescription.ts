import { factory } from '../../../core'
import InputDescriptionComponent, { varsResolver } from './InputDescription.vue'
import type { InputDescriptionFactory } from './InputDescription.types'
import classes from '../Input.module.css'

export const InputDescription = factory<InputDescriptionFactory>(InputDescriptionComponent, {
  classes,
  varsResolver,
})

export type {
  InputDescriptionCssVariables,
  InputDescriptionOwnProps,
  InputDescriptionProps,
  InputDescriptionSlots,
  InputDescriptionStylesNames,
  InputDescriptionFactory,
} from './InputDescription.types'
