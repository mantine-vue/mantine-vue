import type { BoxProps } from '../../../core'

/** Props declared by `Swatches` itself. */
export interface SwatchesOwnProps {
  /** Colours rendered as swatches, in any valid CSS format. */
  data: string[]

  /**
   * If set, each swatch can be reached with the keyboard.
   *
   * @default true
   */
  focusable?: boolean

  /** Currently selected colour; the matching swatch shows a check icon. */
  value?: string

  /** Called with the colour of the clicked swatch. */
  setValue: (value: string) => void
}

export interface SwatchesProps extends Omit<BoxProps, keyof SwatchesOwnProps>, SwatchesOwnProps {}
