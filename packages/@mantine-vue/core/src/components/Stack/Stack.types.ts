import type {
  AlignItems,
  BoxProps,
  JustifyContent,
  MantineSpacing,
  StylesApiProps,
  Factory,
} from '../../core'

/** Props declared by `Stack` itself. See `StackProps` for the full public type. */
export interface StackOwnProps extends StylesApiProps<StackFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Key of `theme.spacing` or any valid CSS value to set `gap` property, numbers are converted to rem
   *
   * @default 'md'
   */
  gap?: MantineSpacing

  /**
   * Controls `align-items` CSS property
   *
   * @default 'stretch'
   */
  align?: AlignItems

  /**
   * Controls `justify-content` CSS property
   *
   * @default 'flex-start'
   */
  justify?: JustifyContent
}

export interface StackProps extends Omit<BoxProps, keyof StackOwnProps>, StackOwnProps {}

export type StackStylesNames = 'root'

export type StackCssVariables = {
  root: '--stack-gap' | '--stack-align' | '--stack-justify'
}

export type StackFactory = Factory<{
  props: Omit<StackProps, 'rootRef'>
  ref: HTMLDivElement
  element: 'div'
  stylesNames: StackStylesNames
  vars: StackCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
