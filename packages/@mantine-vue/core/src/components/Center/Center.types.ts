import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { BoxProps, StylesApiProps, PolymorphicFactory, MantineElementType } from '../../core'

export type CenterStylesNames = 'root'

export interface CenterSlots {
  /** Content to center. */
  default?: () => VNodeChild
}

/** Props declared by `Center` itself. See `CenterProps` for the full public type. */
export interface CenterOwnProps extends StylesApiProps<CenterProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `Center`.
   * @default 'div'
   */
  component?: MantineElementType

  /**
   * If set, `inline-flex` is used instead of `flex`.
   * @default false
   */
  inline?: boolean
}

export interface CenterProps extends Omit<BoxProps, keyof CenterOwnProps>, CenterOwnProps {}

/** Public contract of `Center`. `component` and `rootRef` come from the factory. */
export type CenterFactory = PolymorphicFactory<{
  props: Omit<CenterProps, 'component' | 'rootRef'>
  slots: CenterSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: CenterStylesNames
}>
