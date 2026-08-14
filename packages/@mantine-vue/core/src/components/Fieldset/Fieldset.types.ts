import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineRadius, StylesApiProps, Factory } from '../../core'

export type FieldsetStylesNames = 'root' | 'legend'
export type FieldsetVariant = 'default' | 'filled' | 'unstyled'

/** Props declared by `Fieldset` itself. See `FieldsetProps` for the full public type. */
export interface FieldsetOwnProps extends StylesApiProps<FieldsetFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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

export type FieldsetCssVariables = {
  root: '--fieldset-radius'
}

export type FieldsetFactory = Factory<{
  props: Omit<FieldsetProps, 'rootRef'>
  ref: HTMLFieldSetElement
  slots: FieldsetSlots
  element: 'fieldset'
  stylesNames: FieldsetStylesNames
  vars: FieldsetCssVariables
  variant: FieldsetVariant
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
