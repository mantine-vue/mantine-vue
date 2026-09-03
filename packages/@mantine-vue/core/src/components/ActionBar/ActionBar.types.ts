import type { VueRefTarget } from '@mantine-vue/hooks'
import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  Factory,
  MantineRadius,
  MantineShadow,
  MantineSpacing,
  StylesApiProps,
} from '../../core'
import type { AffixPosition } from '../Affix'
import type { TransitionOverride } from '../Transition'
import type { ActionBarCloseButton } from './ActionBarCloseButton/ActionBarCloseButton'
import type { ActionBarDivider } from './ActionBarDivider/ActionBarDivider'

export type ActionBarStylesNames = 'root' | 'divider' | 'closeButton'

export interface ActionBarOwnProps extends StylesApiProps<ActionBarFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>
  /** Controls visibility. */
  opened: boolean
  /** Props passed to the transition. @default { transition: 'pop', duration: 200 } */
  transitionProps?: TransitionOverride
  /** Key of `theme.shadows` or any valid `box-shadow` value. */
  shadow?: MantineShadow
  /** Key of `theme.radius` or any valid CSS value. */
  radius?: MantineRadius
  /** Adds a border to the action bar. @default true */
  withBorder?: boolean
  /** Vertical padding. @default 'xs' */
  py?: MantineSpacing
  /** Horizontal padding. @default 'sm' */
  px?: MantineSpacing
  /** Fixed position of the action bar. @default { bottom: 30, left: 0, right: 0 } */
  position?: AffixPosition
  /** Root z-index. @default getDefaultZIndex('modal') */
  zIndex?: string | number
  /** Determines whether the action bar is rendered in a portal. @default true */
  withinPortal?: boolean
  /** Props passed to the portal. */
  portalProps?: Record<string, any>
  /** Closes the action bar when Escape is pressed. @default false */
  closeOnEscape?: boolean
  /** Keeps the root node mounted with `display: none` when closed. @default false */
  keepMounted?: boolean
}

export interface ActionBarProps
  extends Omit<BoxProps, keyof ActionBarOwnProps>, ActionBarOwnProps {}

export interface ActionBarSlots {
  default?: () => VNodeChild
}

export interface ActionBarEmits {
  close: []
  'update:opened': [opened: boolean]
}

export type ActionBarFactory = Factory<{
  props: Omit<ActionBarProps, 'rootRef'>
  ref: HTMLDivElement
  slots: ActionBarSlots
  emits: ActionBarEmits
  element: 'div'
  stylesNames: ActionBarStylesNames
  staticComponents: {
    Divider: typeof ActionBarDivider
    CloseButton: typeof ActionBarCloseButton
  }
}>
