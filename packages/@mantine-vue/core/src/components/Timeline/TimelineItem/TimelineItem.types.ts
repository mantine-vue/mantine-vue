import type { CSSProperties, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  ClassNames,
  MantineColor,
  MantineNode,
  MantineRadius,
  Styles,
} from '../../../core'
import type { TimelineStylesNames } from '../Timeline.types'

export type TimelineItemStylesNames = Extract<
  TimelineStylesNames,
  'itemBody' | 'itemContent' | 'itemBullet' | 'item' | 'itemTitle' | 'itemOpposite'
>

export interface TimelineItemSlots {
  /** Content displayed below the title. */
  default?: () => VNodeChild

  /** Item title, displayed next to the bullet. Takes precedence over the `title` prop. */
  title?: () => VNodeChild

  /** Content rendered inside the bullet. Takes precedence over the `bullet` prop. */
  bullet?: () => VNodeChild

  /** Content displayed on the opposite side of the item. Takes precedence over the `opposite` prop. */
  opposite?: () => VNodeChild
}

/**
 * Props declared by `TimelineItem` itself.
 * See `TimelineItemProps` for the full public type.
 */
export interface TimelineItemOwnProps {
  /**
   * Active state assigned by the parent `Timeline` from its `active` index.
   * Set by `Timeline`; the explicit `active` prop takes precedence.
   *
   * @default false
   */
  __active?: boolean

  /**
   * Line active state assigned by the parent `Timeline` from its `active` index.
   * Set by `Timeline`; the explicit `lineActive` prop takes precedence.
   *
   * @default false
   */
  __lineActive?: boolean

  /** Content position assigned by the parent `Timeline` from its `align` prop. */
  __align?: 'right' | 'left'

  /**
   * If set, the item is marked as active regardless of the parent `Timeline` `active` index.
   * Falls back to the value derived by `Timeline` when not set.
   */
  active?: boolean

  /**
   * If set, the line leading to the item is marked as active regardless of the parent
   * `Timeline` `active` index. Falls back to the value derived by `Timeline` when not set.
   */
  lineActive?: boolean

  /**
   * Item title, displayed next to the bullet.
   * Can also be set with the `title` slot – the slot takes precedence.
   */
  title?: MantineNode

  /**
   * Content rendered inside the bullet – icon, image, avatar, etc.
   * A large filled dot is displayed by default.
   * Can also be set with the `bullet` slot – the slot takes precedence.
   */
  bullet?: MantineNode

  /**
   * Content displayed on the opposite side of the timeline item.
   * Can also be set with the `opposite` slot – the slot takes precedence.
   */
  opposite?: MantineNode

  /**
   * If set, switches the position of content and opposite.
   *
   * @default false
   */
  alternate?: boolean

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem.
   *
   * @default 'xl'
   */
  radius?: MantineRadius

  /**
   * Key of `theme.colors` or any valid CSS color to control active item colors.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls line border style.
   *
   * @default 'solid'
   */
  lineVariant?: 'solid' | 'dashed' | 'dotted'

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to the compound selectors the item renders. */
  classNames?: ClassNames<TimelineItemProps>

  /** Inline styles applied to the compound selectors the item renders. */
  styles?: Styles<TimelineItemProps>

  /** Class added to the root element. Merged with the fallthrough `class` attribute. */
  className?: string

  /** Inline style added to the root element. Merged with the fallthrough `style` attribute. */
  style?: CSSProperties
}

export interface TimelineItemProps
  extends Omit<BoxProps, keyof TimelineItemOwnProps>, TimelineItemOwnProps {}
