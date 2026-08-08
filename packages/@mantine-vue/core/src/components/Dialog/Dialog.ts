import DialogComponent, { varsResolver } from './Dialog.vue'
import classes from './Dialog.module.css'

export const Dialog = Object.assign(DialogComponent, { classes, varsResolver })

export type {
  DialogCssVariables,
  DialogOwnProps,
  DialogProps,
  DialogSlots,
  DialogStylesNames,
} from './Dialog.types'
