import { withBoxProps } from '../../core'
import { ActionIconGroup } from './ActionIconGroup/ActionIconGroup'
import { ActionIconGroupSection } from './ActionIconGroupSection/ActionIconGroupSection'
import ActionIconComponent, { varsResolver } from './ActionIcon.vue'
import classes from './ActionIcon.module.css'

export const ActionIcon = withBoxProps(
  Object.assign(ActionIconComponent, {
    classes,
    varsResolver,
    Group: ActionIconGroup,
    GroupSection: ActionIconGroupSection,
  }),
)
export type {
  ActionIconCssVariables,
  ActionIconOwnProps,
  ActionIconProps,
  ActionIconSlots,
  ActionIconStylesNames,
  ActionIconVariant,
} from './ActionIcon.types'
