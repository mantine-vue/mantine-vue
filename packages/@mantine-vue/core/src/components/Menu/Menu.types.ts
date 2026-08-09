import type { VNodeChild } from 'vue'
import type { MantineNode, SectionSlots } from '../../core'
import type { PopoverProps } from '../Popover/Popover.types'
import type { FloatingPosition } from '../../utils/Floating'

export type MenuStylesNames =
  | 'item'
  | 'itemLabel'
  | 'itemSection'
  | 'itemIndicator'
  | 'label'
  | 'divider'
  | 'chevron'
  | 'search'
  | 'dropdown'
  | 'arrow'
  | 'overlay'

export interface MenuSlots {
  /** `Menu.Target` and `Menu.Dropdown`. */
  default?: () => VNodeChild
}

/**
 * Props of `Menu`.
 *
 * `Menu` renders a `Popover`, so every `Popover` prop is accepted as well.
 */
export interface MenuProps extends PopoverProps {
  /**
   * If set, the menu closes when an item is clicked.
   *
   * @default true
   */
  closeOnItemClick?: boolean

  /**
   * If set, arrow key navigation wraps from the last item to the first and back.
   *
   * @default true
   */
  loop?: boolean

  /**
   * Event that opens the menu.
   *
   * @default 'click'
   */
  trigger?: 'click' | 'hover' | 'click-hover'

  /**
   * Delay in ms before the menu opens on hover.
   *
   * @default 0
   */
  openDelay?: number

  /**
   * Delay in ms before the menu closes on hover out.
   *
   * @default 100
   */
  closeDelay?: number

  /**
   * `tabindex` of the items. `-1` keeps them out of the tab order, which is what the
   * menu pattern expects.
   *
   * @default -1
   */
  menuItemTabIndex?: -1 | 0

  /**
   * If set, an invisible element receives the initial focus so the dropdown does not
   * steal it from the first item. Ignored when the dropdown contains a `Menu.Search`.
   *
   * @default true
   */
  withInitialFocusPlaceholder?: boolean

  /**
   * Which items reserve space for the check indicator, so their labels line up.
   * `with-indicators` only aligns items that can be checked.
   *
   * @default 'with-indicators'
   */
  alignItemsLabels?: 'all' | 'with-indicators' | 'none'

  /** Icon rendered next to a checked item. Defaults to a check mark. */
  checkIcon?: MantineNode
}

/** Props of `Menu.Target`. */
export interface MenuTargetProps {
  /**
   * Name of the prop the reference ref is passed to on the child.
   *
   * @default 'ref'
   */
  refProp?: string

  /** Any other prop is forwarded to `Popover.Target`. */
  [key: string]: any
}

/** Props of `Menu.Dropdown`. Every prop is forwarded to `Popover.Dropdown`. */
export interface MenuDropdownProps {
  [key: string]: any
}

export interface MenuItemSlots extends SectionSlots {
  /** Label of the item. */
  default?: () => VNodeChild
}

/** Props of `Menu.Item`. */
export interface MenuItemProps {
  /**
   * Element or component rendered as the item.
   *
   * @default 'button'
   */
  component?: any

  /** Key of `theme.colors` or any valid CSS color. */
  color?: string

  /** If set, overrides the menu-level `closeOnItemClick` for this item. */
  closeMenuOnClick?: boolean

  /**
   * Content on the left side of the label.
   * Can also be set with the `leftSection` slot.
   */
  leftSection?: MantineNode

  /**
   * Content on the right side of the label.
   * Can also be set with the `rightSection` slot.
   */
  rightSection?: MantineNode

  /** Content of the check indicator. Set by `Menu.CheckboxItem` and `Menu.RadioItem`. */
  indicator?: any

  /**
   * If set, the item cannot be selected and is skipped by the keyboard navigation.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the item reserves the indicator space even without an indicator, so its
   * label lines up with the checkable items.
   *
   * @default false
   */
  reserveIndicator?: boolean

  /** Any other prop is forwarded to the item element. */
  [key: string]: any
}

/** Props of `Menu.Label`, a non-interactive heading inside the dropdown. */
export interface MenuLabelProps {
  [key: string]: any
}

/** Props of `Menu.Divider`. */
export interface MenuDividerProps {
  [key: string]: any
}

/** Props of `Menu.Search`, a filter field rendered inside the dropdown. */
export interface MenuSearchProps {
  /** Search value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial search value. */
  defaultValue?: string

  /**
   * If set, the search is cleared when the menu closes.
   *
   * @default true
   */
  clearSearchOnClose?: boolean

  /** Any other prop is forwarded to the underlying `Input`. */
  [key: string]: any
}

/** Payload passed to the `checkIcon` slot of the checkable items. */
export interface MenuCheckIconSlotProps {
  /** Checked state of the item. */
  checked: boolean
}

export interface MenuCheckboxItemSlots {
  /** Label of the item. */
  default?: () => VNodeChild

  /** Content on the left side of the label. */
  leftSection?: () => VNodeChild

  /** Content on the right side of the label. */
  rightSection?: () => VNodeChild

  /** Icon rendered when the item is checked. */
  checkIcon?: (payload: MenuCheckIconSlotProps) => VNodeChild
}

/** Props of `Menu.CheckboxItem`. */
export interface MenuCheckboxItemProps {
  /** Value of the item within a `Menu.CheckboxGroup`. */
  value?: string

  /** Checked state. Ignored inside a `Menu.CheckboxGroup`. */
  checked?: boolean

  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean

  /**
   * Icon rendered when the item is checked.
   * Can also be set with the scoped `checkIcon` slot – the slot takes precedence.
   */
  checkIcon?: MantineNode

  /**
   * If set, the menu closes when the item is clicked. Off by default, since toggling
   * several options in a row is the usual case.
   *
   * @default false
   */
  closeMenuOnClick?: boolean

  /** Any other prop is forwarded to the underlying `Menu.Item`. */
  [key: string]: any
}

/** Props of `Menu.CheckboxGroup`. */
export interface MenuCheckboxGroupProps {
  /** Checked values, bound with `v-model`. */
  modelValue?: string[]

  /**
   * Uncontrolled initial values.
   *
   * @default []
   */
  defaultValue?: string[]
}

export interface MenuRadioItemSlots {
  /** Label of the item. */
  default?: () => VNodeChild

  /** Content on the left side of the label. */
  leftSection?: () => VNodeChild

  /** Content on the right side of the label. */
  rightSection?: () => VNodeChild

  /** Icon rendered when the item is selected. */
  checkIcon?: (payload: MenuCheckIconSlotProps) => VNodeChild
}

/** Props of `Menu.RadioItem`. */
export interface MenuRadioItemProps {
  /** Value of the item within a `Menu.RadioGroup`. */
  value: string

  /** Selected state. Ignored inside a `Menu.RadioGroup`. */
  checked?: boolean

  /**
   * Icon rendered when the item is selected.
   * Can also be set with the scoped `checkIcon` slot – the slot takes precedence.
   */
  checkIcon?: MantineNode

  /**
   * If set, the menu closes when the item is clicked.
   *
   * @default false
   */
  closeMenuOnClick?: boolean

  /** Any other prop is forwarded to the underlying `Menu.Item`. */
  [key: string]: any
}

/** Props of `Menu.RadioGroup`. */
export interface MenuRadioGroupProps {
  /** Selected value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial value. */
  defaultValue?: string
}

/** Props of `Menu.ContextMenu`, which opens the menu on right click or long press. */
export interface MenuContextMenuProps {
  /**
   * If set, the context menu does not open.
   *
   * @default false
   */
  disabled?: boolean

  /** Time in ms a touch has to be held before the menu opens. */
  longPressDelay?: number

  /** Any other prop is forwarded to `Popover.ContextMenu`. */
  [key: string]: any
}

/** Props of `Menu.Sub`, a nested menu opened from a `Menu.Sub.Target`. */
export interface MenuSubProps {
  /** Open state. Controlled when set, bound with `v-model:opened`. */
  opened?: boolean

  /** Uncontrolled initial open state. */
  defaultOpened?: boolean

  /**
   * Delay in ms before the submenu opens on hover.
   *
   * @default 100
   */
  openDelay?: number

  /**
   * Delay in ms before the submenu closes on hover out.
   *
   * @default 100
   */
  closeDelay?: number

  /**
   * Side the submenu is rendered on.
   *
   * @default 'right-start'
   */
  position?: FloatingPosition

  /**
   * Distance between the submenu and its parent item.
   *
   * @default 0
   */
  offset?: number | Record<string, any>

  /**
   * Props passed down to the `Transition`.
   *
   * @default { duration: 0 }
   */
  transitionProps?: Record<string, any>

  /**
   * Floating UI middlewares applied to the submenu.
   *
   * @default { shift: { crossAxis: true } }
   */
  middlewares?: Record<string, any>

  /** Any other prop is forwarded to the underlying `Menu`. */
  [key: string]: any
}

export type MenuSubTargetProps = MenuTargetProps

export type MenuSubDropdownProps = MenuDropdownProps

export type MenuSubItemProps = MenuItemProps
