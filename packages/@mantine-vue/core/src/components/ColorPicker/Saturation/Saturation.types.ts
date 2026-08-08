import type { BoxProps } from '../../../core'
import type { HsvaColor } from '../ColorPicker.types'

/** Props declared by `Saturation` itself. */
export interface SaturationOwnProps {
  /** Current colour in HSVA. */
  value: HsvaColor

  /** `aria-label` of the saturation area. */
  saturationLabel?: string

  /** Controls the size of the area. */
  size: string

  /** Background colour of the thumb, in any valid CSS format. */
  color: string

  /**
   * If set, the area can be focused and adjusted with the arrow keys.
   *
   * @default true
   */
  focusable?: boolean
}

export interface SaturationProps
  extends Omit<BoxProps, keyof SaturationOwnProps>, SaturationOwnProps {}
