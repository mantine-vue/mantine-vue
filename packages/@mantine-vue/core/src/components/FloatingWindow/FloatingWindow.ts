import FloatingWindowComponent from './FloatingWindow.vue'
import { FloatingWindowResizeHandle } from './FloatingWindowResizeHandle'
import classes from './FloatingWindow.module.css'

export const FloatingWindow = Object.assign(FloatingWindowComponent, {
  classes,
  ResizeHandle: FloatingWindowResizeHandle,
})

export type {
  FloatingWindowOwnProps,
  FloatingWindowProps,
  FloatingWindowSlots,
  FloatingWindowStylesNames,
} from './FloatingWindow.types'
