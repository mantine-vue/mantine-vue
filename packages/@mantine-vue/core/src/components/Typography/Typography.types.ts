import type { BoxProps, StylesApiProps } from '../../core'

export type TypographyStylesNames = 'root'

/** Props declared by `Typography` itself. See `TypographyProps` for the full public type. */
export type TypographyOwnProps = StylesApiProps<TypographyProps>

export interface TypographyProps
  extends Omit<BoxProps, keyof TypographyOwnProps>, TypographyOwnProps {}
