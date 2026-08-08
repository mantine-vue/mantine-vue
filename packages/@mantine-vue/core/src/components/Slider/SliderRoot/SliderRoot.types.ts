import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'

export interface SliderRootSlots {
  /** Track, marks and thumbs. */
  default?: () => VNodeChild
}

/** Props declared by `SliderRoot` itself. See `SliderRootProps` for the full public type. */
export interface SliderRootOwnProps {
  /** Controls the size of the track. Passed through to the Styles API payload. */
  size: string | number

  /**
   * If set, the slider cannot be interacted with.
   *
   * @default false
   */
  disabled?: boolean

  /** Controls the visual representation of the slider. */
  variant?: string

  /**
   * Direction the slider is laid out in.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface SliderRootProps
  extends Omit<BoxProps, keyof SliderRootOwnProps>, SliderRootOwnProps {}
