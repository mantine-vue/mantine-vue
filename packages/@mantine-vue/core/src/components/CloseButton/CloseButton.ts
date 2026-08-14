import { polymorphicFactory } from '../../core'
import CloseButtonComponent, { varsResolver } from './CloseButton.vue'
import type { CloseButtonFactory } from './CloseButton.types'
import classes from './CloseButton.module.css'

export const CloseButton = polymorphicFactory<CloseButtonFactory>(CloseButtonComponent, {
  classes,
  varsResolver,
})

export type {
  CloseButtonCssVariables,
  CloseButtonFactory,
  CloseButtonOwnProps,
  CloseButtonProps,
  CloseButtonSlots,
  CloseButtonStylesNames,
  CloseButtonVariant,
} from './CloseButton.types'
