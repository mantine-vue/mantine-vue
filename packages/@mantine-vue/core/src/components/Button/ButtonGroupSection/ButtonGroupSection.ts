import { withBoxProps } from '../../../core'
import ButtonGroupSectionComponent, { varsResolver } from './ButtonGroupSection.vue'
import classes from '../Button.module.css'

export const ButtonGroupSection = withBoxProps(ButtonGroupSectionComponent)
Object.assign(ButtonGroupSection, { classes, varsResolver })

export type {
  ButtonGroupSectionCssVariables,
  ButtonGroupSectionOwnProps,
  ButtonGroupSectionProps,
  ButtonGroupSectionSlots,
  ButtonGroupSectionStylesNames,
} from './ButtonGroupSection.types'
