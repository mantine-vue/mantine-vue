import { factory } from '../../../core'
import ButtonGroupSectionComponent, { varsResolver } from './ButtonGroupSection.vue'
import type { ButtonGroupSectionFactory } from './ButtonGroupSection.types'
import classes from '../Button.module.css'

export const ButtonGroupSection = factory<ButtonGroupSectionFactory>(ButtonGroupSectionComponent, {
  classes,
  varsResolver,
})

export type {
  ButtonGroupSectionCssVariables,
  ButtonGroupSectionOwnProps,
  ButtonGroupSectionProps,
  ButtonGroupSectionSlots,
  ButtonGroupSectionStylesNames,
  ButtonGroupSectionFactory,
} from './ButtonGroupSection.types'
