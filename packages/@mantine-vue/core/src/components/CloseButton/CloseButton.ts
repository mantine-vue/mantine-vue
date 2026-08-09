import { withBoxProps } from '../../core'
import CloseButtonComponent, { varsResolver } from './CloseButton.vue'
import classes from './CloseButton.module.css'

export const CloseButton = withBoxProps(CloseButtonComponent)
Object.assign(CloseButton, { classes, varsResolver })

export type {
  CloseButtonOwnProps,
  CloseButtonProps,
  CloseButtonSlots,
  CloseButtonVariant,
} from './CloseButton.types'
