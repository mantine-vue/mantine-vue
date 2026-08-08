import type { VNodeChild } from 'vue'
import type {
  AlignItems,
  BoxProps,
  FlexWrap,
  JustifyContent,
  MantineSpacing,
  StylesApiProps,
} from '../../core'

/** Props declared by `Group` itself. See `GroupProps` for the full public type. */
export interface GroupOwnProps extends StylesApiProps<GroupProps> {
  /**
   * Controls `justify-content` CSS property
   *
   * @default 'flex-start'
   */
  justify?: JustifyContent

  /**
   * Controls `align-items` CSS property
   *
   * @default 'center'
   */
  align?: AlignItems

  /**
   * Controls `flex-wrap` CSS property
   *
   * @default 'wrap'
   */
  wrap?: FlexWrap

  /**
   * Key of `theme.spacing` or any valid CSS value for `gap`, numbers are converted to rem
   *
   * @default 'md'
   */
  gap?: MantineSpacing

  /**
   * Determines whether each child element should have `flex-grow: 1` style
   *
   * @default false
   */
  grow?: boolean

  /**
   * Determines whether children should take only dedicated amount of space (`max-width` style is set based on the number of children)
   *
   * @default true
   */
  preventGrowOverflow?: boolean
}

export interface GroupProps extends Omit<BoxProps, keyof GroupOwnProps>, GroupOwnProps {}

export interface GroupSlots {
  /** Group children used to calculate the grow width. */
  default?: () => VNodeChild
}
