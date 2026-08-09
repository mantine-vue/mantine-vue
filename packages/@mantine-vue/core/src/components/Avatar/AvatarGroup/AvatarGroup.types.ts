import type { VNodeChild } from 'vue'
import type { BoxProps, MantineSpacing, StylesApiProps } from '../../../core'

export interface AvatarGroupContextValue {
  withinGroup: boolean
}

/** Props declared by `AvatarGroup` itself. See `AvatarGroupProps` for the full public type. */
export interface AvatarGroupOwnProps extends StylesApiProps<AvatarGroupProps> {
  /**
   * Negative space between Avatar components
   *
   * @default 'sm'
   */
  spacing?: MantineSpacing
}

export interface AvatarGroupProps
  extends Omit<BoxProps, keyof AvatarGroupOwnProps>, AvatarGroupOwnProps {}

export interface AvatarGroupSlots {
  default?: () => VNodeChild
}
export type AvatarGroupStylesNames = 'group'
export type AvatarGroupCssVariables = { group: '--ag-spacing' }
