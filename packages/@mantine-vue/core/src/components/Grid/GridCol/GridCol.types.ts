import type { VNodeChild } from 'vue'
import type { AlignItems, BoxProps, StyleProp, StylesApiProps } from '../../../core'
import type { ColSpan } from './GridColVariables'

/** Props declared by `GridCol` itself. See `GridColProps` for the full public type. */
export interface GridColOwnProps {
  /**
   * Column span
   *
   * @default 12
   */
  span?: StyleProp<ColSpan>

  /** Column order, use to reorder columns at different viewport sizes */
  order?: StyleProp<number>

  /** Column start offset – number of empty columns before this column */
  offset?: StyleProp<number>

  /** Vertical alignment of the column, controls `align-self` CSS property */
  align?: StyleProp<AlignItems>

  /** Class names applied to Grid elements. */
  classNames?: StylesApiProps<GridColProps>['classNames']

  /** Inline styles applied to Grid elements. */
  styles?: StylesApiProps<GridColProps>['styles']

  /** CSS variables applied to Grid elements. */
  vars?: StylesApiProps<GridColProps>['vars']
}

export interface GridColProps extends Omit<BoxProps, keyof GridColOwnProps>, GridColOwnProps {}

export interface GridColSlots {
  /** Column content. */
  default?: () => VNodeChild
}
