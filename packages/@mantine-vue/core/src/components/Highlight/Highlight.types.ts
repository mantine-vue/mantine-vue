import type { CSSProperties, VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineTheme, StylesApiProps } from '../../core'

export interface HighlightTerm {
  /** Text to highlight. */
  text: string

  /** Highlight color for this term. */
  color?: MantineColor
}

/** Props declared by `Highlight` itself. See `HighlightProps` for the full public type. */
export interface HighlightOwnProps extends StylesApiProps<HighlightProps> {
  /**
   * Substring(s) to highlight in `children`. Can be:
   * - string: single term
   * - string[]: multiple terms with same color
   * - HighlightTerm[]: multiple terms with custom colors per term
   *
   * - Matching is case-insensitive and accent-insensitive by default, use `caseInsensitive` and `accentInsensitive` props to control this behavior
   * - Regex special characters are automatically escaped
   * - When multiple substrings are provided, longer matches take precedence
   * - Empty strings and whitespace-only strings are ignored
   */
  highlight: string | string[] | HighlightTerm[]

  /**
   * Default background color for all highlighted text.
   * Key of `theme.colors` or any valid CSS color, passed to `Mark` component.
   * Can be overridden per term when using HighlightTerm objects.
   *
   * @default 'yellow'
   */
  color?: MantineColor

  /** Styles applied to `mark` elements */
  highlightStyles?: CSSProperties | ((theme: MantineTheme) => CSSProperties)

  /**
   * Only match whole words (adds word boundaries to regex).
   * When enabled, 'the' will not match 'there'.
   *
   * @default false
   */
  wholeWord?: boolean

  /**
   * Perform case-insensitive matching.
   *
   * @default true
   */
  caseInsensitive?: boolean

  /**
   * Perform accent-insensitive matching.
   * When enabled cafe will match cafe, café, cafè, etc.
   *
   * @default true
   */
  accentInsensitive?: boolean

  /** Root element or component rendered by `Highlight`. */
  component?: string

  /**
   * Shorthand for `component="span"`
   *
   * @default false
   */
  span?: boolean
}

export interface HighlightProps
  extends Omit<BoxProps, keyof HighlightOwnProps>, HighlightOwnProps {}

export interface HighlightSlots {
  /** Plain-text content to search and highlight. */
  default?: () => VNodeChild
}
