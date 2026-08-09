import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { TextCssVariables, TextStylesNames } from '../Text'
import type { BoxProps, StylesApiProps, PolymorphicFactory, MantineElementType } from '../../core'
import type { TextVariant } from '../Text/Text'

export type AnchorVariant = TextVariant

/** Props declared by `Anchor` itself. See `AnchorProps` for the full public type. */
export interface AnchorOwnProps extends StylesApiProps<AnchorProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `Anchor`.
   *
   * @default 'a'
   */
  component?: MantineElementType

  /**
   * Defines when `text-decoration: underline` styles are applied.
   *
   * @default 'hover'
   */
  underline?: 'always' | 'hover' | 'not-hover' | 'never'

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: AnchorVariant
}

export interface AnchorProps extends Omit<BoxProps, keyof AnchorOwnProps>, AnchorOwnProps {}

export interface AnchorSlots {
  /** Link content. */
  default?: () => VNodeChild
}

export type AnchorStylesNames = TextStylesNames

export type AnchorCssVariables = TextCssVariables

/** Public contract of `Anchor`. `component` and `rootRef` come from the factory. */
export type AnchorFactory = PolymorphicFactory<{
  props: Omit<AnchorProps, 'component' | 'rootRef'>
  slots: AnchorSlots
  ref: HTMLAnchorElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'a'
  defaultRef: HTMLAnchorElement
  stylesNames: AnchorStylesNames
  vars: AnchorCssVariables
  variant: AnchorVariant
}>
