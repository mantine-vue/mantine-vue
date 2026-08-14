import type { AppShellSection } from './AppShellSection/AppShellSection'
import type { AppShellFooter } from './AppShellFooter/AppShellFooter'
import type { AppShellAside } from './AppShellAside/AppShellAside'
import type { AppShellMain } from './AppShellMain/AppShellMain'
import type { AppShellHeader } from './AppShellHeader/AppShellHeader'
import type { AppShellNavbar } from './AppShellNavbar/AppShellNavbar'
import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps, Factory } from '../../core'

export type AppShellSize = number | string
export interface AppShellResponsiveSize {
  base?: AppShellSize
  xs?: AppShellSize
  sm?: AppShellSize
  md?: AppShellSize
  lg?: AppShellSize
  xl?: AppShellSize
  [key: string]: AppShellSize | undefined
}
export type AppShellMode = 'fixed' | 'static'
export interface AppShellNavbarConfiguration {
  width: AppShellSize | AppShellResponsiveSize
  breakpoint: string | number
  collapsed?: { desktop?: boolean; mobile?: boolean }
}
export interface AppShellAsideConfiguration {
  width: AppShellSize | AppShellResponsiveSize
  breakpoint: string | number
  collapsed?: { desktop?: boolean; mobile?: boolean }
}
export interface AppShellHeaderConfiguration {
  height: AppShellSize | AppShellResponsiveSize
  collapsed?: boolean
  offset?: boolean
}
export interface AppShellFooterConfiguration {
  height: AppShellSize | AppShellResponsiveSize
  collapsed?: boolean
  offset?: boolean
}
export interface AppShellCompoundProps {
  withBorder?: boolean
  zIndex?: string | number
}

/** Slots of `AppShell`. */
export interface AppShellSlots {
  /** `AppShell.Header`, `AppShell.Navbar`, `AppShell.Main` and the other sections. */
  default?: () => VNodeChild
}

/** Props declared by `AppShell` itself. See `AppShellProps` for the full public type. */
export interface AppShellOwnProps extends StylesApiProps<AppShellFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * If set, associated components have a border.
   *
   * @default true
   */
  withBorder?: boolean

  /**
   * Padding of the main section. Should be the same as the size of the fixed sections.
   *
   * @default 0
   */
  padding?: AppShellSize | AppShellResponsiveSize

  /** Navbar configuration. The navbar is not rendered when not set. */
  navbar?: AppShellNavbarConfiguration

  /** Aside configuration. The aside is not rendered when not set. */
  aside?: AppShellAsideConfiguration

  /** Header configuration. The header is not rendered when not set. */
  header?: AppShellHeaderConfiguration

  /** Footer configuration. The footer is not rendered when not set. */
  footer?: AppShellFooterConfiguration

  /**
   * Duration of the collapse and resize transitions in ms.
   *
   * @default 200
   */
  transitionDuration?: number

  /**
   * Timing function of the collapse and resize transitions.
   *
   * @default 'ease'
   */
  transitionTimingFunction?: string

  /**
   * `z-index` of all associated components.
   *
   * @default getDefaultZIndex('app')
   */
  zIndex?: string | number

  /**
   * Determines how the navbar and the aside are positioned relative to the header
   * and the footer. `alt` makes them span the full height.
   *
   * @default 'default'
   */
  layout?: 'default' | 'alt'

  /**
   * If set, all associated components are hidden and their offsets removed.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the main section is offset by the scrollbar width to avoid a layout
   * shift when the scrollbar appears.
   *
   * @default true
   */
  offsetScrollbars?: boolean

  /**
   * Positioning strategy of the associated components.
   *
   * @default 'fixed'
   */
  mode?: AppShellMode

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface AppShellProps extends Omit<BoxProps, keyof AppShellOwnProps>, AppShellOwnProps {}

export type AppShellStylesNames = 'root'

export type AppShellCssVariables = {
  root: '--app-shell-transition-duration'
}

export type AppShellFactory = Factory<{
  props: Omit<AppShellProps, 'rootRef'>
  ref: HTMLDivElement
  slots: AppShellSlots
  element: 'div'
  stylesNames: AppShellStylesNames
  vars: AppShellCssVariables
  staticComponents: {
    Navbar: typeof AppShellNavbar
    Header: typeof AppShellHeader
    Main: typeof AppShellMain
    Aside: typeof AppShellAside
    Footer: typeof AppShellFooter
    Section: typeof AppShellSection
  }
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
