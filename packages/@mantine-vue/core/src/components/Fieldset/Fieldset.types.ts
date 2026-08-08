import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineRadius, StylesApiProps } from '../../core'

export type FieldsetStylesNames = 'root' | 'legend'
export type FieldsetVariant = 'default' | 'filled' | 'unstyled'

/** Props declared by `Fieldset` itself. See `FieldsetProps` for the full public type. */
export interface FieldsetOwnProps extends StylesApiProps<FieldsetProps> {
  /** Fieldset legend */
  legend?: MantineNode

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'default'
   */
  variant?: FieldsetVariant
}

export interface FieldsetSlots {
  /** Component content. */
  default?: () => VNodeChild
  /** Fieldset legend. Used when the `legend` prop is not set. */
  legend?: () => VNodeChild
}

export interface FieldsetProps extends Omit<BoxProps, keyof FieldsetOwnProps>, FieldsetOwnProps {}
