import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineNode, StylesApiProps, Factory } from '../../../core'

/** Props declared by `ListItem` itself. See `ListItemProps` for the full public type. */
export interface ListItemOwnProps extends Pick<
  StylesApiProps<ListItemFactory>,
  'classNames' | 'styles' | 'vars'
> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Icon to replace item bullet */
  icon?: MantineNode

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface ListItemSlots {
  /** Component content. */
  default?: () => VNodeChild
  /** Marker that overrides the parent list icon. */
  icon?: () => VNodeChild
}

export interface ListItemProps extends Omit<BoxProps, keyof ListItemOwnProps>, ListItemOwnProps {}

export type ListItemStylesNames = 'item' | 'itemWrapper' | 'itemIcon' | 'itemLabel'

export type ListItemFactory = Factory<{
  props: Omit<ListItemProps, 'rootRef'>
  ref: HTMLLIElement
  slots: ListItemSlots
  element: 'li'
  stylesNames: ListItemStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
