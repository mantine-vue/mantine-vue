import type { VueRefTarget } from '@mantine-vue/hooks'
import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, StylesApiProps, Factory } from '../../core'

/** Props declared by `Breadcrumbs` itself. See `BreadcrumbsProps` for the full public type. */
export interface BreadcrumbsOwnProps extends StylesApiProps<BreadcrumbsFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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

export type BreadcrumbsFactory = Factory<{
  props: Omit<BreadcrumbsProps, 'rootRef'>
  slots: BreadcrumbsSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: BreadcrumbsStylesNames
  vars: BreadcrumbsCssVariables
}>
