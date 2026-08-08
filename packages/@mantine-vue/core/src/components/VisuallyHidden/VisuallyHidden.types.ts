import type { BoxProps, StylesApiProps } from '../../core'

export type VisuallyHiddenStylesNames = 'root'

/** Props declared by `VisuallyHidden` itself. See `VisuallyHiddenProps` for the full public type. */
export type VisuallyHiddenOwnProps = StylesApiProps<VisuallyHiddenProps>

export interface VisuallyHiddenProps
  extends Omit<BoxProps, keyof VisuallyHiddenOwnProps>, VisuallyHiddenOwnProps {}
