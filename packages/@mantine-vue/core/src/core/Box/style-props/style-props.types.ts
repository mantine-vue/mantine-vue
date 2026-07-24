import type { CSSProperties } from 'vue'
import type {
  MantineBreakpoint,
  MantineColor,
  MantineFontSize,
  MantineLineHeight,
  MantineSpacing,
} from '../../MantineProvider'

export type StyleProp<Value> = Value | Partial<Record<MantineBreakpoint | (string & {}), Value>>

type CssValue<Key extends keyof CSSProperties> = CSSProperties[Key]

export interface MantineStyleProps {
  /** Margin, theme key: theme.spacing */
  m?: StyleProp<MantineSpacing>
  /** MarginBlock, theme key: theme.spacing */
  my?: StyleProp<MantineSpacing>
  /** MarginInline, theme key: theme.spacing */
  mx?: StyleProp<MantineSpacing>
  /** MarginTop, theme key: theme.spacing */
  mt?: StyleProp<MantineSpacing>
  /** MarginBottom, theme key: theme.spacing */
  mb?: StyleProp<MantineSpacing>
  /** MarginInlineStart, theme key: theme.spacing */
  ms?: StyleProp<MantineSpacing>
  /** MarginInlineEnd, theme key: theme.spacing */
  me?: StyleProp<MantineSpacing>
  /** MarginInlineStart, theme key: theme.spacing */
  mis?: StyleProp<MantineSpacing>
  /** MarginInlineEnd, theme key: theme.spacing */
  mie?: StyleProp<MantineSpacing>
  /** MarginLeft, theme key: theme.spacing */
  ml?: StyleProp<MantineSpacing>
  /** MarginRight, theme key: theme.spacing */
  mr?: StyleProp<MantineSpacing>
  /** Padding, theme key: theme.spacing */
  p?: StyleProp<MantineSpacing>
  /** PaddingBlock, theme key: theme.spacing */
  py?: StyleProp<MantineSpacing>
  /** PaddingInline, theme key: theme.spacing */
  px?: StyleProp<MantineSpacing>
  /** PaddingTop, theme key: theme.spacing */
  pt?: StyleProp<MantineSpacing>
  /** PaddingBottom, theme key: theme.spacing */
  pb?: StyleProp<MantineSpacing>
  /** PaddingInlineStart, theme key: theme.spacing */
  ps?: StyleProp<MantineSpacing>
  /** PaddingInlineEnd, theme key: theme.spacing */
  pe?: StyleProp<MantineSpacing>
  /** PaddingInlineStart, theme key: theme.spacing */
  pis?: StyleProp<MantineSpacing>
  /** PaddingInlineEnd, theme key: theme.spacing */
  pie?: StyleProp<MantineSpacing>
  /** PaddingLeft, theme key: theme.spacing */
  pl?: StyleProp<MantineSpacing>
  /** PaddingRight, theme key: theme.spacing */
  pr?: StyleProp<MantineSpacing>
  /** Border */
  bd?: StyleProp<CssValue<'border'>>
  /** BorderRadius, theme key: theme.radius */
  bdrs?: StyleProp<MantineSpacing>
  /** Background, theme key: theme.colors */
  bg?: StyleProp<MantineColor>
  /** Color, theme key: theme.colors */
  c?: StyleProp<MantineColor>
  /** Opacity */
  opacity?: StyleProp<CssValue<'opacity'>>
  /** FontFamily */
  ff?: StyleProp<'monospace' | 'mono' | 'text' | 'heading' | 'headings' | (string & {})>
  /** FontSize, theme key: theme.fontSizes */
  fz?: StyleProp<MantineFontSize | `h${1 | 2 | 3 | 4 | 5 | 6}` | number | (string & {})>
  /** FontWeight */
  fw?: StyleProp<CssValue<'fontWeight'>>
  /** LetterSpacing */
  lts?: StyleProp<CssValue<'letterSpacing'>>
  /** TextAlign */
  ta?: StyleProp<CssValue<'textAlign'>>
  /** LineHeight, theme key: theme.lineHeights */
  lh?: StyleProp<MantineLineHeight | `h${1 | 2 | 3 | 4 | 5 | 6}` | number | (string & {})>
  /** FontStyle */
  fs?: StyleProp<CssValue<'fontStyle'>>
  /** TextTransform */
  tt?: StyleProp<CssValue<'textTransform'>>
  /** TextDecoration */
  td?: StyleProp<CssValue<'textDecoration'>>
  /** Width, theme key: theme.spacing */
  w?: StyleProp<CssValue<'width'>>
  /** MinWidth, theme key: theme.spacing */
  miw?: StyleProp<CssValue<'minWidth'>>
  /** MaxWidth, theme key: theme.spacing */
  maw?: StyleProp<CssValue<'maxWidth'>>
  /** Height, theme key: theme.spacing */
  h?: StyleProp<CssValue<'height'>>
  /** MinHeight, theme key: theme.spacing */
  mih?: StyleProp<CssValue<'minHeight'>>
  /** MaxHeight, theme key: theme.spacing */
  mah?: StyleProp<CssValue<'maxHeight'>>
  /** BackgroundSize */
  bgsz?: StyleProp<CssValue<'backgroundSize'>>
  /** BackgroundPosition */
  bgp?: StyleProp<CssValue<'backgroundPosition'>>
  /** BackgroundRepeat */
  bgr?: StyleProp<CssValue<'backgroundRepeat'>>
  /** BackgroundAttachment */
  bga?: StyleProp<CssValue<'backgroundAttachment'>>
  /** Position */
  pos?: StyleProp<CssValue<'position'>>
  /** Top */
  top?: StyleProp<CssValue<'top'>>
  /** Left */
  left?: StyleProp<CssValue<'left'>>
  /** Bottom */
  bottom?: StyleProp<CssValue<'bottom'>>
  /** Right */
  right?: StyleProp<CssValue<'right'>>
  /** Inset */
  inset?: StyleProp<CssValue<'inset'>>
  /** Display */
  display?: StyleProp<CssValue<'display'>>
  /** Flex */
  flex?: StyleProp<CssValue<'flex'>>
}
