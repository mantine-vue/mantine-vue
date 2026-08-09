import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps } from '../../core'

/** Props declared by `UnstyledButton` itself. See `UnstyledButtonProps` for the full public type. */
export interface UnstyledButtonOwnProps extends StylesApiProps<UnstyledButtonProps> {
  /**
   * Root element or component rendered by `UnstyledButton`.
   *
   * @default 'button'
   */
  component?: string

  /**
   * Static selector used to build the component classes. Internal prop, not part of the public API.
   *
   * @internal
   */
  __staticSelector?: string

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface UnstyledButtonProps
  extends Omit<BoxProps, keyof UnstyledButtonOwnProps>, UnstyledButtonOwnProps {}
export interface UnstyledButtonSlots {
  default?: () => VNodeChild
}
export type UnstyledButtonStylesNames = 'root'
