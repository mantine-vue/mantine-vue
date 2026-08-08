import UnstyledButtonComponent from './UnstyledButton.vue'
import classes from './UnstyledButton.module.css'
export const UnstyledButton = Object.assign(UnstyledButtonComponent, { classes })
export type {
  UnstyledButtonOwnProps,
  UnstyledButtonProps,
  UnstyledButtonSlots,
  UnstyledButtonStylesNames,
} from './UnstyledButton.types'
