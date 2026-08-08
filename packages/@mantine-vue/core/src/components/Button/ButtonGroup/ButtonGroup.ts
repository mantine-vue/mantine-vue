import { withBoxProps } from '../../../core'
import ButtonGroupComponent, { varsResolver } from './ButtonGroup.vue'
import classes from '../Button.module.css'

export const ButtonGroup = withBoxProps(ButtonGroupComponent)
Object.assign(ButtonGroup, { classes, varsResolver })

export type { ButtonGroupOwnProps, ButtonGroupProps, ButtonGroupSlots } from './ButtonGroup.types'
