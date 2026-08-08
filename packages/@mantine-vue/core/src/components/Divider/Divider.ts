import { withBoxProps } from '../../core'
import DividerComponent, { varsResolver } from './Divider.vue'
import classes from './Divider.module.css'

export const Divider = withBoxProps(DividerComponent)
Object.assign(Divider, { classes, varsResolver })

export type { DividerOwnProps, DividerProps, DividerSlots, DividerVariant } from './Divider.types'
