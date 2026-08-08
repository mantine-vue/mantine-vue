export type InlineCodeHighlightStylesNames = 'inlineCodeHighlight'
export type InlineCodeHighlightCssVariables = {
  inlineCodeHighlight: '--ch-background' | '--ch-radius'
}

export interface InlineCodeHighlightProps {
  /** Code to highlight. */
  code: string
  /** Language of the code, used to determine syntax highlighting. */
  language?: string
  /** Controls background color of the code. By default, the value depends on color scheme. */
  background?: string
  /** Key of `theme.radius` or any valid CSS value to set border-radius. @default 'sm' */
  radius?: string | number
  /** Adds border to the root element. @default false */
  withBorder?: boolean
  /** CSS classes applied to component elements. */
  classNames?: any
  /** Inline styles applied to component elements. */
  styles?: any
  /** CSS variables applied to component elements. */
  vars?: any
  /** If set, all Mantine classes are removed from component elements. @default false */
  unstyled?: boolean
  [key: string]: any
}

export interface InlineCodeHighlightFactory {
  props: InlineCodeHighlightProps
  stylesNames: InlineCodeHighlightStylesNames
  vars: InlineCodeHighlightCssVariables
}
