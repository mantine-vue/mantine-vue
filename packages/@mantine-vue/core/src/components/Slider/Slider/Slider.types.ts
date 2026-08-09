import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineNode,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../../core'
import type { SliderStylesNames } from '../Slider.context'
import type { SliderMark } from '../SliderMark'

export type { SliderStylesNames }

export type SliderCssVariables = {
  root: '--slider-size' | '--slider-color' | '--slider-radius' | '--slider-thumb-size'
}

export interface SliderSlots {
  /** Thumb label. Receives the scaled value. */
  label?: (payload: { value: number }) => VNodeChild

  /** Content rendered inside the thumb. */
  thumbChildren?: () => VNodeChild
}

/** Props declared by `Slider` itself. See `SliderProps` for the full public type. */
export interface SliderOwnProps extends StylesApiProps<SliderProps> {
  /**
   * Key of `theme.colors` or any valid CSS color.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default 'xl'
   */
  radius?: MantineRadius

  /**
   * Controls the size of the track.
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Lowest possible value.
   *
   * @default 0
   */
  min?: number

  /**
   * Highest possible value.
   *
   * @default 100
   */
  max?: number

  /** Range the track spans, when it differs from `[min, max]`. */
  domain?: [number, number]

  /**
   * Increment between the values the slider can take.
   *
   * @default 1
   */
  step?: number

  /** Number of decimal places the value is rounded to. Derived from `step` when not set. */
  precision?: number

  /** Current value, bound with `v-model`. */
  modelValue?: number

  /** Uncontrolled initial value. */
  defaultValue?: number

  /** `name` of the hidden input that carries the value in an uncontrolled form. */
  name?: string

  /**
   * Marks rendered along the track.
   *
   * @default []
   */
  marks?: SliderMark[]

  /**
   * Label content, or a function that builds it from the scaled value.
   * Can also be set with the scoped `label` slot.
   *
   * @default (value) => value
   */
  label?: MantineNode | ((value: number) => MantineNode)

  /** Props passed down to the label transition. */
  labelTransitionProps?: Record<string, any>

  /**
   * If set, the label is always visible.
   *
   * @default false
   */
  labelAlwaysOn?: boolean

  /**
   * `aria-label` of the thumb.
   *
   * @default ''
   */
  thumbLabel?: string

  /** `aria-valuetext` of the thumb, or a function that builds it from the value. */
  thumbValueText?: string | ((value: number) => string)

  /**
   * If set, the label is shown while the track is hovered.
   *
   * @default true
   */
  showLabelOnHover?: boolean

  /**
   * Content rendered inside the thumb.
   * Can also be set with the `thumbChildren` slot – the slot takes precedence.
   */
  thumbChildren?: MantineNode

  /**
   * If set, the slider cannot be interacted with.
   *
   * @default false
   */
  disabled?: boolean

  /** Size of the thumb. Twice the track size when not set. */
  thumbSize?: string | number

  /**
   * Maps the internal value onto the value shown in the label and reported to
   * assistive technology.
   *
   * @default (value) => value
   */
  scale?: (value: number) => number

  /**
   * If set, the filled and empty sides of the track are swapped.
   *
   * @default false
   */
  inverted?: boolean

  /** Value the filled section is measured from, when it is not the track minimum. */
  startPointValue?: number

  /**
   * Direction the slider is laid out in.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /** Props passed down to the hidden input. */
  hiddenInputProps?: Record<string, any>

  /**
   * If set, the value can only be one of the `marks` values.
   *
   * @default false
   */
  restrictToMarks?: boolean

  /** Props passed down to the thumb element. */
  thumbProps?: Record<string, any>
}

export interface SliderProps extends Omit<BoxProps, keyof SliderOwnProps>, SliderOwnProps {}

export interface SliderEmits {
  /** Emitted with the next value while the thumb is dragged, bound with `v-model`. */
  'update:modelValue': [value: number]

  /** Emitted with the next value while the thumb is dragged. */
  change: [value: number]

  /** Emitted with the final value when dragging or keyboard adjustment ends. */
  'change-end': [value: number]
}
