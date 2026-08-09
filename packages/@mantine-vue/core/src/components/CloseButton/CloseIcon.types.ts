import type { SVGAttributes } from 'vue'

/** Props declared by `CloseIcon` itself. See `CloseIconProps` for the full public type. */
export interface CloseIconOwnProps {
  /** Icon width and height. @default 'var(--cb-icon-size, 70%)' */
  size?: string
}

export interface CloseIconProps
  extends Omit<SVGAttributes, keyof CloseIconOwnProps>, CloseIconOwnProps {}
