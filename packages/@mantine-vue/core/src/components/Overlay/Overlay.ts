import { withBoxProps } from '../../core'
import OverlayComponent from './Overlay.vue'

export const Overlay = withBoxProps(OverlayComponent)

export type { OverlayOwnProps, OverlayProps } from './Overlay.types'
