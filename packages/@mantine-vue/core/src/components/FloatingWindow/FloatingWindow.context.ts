import type { Ref } from 'vue'
import { createSafeContext } from '../../core'

export interface FloatingWindowDimensions {
  initialWidth?: number
  minWidth?: number
  maxWidth?: number
  initialHeight?: number
  minHeight?: number
  maxHeight?: number
}

export interface FloatingWindowSize {
  width: number
  height: number
}

export interface FloatingWindowContextValue {
  rootRef: Ref<HTMLDivElement | null>
  dimensions?: FloatingWindowDimensions
  constrainToViewport?: boolean
  constrainOffset?: number
  onResizeStart?: () => void
  onResizeEnd?: () => void
  onSizeChange?: (size: FloatingWindowSize) => void
}

export const [provideFloatingWindowContext, useFloatingWindowContext] =
  createSafeContext<FloatingWindowContextValue>(
    'FloatingWindow.ResizeHandle must be used within FloatingWindow',
  )
