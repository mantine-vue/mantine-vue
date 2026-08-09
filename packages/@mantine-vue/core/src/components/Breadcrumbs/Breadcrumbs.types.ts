import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, StylesApiProps } from '../../core'

/** Props declared by `Breadcrumbs` itself. See `BreadcrumbsProps` for the full public type. */
export interface BreadcrumbsOwnProps extends StylesApiProps<BreadcrumbsProps> {
  /**
   * Separator between children
   *
   * @default '/'
   */
  separator?: MantineNode

  /**
   * Controls spacing between separator and breadcrumb
   *
   * @default 'xs'
   */
  separatorMargin?: string | number
}

export interface BreadcrumbsSlots {
  /** Component content. */
  default?: () => VNodeChild

  /** Custom separator rendered between breadcrumb items. */
  separator?: () => VNodeChild
}

export type BreadcrumbsStylesNames = 'root' | 'separator' | 'breadcrumb'

export type BreadcrumbsCssVariables = {
  root: '--bc-separator-margin'
}

export interface BreadcrumbsProps
  extends Omit<BoxProps, keyof BreadcrumbsOwnProps>, BreadcrumbsOwnProps {}
