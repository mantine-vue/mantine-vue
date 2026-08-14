import { factory } from '../../../core'
import { useAvatarGroupContext } from './AvatarGroup.context'
import AvatarGroupComponent, { varsResolver } from './AvatarGroup.vue'
import type { AvatarGroupFactory } from './AvatarGroup.types'
import classes from '../Avatar.module.css'
export const AvatarGroup = factory<AvatarGroupFactory>(AvatarGroupComponent, {
  classes,
  varsResolver,
})
export { useAvatarGroupContext }
export type {
  AvatarGroupContextValue,
  AvatarGroupCssVariables,
  AvatarGroupOwnProps,
  AvatarGroupProps,
  AvatarGroupSlots,
  AvatarGroupStylesNames,
  AvatarGroupFactory,
} from './AvatarGroup.types'
