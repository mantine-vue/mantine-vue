import type { BoxProps, StylesApiProps, Factory } from '../../core'

export type VisuallyHiddenStylesNames = 'root'

/** Props declared by `VisuallyHidden` itself. See `VisuallyHiddenProps` for the full public type. */
export type VisuallyHiddenOwnProps = StylesApiProps<VisuallyHiddenFactory>

export interface VisuallyHiddenProps
  extends Omit<BoxProps, keyof VisuallyHiddenOwnProps>, VisuallyHiddenOwnProps {}

export type VisuallyHiddenFactory = Factory<{
  props: VisuallyHiddenProps
  element: 'span'
  stylesNames: VisuallyHiddenStylesNames
}>
