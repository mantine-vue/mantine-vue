import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, StylesApiProps } from '../../../core'
import type { SliderOwnProps, SliderStylesNames } from '../Slider/Slider.types'

export type RangeSliderValue = [number, number]

export type RangeSliderStylesNames = SliderStylesNames

export interface RangeSliderSlots {
  /** Thumb label. Receives the scaled value and the index of the thumb. */
  label?: (payload: { value: number; index: number }) => VNodeChild

  /** Content rendered inside a thumb. Receives the index of the thumb. */
  thumbChildren?: (payload: { index: number }) => VNodeChild
}

/**
 * Props declared by `RangeSlider` itself.
 * See `RangeSliderProps` for the full public type.
 */
export interface RangeSliderOwnProps
  extends
    Omit<
      SliderOwnProps,
      // The Styles API props are re-declared below with `RangeSliderProps` as the
      // callback payload, so the `SliderProps`-typed ones must not come along.
      | 'classNames'
      | 'styles'
      | 'vars'
      | 'unstyled'
      | 'modelValue'
      | 'defaultValue'
      | 'domain'
      | 'thumbLabel'
      | 'thumbChildren'
      | 'thumbProps'
      | 'startPointValue'
    >,
    StylesApiProps<RangeSliderProps> {
  /** Selected range, bound with `v-model`. */
  modelValue?: RangeSliderValue

  /** Uncontrolled initial range. */
  defaultValue?: RangeSliderValue

  /** Range the track spans, when it differs from `[min, max]`. */
  domain?: RangeSliderValue

  /**
   * Smallest distance allowed between the two values.
   *
   * @default 10
   */
  minRange?: number

  /**
   * Largest distance allowed between the two values.
   *
   * @default Infinity
   */
  maxRange?: number

  /**
   * If set, dragging one thumb past the other pushes it instead of stopping.
   *
   * @default true
   */
  pushOnOverlap?: boolean

  /** `aria-label` of each thumb, as a `[from, to]` pair. */
  thumbLabel?: [string, string]

  /** Content rendered inside each thumb, as a `[from, to]` pair. */
  thumbChildren?: [MantineNode, MantineNode]

  /** Returns the props passed down to the thumb at the given index. */
  thumbProps?: (index: number) => Record<string, any>
}

export interface RangeSliderProps
  extends Omit<BoxProps, keyof RangeSliderOwnProps>, RangeSliderOwnProps {}

export interface RangeSliderEmits {
  /** Emitted with the next range while a thumb is dragged, bound with `v-model`. */
  'update:modelValue': [value: RangeSliderValue]

  /** Emitted with the next range while a thumb is dragged. */
  change: [value: RangeSliderValue]

  /** Emitted with the final range when dragging or keyboard adjustment ends. */
  'change-end': [value: RangeSliderValue]
}
