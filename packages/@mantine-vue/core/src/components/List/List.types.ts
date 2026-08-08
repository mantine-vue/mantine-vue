import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineNode,
  MantineSize,
  MantineSpacing,
  StylesApiProps,
} from '../../core'

/** Props declared by `List` itself. See `ListProps` for the full public type. */
export interface ListOwnProps extends StylesApiProps<ListProps> {
  /**
   * List type
   *
   * @default 'unordered'
   */
  type?: 'ordered' | 'unordered'

  /**
   * Adds extra horizontal padding to the list, useful for nested lists
   *
   * @default false
   */
  withPadding?: boolean

  /**
   * Controls `font-size` and `line-height`
   *
   * @default 'md'
   */
  size?: MantineSize

  /** Icon to replace default list markers. Applied to all items unless overridden on individual List.Item components */
  icon?: MantineNode

  /**
   * Key of `theme.spacing` or any valid CSS value to set spacing between items
   *
   * @default 0
   */
  spacing?: MantineSpacing

  /**
   * Vertically centers list items with their icons
   *
   * @default false
   */
  center?: boolean

  /** Controls CSS `list-style-type` property. Overrides the default list marker style based on list type */
  listStyleType?: string

  /** Starting value for ordered list numbering (only works with type="ordered") */
  start?: number

  /**
   * Reverses the order of list items (only works with type="ordered")
   *
   * @default false
   */
  reversed?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface ListSlots {
  /** Component content. */
  default?: () => VNodeChild
  /** Custom marker inherited by list items. */
  icon?: () => VNodeChild
}

export interface ListProps extends Omit<BoxProps, keyof ListOwnProps>, ListOwnProps {}

export type ListStylesNames = 'root' | 'item' | 'itemWrapper' | 'itemIcon' | 'itemLabel'
export type ListCssVariables = { root: '--list-fz' | '--list-lh' | '--list-spacing' }
