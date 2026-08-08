import { withBoxProps } from '../../../core'
import { useAvatarGroupContext } from './AvatarGroup.context'
import AvatarGroupComponent, { varsResolver } from './AvatarGroup.vue'
import classes from '../Avatar.module.css'
export const AvatarGroup = withBoxProps(AvatarGroupComponent)
Object.assign(AvatarGroup, { classes, varsResolver })
export { useAvatarGroupContext }
export type {
  AvatarGroupContextValue,
  AvatarGroupCssVariables,
  AvatarGroupOwnProps,
  AvatarGroupProps,
  AvatarGroupSlots,
  AvatarGroupStylesNames,
} from './AvatarGroup.types'
