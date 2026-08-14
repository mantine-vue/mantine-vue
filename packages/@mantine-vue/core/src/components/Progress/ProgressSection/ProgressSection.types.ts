import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineColor, StylesApiProps, Factory } from '../../../core'

export type ProgressSectionStylesNames = 'section'

/** Props declared by `ProgressSection` itself. See `ProgressSectionProps` for the full public type. */
export interface ProgressSectionOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Value of the section in 0–100 range */
  value: number

  /**
   * Determines whether `aria-*` props should be added to the root element
   *
   * @default true
   */
  withAria?: boolean

  /**
   * Key of `theme.colors` or any valid CSS value
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * If set, the section has stripes
   *
   * @default false
   */
  striped?: boolean

  /**
   * If set, the sections stripes are animated, `striped` prop is ignored
   *
   * @default false
   */
  animated?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to Progress elements. */
  classNames?: StylesApiProps<ProgressSectionFactory>['classNames']

  /** Inline styles applied to Progress elements. */
  styles?: StylesApiProps<ProgressSectionProps>['styles']

  /** CSS variables applied to Progress elements. */
  vars?: StylesApiProps<ProgressSectionProps>['vars']
}

export interface ProgressSectionProps
  extends Omit<BoxProps, keyof ProgressSectionOwnProps>, ProgressSectionOwnProps {}

export interface ProgressSectionSlots {
  /** Section label content. */
  default?: () => VNodeChild
}

export type ProgressSectionFactory = Factory<{
  props: Omit<ProgressSectionProps, 'rootRef'>
  ref: HTMLDivElement
  slots: ProgressSectionSlots
  element: 'div'
  stylesNames: ProgressSectionStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
