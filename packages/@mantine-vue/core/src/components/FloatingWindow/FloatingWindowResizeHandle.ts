import { withBoxProps } from '../../core'
import FloatingWindowResizeHandleComponent from './FloatingWindowResizeHandle.vue'

export const FloatingWindowResizeHandle = withBoxProps(FloatingWindowResizeHandleComponent)

export type {
  FloatingWindowResizeHandleOwnProps,
  FloatingWindowResizeHandleProps,
  FloatingWindowResizeHandleSlots,
} from './FloatingWindowResizeHandle.types'
