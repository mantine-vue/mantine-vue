import { withBoxProps } from '../../core'
import ButtonComponent from './Button.vue'
import { ButtonGroup } from './ButtonGroup/ButtonGroup'
import { ButtonGroupSection } from './ButtonGroupSection/ButtonGroupSection'

export const Button = withBoxProps(
  Object.assign(ButtonComponent, {
    Group: ButtonGroup,
    GroupSection: ButtonGroupSection,
  }),
)

export type {
  ButtonCssVariables,
  ButtonOwnProps,
  ButtonProps,
  ButtonSize,
  ButtonSlots,
  ButtonStylesNames,
  ButtonVariant,
} from './Button.types'
