import { factory } from '../../../core'
import ActionIconGroupComponent, { varsResolver } from './ActionIconGroup.vue'
import type { ActionIconGroupFactory } from './ActionIconGroup.types'
import classes from '../ActionIcon.module.css'

export const ActionIconGroup = factory<ActionIconGroupFactory>(ActionIconGroupComponent, {
  classes,
  varsResolver,
})

export type {
  ActionIconGroupOwnProps,
  ActionIconGroupProps,
  ActionIconGroupSlots,
  ActionIconGroupFactory,
} from './ActionIconGroup.types'
