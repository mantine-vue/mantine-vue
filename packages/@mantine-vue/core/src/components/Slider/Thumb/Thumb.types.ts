import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'

export interface SliderThumbSlots {
  /** Content rendered inside the thumb. */
  default?: () => VNodeChild
}

/** Props declared by the slider `Thumb` itself. */
export interface SliderThumbOwnProps {
  /** Highest value of the track, reported as `aria-valuemax`. */
  max: number

  /** Lowest value of the track, reported as `aria-valuemin`. */
  min: number

  /** Current value, reported as `aria-valuenow`. */
  value: number

  /** Offset of the thumb along the track, as a percentage. */
  position: number

  /**
   * If set, the thumb is being dragged, which keeps the label visible.
   *
   * @default false
   */
  dragging?: boolean

  /** Label content, or a function returning it. Nothing is rendered when not set. */
  label?: any

  /** `aria-valuetext`, or a function that builds it from the current value. */
  thumbValueText?: string | ((value: number) => string)

  /** Props passed down to the label transition. */
  labelTransitionProps?: Record<string, any>

  /**
   * If set, the label is always visible.
   *
   * @default false
   */
  labelAlwaysOn?: boolean

  /** `aria-label` of the thumb. */
  thumbLabel?: string

  /**
   * If set, the label is shown while the track is hovered.
   *
   * @default true
   */
  showLabelOnHover?: boolean

  /**
   * Whether the track is currently hovered, used together with `showLabelOnHover`.
   *
   * @default false
   */
  isHovered?: boolean

  /**
   * If set, the thumb cannot be focused or dragged.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Direction the slider is laid out in, reported as `aria-orientation`.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface SliderThumbProps
  extends Omit<BoxProps, keyof SliderThumbOwnProps>, SliderThumbOwnProps {}
