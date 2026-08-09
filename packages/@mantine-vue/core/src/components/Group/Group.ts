import { withBoxProps } from '../../core'
import GroupComponent, { varsResolver } from './Group.vue'
import classes from './Group.module.css'

export const Group = withBoxProps(GroupComponent)
Object.assign(Group, { classes, varsResolver })
export type { GroupOwnProps, GroupProps, GroupSlots } from './Group.types'
