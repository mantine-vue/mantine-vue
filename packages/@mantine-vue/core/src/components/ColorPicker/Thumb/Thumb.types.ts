import type { BoxProps } from '../../../core'

/** Props declared by the colour picker `Thumb` itself. */
export interface ColorPickerThumbOwnProps {
  /** Thumb position as a fraction of the track, `0` to `1` on each axis. */
  position: { x: number; y: number }
}

export interface ColorPickerThumbProps
  extends Omit<BoxProps, keyof ColorPickerThumbOwnProps>, ColorPickerThumbOwnProps {}
