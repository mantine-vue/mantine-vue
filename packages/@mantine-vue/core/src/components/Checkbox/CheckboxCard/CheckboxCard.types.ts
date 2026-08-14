import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineRadius, StylesApiProps, Factory } from '../../../core'

export type CheckboxCardStylesNames = 'card'

export type CheckboxCardCssVariables = {
  card: '--card-radius'
}

export interface CheckboxCardContextValue {
  /** Checked state of the enclosing card, read by `Checkbox.Indicator`. */
  checked: boolean
}

export interface CheckboxCardSlots {
  /** Card content, usually a `Checkbox.Indicator` and a label. */
  default?: () => VNodeChild
}

/** Props declared by `CheckboxCard` itself. See `CheckboxCardProps` for the full public type. */
export interface CheckboxCardOwnProps extends StylesApiProps<CheckboxCardFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Checked state, bound with `v-model`. */
  modelValue?: boolean

  /** Checked state, bound with `v-model:checked`. */
  checked?: boolean

  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean

  /**
   * If set, the card has a border.
   *
   * @default true
   */
  withBorder?: boolean

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** Value used to associate the card with the enclosing `Checkbox.Group`. */
  value?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface CheckboxCardProps
  extends Omit<BoxProps, keyof CheckboxCardOwnProps>, CheckboxCardOwnProps {}

export type CheckboxCardFactory = Factory<{
  props: Omit<CheckboxCardProps, 'rootRef'>
  ref: HTMLButtonElement
  slots: CheckboxCardSlots
  element: 'button'
  stylesNames: CheckboxCardStylesNames
  vars: CheckboxCardCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
