import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../core'

/** HTML table elements the shared implementation can render. */
export type TableElementName = 'th' | 'td' | 'tr' | 'thead' | 'tbody' | 'tfoot' | 'caption'

/**
 * Which of the parent `Table`'s options this element reacts to. Each flag turns one
 * context value into a `data-` attribute the stylesheet keys off.
 */
export interface TableElementOptions {
  columnBorder?: true
  rowBorder?: true
  striped?: true
  highlightOnHover?: true
  captionSide?: true
  stickyHeader?: true
}

export interface TableElementSlots {
  /** Cell or section content. */
  default?: () => VNodeChild
}

/** Props declared by every `Table` element. */
export interface TableElementOwnProps {
  /** Class names applied to the compound selectors the element renders. */
  classNames?: any

  /** Inline styles applied to the compound selectors the element renders. */
  styles?: any

  /** Class added to the element. Alias of `class`, kept for mantine React-style usage. */
  className?: any

  /** Inline style added to the element. */
  style?: any
}

export interface TableElementProps
  extends Omit<BoxProps, keyof TableElementOwnProps>, TableElementOwnProps {}
