import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, PolymorphicFactory, MantineElementType } from '../../core'

export type CenterStylesNames = 'root'

export interface CenterSlots {
  /** Content to center. */
  default?: () => VNodeChild
}

/** Props declared by `Center` itself. See `CenterProps` for the full public type. */
export interface CenterOwnProps extends StylesApiProps<CenterProps> {
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
  props: Omit<CenterProps, 'component'>
  slots: CenterSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: CenterStylesNames
}>
