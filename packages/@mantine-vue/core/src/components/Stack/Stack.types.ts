import type {
  AlignItems,
  BoxProps,
  JustifyContent,
  MantineSpacing,
  StylesApiProps,
} from '../../core'

/** Props declared by `Stack` itself. See `StackProps` for the full public type. */
export interface StackOwnProps extends StylesApiProps<StackProps> {
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
