import { withBoxProps } from '../../core'
import { AvatarGroup } from './AvatarGroup/AvatarGroup'
import AvatarComponent, { varsResolver } from './Avatar.vue'
import classes from './Avatar.module.css'
export const Avatar = withBoxProps(
  Object.assign(AvatarComponent, { classes, varsResolver, Group: AvatarGroup }),
)
export type {
  AvatarCssVariables,
  AvatarOwnProps,
  AvatarProps,
  AvatarSlots,
  AvatarStylesNames,
  AvatarVariant,
} from './Avatar.types'
