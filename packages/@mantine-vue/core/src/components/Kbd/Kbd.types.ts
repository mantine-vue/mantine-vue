import type { VNodeChild } from 'vue'
import type { BoxProps, MantineSize, StylesApiProps, Factory } from '../../core'

export type KbdStylesNames = 'root'

export type KbdCssVariables = {
  root: '--kbd-fz'
}

export interface KbdSlots {
  /** `Kbd` content. */
  default?: () => VNodeChild
}

/** Props declared by `Kbd` itself. See `KbdProps` for the full public type. */
export interface KbdOwnProps extends StylesApiProps<KbdFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Controls `font-size` and `padding`.
   * @default 'sm'
   */
  size?: MantineSize | number | (string & {})
}

export interface KbdProps extends Omit<BoxProps, keyof KbdOwnProps>, KbdOwnProps {}

export type KbdFactory = Factory<{
  props: Omit<KbdProps, 'rootRef'>
  ref: HTMLElement
  slots: KbdSlots
  element: 'kbd'
  stylesNames: KbdStylesNames
  vars: KbdCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
