import type { VNodeChild } from 'vue'
import type { BoxProps, MantineSize, StylesApiProps, Factory } from '../../../core'

/** Props declared by `InputClearButton` itself. See `InputClearButtonProps` for the full public type. */
export interface InputClearButtonOwnProps {
  /** Size of the button, by default value is based on input context */
  size?: MantineSize | (string & {})

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: string

  /** Class names applied to the clear button. */
  classNames?: StylesApiProps<InputClearButtonFactory>['classNames']

  /** Inline styles applied to the clear button. */
  styles?: StylesApiProps<InputClearButtonFactory>['styles']
}

export interface InputClearButtonSlots {
  /** Content rendered after the close icon. */
  default?: () => VNodeChild
}

export interface InputClearButtonProps
  extends Omit<BoxProps, keyof InputClearButtonOwnProps>, InputClearButtonOwnProps {}

export type InputClearButtonFactory = Factory<{
  props: InputClearButtonProps
  slots: InputClearButtonSlots
  ref: HTMLButtonElement
  exposed: { rootElement: Element | null }
  element: 'button'
}>
