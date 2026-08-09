import { polymorphicFactory } from '../../core'
import ButtonComponent, { varsResolver } from './Button.vue'
import type { ButtonFactory } from './Button.types'
import { ButtonGroup } from './ButtonGroup/ButtonGroup'
import { ButtonGroupSection } from './ButtonGroupSection/ButtonGroupSection'
import classes from './Button.module.css'

export const Button = polymorphicFactory<ButtonFactory>(ButtonComponent, {
  classes,
  varsResolver,
  Group: ButtonGroup,
  GroupSection: ButtonGroupSection,
})

export type {
  ButtonCssVariables,
  ButtonFactory,
  ButtonOwnProps,
  ButtonProps,
  ButtonSize,
  ButtonSlots,
  ButtonStylesNames,
  ButtonVariant,
} from './Button.types'
