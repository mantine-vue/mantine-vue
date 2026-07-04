import { createSafeContext } from '../../core'
import type { ArrowPosition, FloatingPosition, FloatingStrategy } from '../../utils/Floating'

export interface PopoverContextValue {
  opened: boolean
  controlled: boolean
  disabled?: boolean
  withRoles: boolean
  withArrow: boolean
  arrowSize: number
  arrowOffset: number
  arrowRadius: number
  arrowPosition: ArrowPosition
  placement: FloatingPosition
  x: number
  y: number
  targetWidth?: number
  arrowX?: number
  arrowY?: number
  reference: (node: any) => void
  floating: (node: any) => void
  arrowRef: (node: any) => void
  onToggle: () => void
  onClose: () => void
  onDismiss?: () => void
  getTargetId: () => string
  getDropdownId: () => string
  targetProps: Record<string, any>
  transitionProps?: Record<string, any>
  withinPortal: boolean
  portalProps?: Record<string, any>
  trapFocus: boolean
  closeOnEscape: boolean
  returnFocus: boolean
  keepMounted: boolean
  width: string | number | null
  zIndex: string | number
  floatingStrategy: FloatingStrategy
  getStyles: any
}
export const [providePopoverContext, usePopoverContext] = createSafeContext<PopoverContextValue>(
  'Popover component was not found in the tree',
)
