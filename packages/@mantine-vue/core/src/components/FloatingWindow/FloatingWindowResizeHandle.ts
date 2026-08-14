import { factory } from '../../core'
import FloatingWindowResizeHandleComponent from './FloatingWindowResizeHandle.vue'
import type { FloatingWindowResizeHandleFactory } from './FloatingWindowResizeHandle.types'

export const FloatingWindowResizeHandle = factory<FloatingWindowResizeHandleFactory>(
  FloatingWindowResizeHandleComponent,
)

export type {
  FloatingWindowResizeHandleOwnProps,
  FloatingWindowResizeHandleProps,
  FloatingWindowResizeHandleSlots,
  FloatingWindowResizeHandleFactory,
} from './FloatingWindowResizeHandle.types'
