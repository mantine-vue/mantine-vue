import { polymorphicFactory } from '../../core'
import { AvatarGroup } from './AvatarGroup/AvatarGroup'
import AvatarComponent, { varsResolver } from './Avatar.vue'
import type { AvatarFactory } from './Avatar.types'
import classes from './Avatar.module.css'

export const Avatar = polymorphicFactory<AvatarFactory>(AvatarComponent, {
  classes,
  varsResolver,
  Group: AvatarGroup,
})

export type {
  AvatarCssVariables,
  AvatarFactory,
  AvatarOwnProps,
  AvatarProps,
  AvatarSlots,
  AvatarStylesNames,
  AvatarVariant,
} from './Avatar.types'
