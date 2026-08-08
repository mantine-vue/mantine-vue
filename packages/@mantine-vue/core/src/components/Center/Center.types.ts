import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../core'

export type CenterStylesNames = 'root'

export interface CenterSlots {
  /** Content to center. */
  default?: () => VNodeChild
}

/** Props declared by `Center` itself. See `CenterProps` for the full public type. */
export interface CenterOwnProps extends StylesApiProps<CenterProps> {
  /**
   * Root element or component rendered by `Center`.
   * @default 'div'
   */
  component?: string

  /**
   * If set, `inline-flex` is used instead of `flex`.
   * @default false
   */
  inline?: boolean
}

export interface CenterProps extends Omit<BoxProps, keyof CenterOwnProps>, CenterOwnProps {}
