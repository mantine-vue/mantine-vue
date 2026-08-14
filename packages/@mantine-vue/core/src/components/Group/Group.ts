import { factory } from '../../core'
import GroupComponent, { varsResolver } from './Group.vue'
import type { GroupFactory } from './Group.types'
import classes from './Group.module.css'

export const Group = factory<GroupFactory>(GroupComponent, { classes, varsResolver })

export type {
  GroupCssVariables,
  GroupFactory,
  GroupOwnProps,
  GroupProps,
  GroupSlots,
  GroupStylesNames,
} from './Group.types'
