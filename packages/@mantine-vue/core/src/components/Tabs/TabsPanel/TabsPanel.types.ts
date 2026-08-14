import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps, Factory } from '../../../core'

export type TabsPanelStylesNames = 'panel'

/** Props declared by `TabsPanel` itself. See `TabsPanelProps` for the full public type. */
export interface TabsPanelOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Value of associated control */
  value: string

  /**
   * If set, the content is kept mounted, even if `keepMounted` is set `false` in the parent `Tabs` component
   *
   * @default false
   */
  keepMounted?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to Tabs elements. */
  classNames?: StylesApiProps<TabsPanelFactory>['classNames']

  /** Inline styles applied to Tabs elements. */
  styles?: StylesApiProps<TabsPanelProps>['styles']
}

export interface TabsPanelProps
  extends Omit<BoxProps, keyof TabsPanelOwnProps>, TabsPanelOwnProps {}

export interface TabsPanelSlots {
  /** Panel content. */
  default?: () => VNodeChild
}

export type TabsPanelFactory = Factory<{
  props: Omit<TabsPanelProps, 'rootRef'>
  ref: HTMLDivElement
  slots: TabsPanelSlots
  element: 'div'
  stylesNames: TabsPanelStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
