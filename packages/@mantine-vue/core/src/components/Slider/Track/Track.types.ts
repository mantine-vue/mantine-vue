import type { VNodeChild } from 'vue'
import type { SliderMark } from '../SliderMark'

export interface SliderTrackSlots {
  /** Thumbs rendered over the track. */
  default?: () => VNodeChild
}

/** Props declared by the slider `Track` itself. */
export interface SliderTrackProps {
  /** Width of the filled bar as a percentage of the track. */
  filled: number

  /**
   * Offset of the filled bar from the start of the track, as a percentage.
   *
   * @default 0
   */
  offset?: number

  /** Lower bound used to decide which marks are filled, for a range selection. */
  marksOffset?: number

  /** Marks rendered along the track. */
  marks?: SliderMark[]

  /** Lowest value of the track. */
  min: number

  /** Highest value of the track. */
  max: number

  /** Current value, used to decide which marks are filled. */
  value: number

  /** Value the filled section is measured from, when it is not the track minimum. */
  startPointValue?: number

  /**
   * If set, the track is rendered in its disabled state.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the filled and empty sides of the track are swapped.
   *
   * @default false
   */
  inverted?: boolean

  /** Props passed down to the track container element. */
  containerProps?: Record<string, any>
}
