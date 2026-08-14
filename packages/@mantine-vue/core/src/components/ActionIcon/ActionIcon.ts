import { polymorphicFactory } from '../../core'
import { ActionIconGroup } from './ActionIconGroup/ActionIconGroup'
import { ActionIconGroupSection } from './ActionIconGroupSection/ActionIconGroupSection'
import ActionIconComponent, { varsResolver } from './ActionIcon.vue'
import type { ActionIconFactory } from './ActionIcon.types'
import classes from './ActionIcon.module.css'

export const ActionIcon = polymorphicFactory<ActionIconFactory>(ActionIconComponent, {
  classes,
  varsResolver,
  Group: ActionIconGroup,
  GroupSection: ActionIconGroupSection,
})

export type {
  ActionIconCssVariables,
  ActionIconFactory,
  ActionIconOwnProps,
  ActionIconProps,
  ActionIconSlots,
  ActionIconStylesNames,
  ActionIconVariant,
} from './ActionIcon.types'
