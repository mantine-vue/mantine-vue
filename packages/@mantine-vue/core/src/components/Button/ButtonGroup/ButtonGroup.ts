import { factory } from '../../../core'
import ButtonGroupComponent, { varsResolver } from './ButtonGroup.vue'
import type { ButtonGroupFactory } from './ButtonGroup.types'
import classes from '../Button.module.css'

export const ButtonGroup = factory<ButtonGroupFactory>(ButtonGroupComponent, {
  classes,
  varsResolver,
})

export type {
  ButtonGroupOwnProps,
  ButtonGroupProps,
  ButtonGroupSlots,
  ButtonGroupFactory,
} from './ButtonGroup.types'
