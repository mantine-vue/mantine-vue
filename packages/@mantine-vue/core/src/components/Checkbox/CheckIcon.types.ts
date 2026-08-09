import type { SVGAttributes } from 'vue'

/** Props declared by `CheckIcon` itself. See `CheckIconProps` for the full public type. */
export interface CheckIconOwnProps {
  /** Icon width and height. If omitted, sizing is controlled by CSS or forwarded attributes. */
  size?: number | string
}

export interface CheckIconProps
  extends Omit<SVGAttributes, keyof CheckIconOwnProps>, CheckIconOwnProps {}

/** Props declared by `CheckboxIcon` itself. See `CheckboxIconProps` for the full public type. */
export interface CheckboxIconOwnProps {
  /** Determines whether the indeterminate icon is displayed. @default false */
  indeterminate?: boolean
}

export interface CheckboxIconProps
  extends Omit<SVGAttributes, keyof CheckboxIconOwnProps>, CheckboxIconOwnProps {}
