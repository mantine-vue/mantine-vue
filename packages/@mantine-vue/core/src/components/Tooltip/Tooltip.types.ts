import type { FloatingPosition } from '../../utils/Floating'

export type TooltipStylesNames = 'tooltip' | 'arrow'
export type TooltipCssVariables = '--tooltip-radius' | '--tooltip-bg' | '--tooltip-color'
export interface TooltipMiddlewares {
  shift?: boolean | Record<string, any>
  flip?: boolean | Record<string, any>
  inline?: boolean | Record<string, any>
  size?: boolean | Record<string, any>
}
export interface TooltipBaseProps {
  label: any
  position?: FloatingPosition
  refProp?: string
  withinPortal?: boolean
  radius?: string | number
  color?: string
  multiline?: boolean
  zIndex?: string | number
  disabled?: boolean
  portalProps?: Record<string, any>
  middlewares?: TooltipMiddlewares
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
}
