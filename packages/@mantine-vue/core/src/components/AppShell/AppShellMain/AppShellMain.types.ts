import type { VNodeChild } from 'vue'
import type { BoxProps, ClassNames, Styles, Vars, Factory } from '../../../core'

export type AppShellMainStylesNames = 'main'

/** Props declared by `AppShellMain` itself. See `AppShellMainProps` for the full public type. */
export interface AppShellMainOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class name assigned to the `main` Styles API selector. */
  classNames?: ClassNames<AppShellMainProps>

  /** Inline styles assigned to the `main` Styles API selector. */
  styles?: Styles<AppShellMainProps>

  /** CSS variables accepted for compatibility with the compound Styles API. */
  vars?: Vars<AppShellMainProps>
}

export interface AppShellMainSlots {
  /** Main application content. */
  default?: () => VNodeChild
}

export interface AppShellMainProps
  extends Omit<BoxProps, keyof AppShellMainOwnProps>, AppShellMainOwnProps {}

export type AppShellMainFactory = Factory<{
  props: Omit<AppShellMainProps, 'rootRef'>
  ref: HTMLElement
  slots: AppShellMainSlots
  element: 'main'
  stylesNames: AppShellMainStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
