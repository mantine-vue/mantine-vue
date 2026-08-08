import type { Component } from 'vue'
import type { BoxProps } from '../../../core'

/** Props accepted by the generated pagination items. */
export interface PaginationItemsProps {
  /** Component used to render range separators. */
  dotsIcon?: Component
}

/** Props accepted by the responsive pagination items wrapper. */
export interface PaginationItemsGroupProps extends BoxProps {
  /** Root element or component rendered by the responsive wrapper. */
  component?: BoxProps['component']
}
