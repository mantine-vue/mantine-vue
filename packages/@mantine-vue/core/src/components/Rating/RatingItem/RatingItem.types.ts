import type { BoxProps } from '../../../core'

/** Props declared by `RatingItem` itself. See `RatingItemProps` for the full public type. */
export interface RatingItemOwnProps {
  /** Builds the `aria-label` of the radio input from the item value. */
  getSymbolLabel?: (value: number) => string

  /** Icon rendered while the item is empty, or a function receiving the item value. */
  emptyIcon?: any

  /** Icon rendered while the item is full, or a function receiving the item value. */
  fullIcon?: any

  /** Whether the item renders the full symbol rather than the empty one. */
  full: boolean

  /** Whether the item is inside the currently highlighted range. */
  active: boolean

  /** Whether the underlying radio input is checked. */
  checked: boolean

  /**
   * If set, the item renders as static content with no input.
   *
   * @default false
   */
  readOnly?: boolean

  /** Portion of the symbol this item covers, `1` for a whole symbol. */
  fractionValue: number

  /** Value this item selects. */
  value: number

  /** `id` of the radio input, referenced by the label. */
  id: string

  /** `name` shared by every radio input of the rating. */
  name: string

  /** Called with the item value when the item is clicked or activated. */
  onChangeValue: (value: number) => void

  /** Called with the item value when the radio input changes. */
  onInputChange: (value: number) => void

  /** Called when the radio input loses focus. */
  onItemBlur?: () => void
}

export interface RatingItemProps
  extends Omit<BoxProps, keyof RatingItemOwnProps>, RatingItemOwnProps {}
