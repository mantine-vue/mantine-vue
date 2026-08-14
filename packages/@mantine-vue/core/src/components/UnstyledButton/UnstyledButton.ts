import { polymorphicFactory } from '../../core'
import UnstyledButtonComponent from './UnstyledButton.vue'
import type { UnstyledButtonFactory } from './UnstyledButton.types'
import classes from './UnstyledButton.module.css'

export const UnstyledButton = polymorphicFactory<UnstyledButtonFactory>(UnstyledButtonComponent, {
  classes,
})

export type {
  UnstyledButtonFactory,
  UnstyledButtonOwnProps,
  UnstyledButtonProps,
  UnstyledButtonSlots,
  UnstyledButtonStylesNames,
} from './UnstyledButton.types'
