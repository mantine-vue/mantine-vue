import type { VNodeChild } from 'vue'
import type { BoxProps, MantineSize, StylesApiProps } from '../../core'

export type KbdStylesNames = 'root'

export type KbdCssVariables = {
  root: '--kbd-fz'
}

export interface KbdSlots {
  /** `Kbd` content. */
  default?: () => VNodeChild
}

/** Props declared by `Kbd` itself. See `KbdProps` for the full public type. */
export interface KbdOwnProps extends StylesApiProps<KbdProps> {
  /**
   * Controls `font-size` and `padding`.
   * @default 'sm'
   */
  size?: MantineSize | number | (string & {})
}

export interface KbdProps extends Omit<BoxProps, keyof KbdOwnProps>, KbdOwnProps {}
