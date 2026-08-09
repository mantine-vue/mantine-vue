import type { SliderMark } from '../SliderMark'

/** Props declared by the slider `Marks` layer. */
export interface SliderMarksProps {
  /** Marks rendered along the track. Nothing is rendered when not set. */
  marks?: SliderMark[]

  /** Lowest value of the track, used to position each mark. */
  min: number

  /** Highest value of the track, used to position each mark. */
  max: number

  /** Current value, used to decide which marks are filled. */
  value: number

  /** Lower bound of a range selection, so marks inside the range count as filled. */
  offset?: number

  /**
   * If set, the marks are rendered in their disabled state.
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

  /** Value the filled section is measured from, when it is not the track minimum. */
  startPointValue?: number
}
