import type {
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  PolymorphicFactory,
} from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { VueRefTarget } from '@mantine-vue/hooks'

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type QRCodeDotStyle = 'square' | 'rounded' | 'dots'
export type QRCodeCornerStyle = 'square' | 'rounded' | 'dots'

/** Props declared by `QRCode` itself. See `QRCodeProps` for the full public type. */
export interface QRCodeOwnProps extends StylesApiProps<QRCodeFactory> {
  /** Root element or component rendered by `QRCode`. @default 'div' */
  component?: any

  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Data to encode in the QR code (URL, text, contact data, and so on). */
  value: string

  /** QR code width and height. @default 'md' */
  size?: MantineSize | (string & {}) | number

  /** Border radius of the outer container. */
  radius?: MantineRadius

  /** Module foreground color from the Mantine theme. @default 'dark' */
  color?: MantineColor

  /** Background color from the Mantine theme, or `transparent`. @default 'white' */
  background?: MantineColor | 'transparent'

  /** Error correction level: L (7%), M (15%), Q (25%), or H (30%). @default 'M' */
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel

  /** Number of quiet-zone modules around the QR code. @default 1 */
  quietZone?: number

  /** Shape used for data modules. @default 'square' */
  dotStyle?: QRCodeDotStyle

  /** Shape used for the three finder patterns. @default 'square' */
  cornerStyle?: QRCodeCornerStyle

  /** URL of an image or logo rendered at the center. */
  image?: string

  /** Image size relative to the QR matrix, from 0 to 1. @default 0.2 */
  imageSize?: number

  /** Border radius of the center image. */
  imageRadius?: MantineRadius

  /** Padding around the image measured in modules. @default 1 */
  imagePadding?: number

  /** Removes QR modules behind the center image. @default true */
  imageExcavate?: boolean
}

export interface QRCodeProps extends Omit<BoxProps, keyof QRCodeOwnProps>, QRCodeOwnProps {}

export type QRCodeStylesNames =
  | 'root'
  | 'svg'
  | 'background'
  | 'modules'
  | 'finderPattern'
  | 'finderOuter'
  | 'finderInner'
  | 'image'

export type QRCodeCssVariables = {
  root: '--qr-code-size' | '--qr-code-radius' | '--qr-code-color' | '--qr-code-background'
}

export type QRCodeFactory = PolymorphicFactory<{
  props: Omit<QRCodeProps, 'component' | 'rootRef'>
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: QRCodeStylesNames
  vars: QRCodeCssVariables
}>
