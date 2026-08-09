import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineNode, MantineSize, StylesApiProps } from '../../core'

export type RatingStylesNames =
  | 'root'
  | 'starSymbol'
  | 'input'
  | 'label'
  | 'symbolBody'
  | 'symbolGroup'

export type RatingCssVariables = {
  root: '--rating-size' | '--rating-color'
}

export interface RatingSlots {
  /** Symbol rendered for an unselected item. Receives the item value. */
  emptySymbol?: (props: { value: number }) => VNodeChild

  /** Symbol rendered for a selected item. Receives the item value. */
  fullSymbol?: (props: { value: number }) => VNodeChild
}

/** Props declared by `Rating` itself. See `RatingProps` for the full public type. */
export interface RatingOwnProps extends StylesApiProps<RatingProps> {
  /** Selected value, bound with `v-model`. */
  modelValue?: number

  /** Uncontrolled initial value. */
  defaultValue?: number

  /**
   * Symbol rendered for an unselected item, or a function of the item value.
   * Can also be set with the scoped `emptySymbol` slot – the slot takes precedence.
   */
  emptySymbol?: MantineNode | ((value: number) => VNodeChild)

  /**
   * Symbol rendered for a selected item, or a function of the item value.
   * Can also be set with the scoped `fullSymbol` slot – the slot takes precedence.
   */
  fullSymbol?: MantineNode | ((value: number) => VNodeChild)

  /**
   * Number of selectable fractions each symbol is divided into.
   *
   * @default 1
   */
  fractions?: number

  /**
   * Controls the size of each symbol.
   *
   * @default 'sm'
   */
  size?: MantineSize | number | (string & {})

  /**
   * Number of symbols.
   *
   * @default 5
   */
  count?: number

  /**
   * Builds the `aria-label` of each symbol from its value.
   *
   * @default (value) => `${value}`
   */
  getSymbolLabel?: (value: number) => string

  /** `name` shared by the radio inputs. Generated automatically when not set. */
  name?: string

  /** `id` of the root element. Generated automatically when not set. */
  id?: string

  /**
   * If set, the value cannot be changed and no inputs are rendered.
   *
   * @default false
   */
  readOnly?: boolean

  /**
   * If set, selecting the current value again clears the rating.
   *
   * @default false
   */
  allowClear?: boolean

  /**
   * If set, only the selected symbol is highlighted instead of every symbol up to it.
   *
   * @default false
   */
  highlightSelectedOnly?: boolean

  /**
   * Key of `theme.colors` or any valid CSS color of the selected symbols.
   *
   * @default 'yellow'
   */
  color?: MantineColor
}

export interface RatingProps extends Omit<BoxProps, keyof RatingOwnProps>, RatingOwnProps {}
