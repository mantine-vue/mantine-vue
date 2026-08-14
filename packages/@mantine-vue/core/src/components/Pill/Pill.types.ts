import type { PillGroup } from './PillGroup/PillGroup'
import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineRadius,
  MantineSize,
  StylesApiProps,
  Factory,
} from '../../core'

export type PillStylesNames = 'root' | 'label' | 'remove'
export type PillVariant = 'default' | 'contrast'

/** Props declared by `Pill` itself. See `PillProps` for the full public type. */
export interface PillOwnProps extends StylesApiProps<PillFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Controls pill `font-size` and `padding`
   *
   * @default 'sm'
   */
  size?: MantineSize

  /**
   * Controls visibility of the remove button
   *
   * @default false
   */
  withRemoveButton?: boolean

  /** Props passed down to the remove button */
  removeButtonProps?: Record<string, any>

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius. Numbers are converted to rem.
   *
   * @default 'xl'
   */
  radius?: MantineRadius

  /**
   * Adds disabled attribute, applies disabled styles
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'default'
   */
  variant?: PillVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface PillProps extends Omit<BoxProps, keyof PillOwnProps>, PillOwnProps {}

export interface PillSlots {
  /** Pill label. */
  default?: () => VNodeChild
}

export type PillCssVariables = {
  root: '--pill-fz' | '--pill-height' | '--pill-radius'
}

export type PillFactory = Factory<{
  props: Omit<PillProps, 'rootRef'>
  ref: HTMLSpanElement
  slots: PillSlots
  element: 'span'
  stylesNames: PillStylesNames
  vars: PillCssVariables
  variant: PillVariant
  staticComponents: {
    Group: typeof PillGroup
  }
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
