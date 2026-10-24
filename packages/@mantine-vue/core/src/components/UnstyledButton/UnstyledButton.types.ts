import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  StylesApiProps,
  PolymorphicFactory,
  MantineElementType,
} from '../../core'

/** Props declared by `UnstyledButton` itself. See `UnstyledButtonProps` for the full public type. */
export interface UnstyledButtonOwnProps extends StylesApiProps<UnstyledButtonProps> {
  /**
   * Root element or component rendered by `UnstyledButton`.
   *
   * @default 'button'
   */
  component?: MantineElementType

  /**
   * Static selector used to build the component classes. Internal prop, not part of the public API.
   *
   * @internal
   */
  __staticSelector?: string

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface UnstyledButtonProps
  extends Omit<BoxProps, keyof UnstyledButtonOwnProps>, UnstyledButtonOwnProps {}
export interface UnstyledButtonSlots {
  default?: () => VNodeChild
}
export type UnstyledButtonStylesNames = 'root'

/** Public contract of `UnstyledButton`. `component` and `rootRef` come from the factory. */
export type UnstyledButtonFactory = PolymorphicFactory<{
  props: Omit<UnstyledButtonProps, 'component'>
  slots: UnstyledButtonSlots
  ref: HTMLButtonElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'button'
  defaultRef: HTMLButtonElement
  stylesNames: UnstyledButtonStylesNames
}>
