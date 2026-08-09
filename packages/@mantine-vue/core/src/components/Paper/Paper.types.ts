import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineRadius,
  MantineShadow,
  StylesApiProps,
  MantineElementType,
} from '../../core'

export type PaperStylesNames = 'root'

export type PaperCssVariables = {
  root: '--paper-radius' | '--paper-shadow'
}

export interface PaperSlots {
  /** `Paper` content. */
  default?: () => VNodeChild
}

/** Props declared by `Paper` itself. See `PaperProps` for the full public type. */
export interface PaperOwnProps extends StylesApiProps<PaperProps> {
  /** Receives the root DOM node. See the polymorphic components guide. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `Paper`.
   * @default 'div'
   */
  component?: MantineElementType

  /** Key of `theme.shadows` or any valid CSS value to set `box-shadow`. */
  shadow?: MantineShadow

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius,
   * numbers are converted to rem.
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Adds border to the root element.
   * @default false
   */
  withBorder?: boolean
}
import type { VueRefTarget } from '@mantine-vue/hooks'

export interface PaperProps extends Omit<BoxProps, keyof PaperOwnProps>, PaperOwnProps {}
