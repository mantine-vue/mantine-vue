import type {
  AlignItems,
  BoxProps,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  MantineSpacing,
  StyleProp,
  StylesApiProps,
} from '../../core'

/** Props declared by `Flex` itself. See `FlexProps` for the full public type. */
export interface FlexOwnProps extends StylesApiProps<FlexProps> {
  /**
   * Root element or component rendered by `Flex`.
   *
   * @default 'div'
   */
  component?: string

  /** `gap` CSS property */
  gap?: StyleProp<MantineSpacing>

  /** `row-gap` CSS property */
  rowGap?: StyleProp<MantineSpacing>

  /** `column-gap` CSS property */
  columnGap?: StyleProp<MantineSpacing>

  /** `align-items` CSS property */
  align?: StyleProp<AlignItems>

  /** `justify-content` CSS property */
  justify?: StyleProp<JustifyContent>

  /** `flex-wrap` CSS property */
  wrap?: StyleProp<FlexWrap>

  /** `flex-direction` CSS property */
  direction?: StyleProp<FlexDirection>
}

export interface FlexProps extends Omit<BoxProps, keyof FlexOwnProps>, FlexOwnProps {}
