import type {
  MantineColor,
  MantineNode,
  MantineRadius,
  MantineShadow,
  MantineStyle,
  MantineTheme,
} from '@mantine-vue/core'
import type { Ref, VNodeChild } from 'vue'

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

export type WithOptionalProperty<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>

export type ContextMenuStyle = MantineStyle | ((theme: MantineTheme) => MantineStyle)
export type ContextMenuStyles = Partial<Record<'root' | 'item' | 'divider', ContextMenuStyle>>

export interface ContextMenuOptions {
  /** The z-index of context menu. @default 9999 */
  zIndex?: number
  /** Context menu container class name. */
  className?: string
  /** Context menu container style. */
  style?: ContextMenuStyle
  /** Context menu elements class names. */
  classNames?: Partial<Record<'root' | 'item' | 'divider', string>>
  /** Context menu styles, or a function returning styles for the current theme. */
  styles?: ContextMenuStyles | ((theme: MantineTheme) => ContextMenuStyles)
}

export interface ContextMenuSettings {
  /** Context menu shadow. @default 'sm' */
  shadow?: MantineShadow
  /** Context menu border radius. @default 'xs' */
  borderRadius?: MantineRadius
  /** Delay in ms to use when showing and hiding submenus. @default 500 */
  submenuDelay?: number
  /** Whether repeated contextmenu events reposition the open menu. @default false */
  repositionOnRepeat?: boolean
}

export type ContextMenuProviderProps = ContextMenuSettings & ContextMenuOptions

interface ContextMenuItemBase {
  /** Unique key of the context menu item or divider. */
  key: string
  className?: string
  style?: ContextMenuStyle
  hidden?: boolean
}

interface ContextMenuActionBase {
  icon?: MantineNode
  iconRight?: MantineNode
  title?: MantineNode
  color?: MantineColor
  disabled?: boolean
}

export type ContextMenuItemOptions = ContextMenuItemBase &
  (
    | (ContextMenuActionBase & {
        onClick: (event: MouseEvent) => void
        items?: never
      })
    | (ContextMenuActionBase & {
        onClick?: never
        items: ContextMenuItemOptions[]
      })
    | {
        icon?: never
        iconRight?: never
        title?: never
        color?: never
        disabled?: never
        onClick?: never
        items?: never
      }
  )

export type ContextMenuContent = ContextMenuItemOptions[] | ((close: () => void) => VNodeChild)

export type ContextMenuEvent = MouseEvent | TouchEvent
export type ShowContextMenuFunction = (
  content: ContextMenuContent,
  options?: ContextMenuOptions,
) => (event: ContextMenuEvent) => void
export type HideContextMenuFunction = () => void

export interface ContextMenuContextValue {
  showContextMenu: ShowContextMenuFunction
  hideContextMenu: HideContextMenuFunction
  isContextMenuVisible: Readonly<Ref<boolean>>
}

export interface ContextMenuInstanceOptions {
  x: number
  y: number
  content: ContextMenuContent
}

export interface ContextMenuProps extends ContextMenuInstanceOptions, ContextMenuOptions {
  onHide: HideContextMenuFunction
  dir?: 'ltr' | 'rtl'
}

export interface ContextMenuPortalProps extends ContextMenuProps {
  zIndex?: number
  dir: 'ltr' | 'rtl'
}

export type ContextMenuSubmenuProps = Pick<
  ContextMenuOptions,
  'className' | 'classNames' | 'style' | 'styles'
> & {
  dir?: 'ltr' | 'rtl'
}

export type ContextMenuItemProps = WithRequiredProperty<
  Omit<ContextMenuItemOptions, 'key'>,
  'title'
> & {
  onHide: HideContextMenuFunction
  submenuProps: ContextMenuSubmenuProps
}

export interface ContextMenuDividerProps {
  className?: string
  style?: ContextMenuStyle
}
