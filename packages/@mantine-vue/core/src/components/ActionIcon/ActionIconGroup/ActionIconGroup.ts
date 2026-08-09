import { withBoxProps } from '../../../core'
import ActionIconGroupComponent, { varsResolver } from './ActionIconGroup.vue'
import classes from '../ActionIcon.module.css'

export const ActionIconGroup = withBoxProps(ActionIconGroupComponent)
Object.assign(ActionIconGroup, { classes, varsResolver })

export type {
  ActionIconGroupOwnProps,
  ActionIconGroupProps,
  ActionIconGroupSlots,
} from './ActionIconGroup.types'
