import { withBoxProps } from '../../core'
import LoadingOverlayComponent, { varsResolver } from './LoadingOverlay.vue'
import classes from './LoadingOverlay.module.css'

export const LoadingOverlay = withBoxProps(LoadingOverlayComponent)
Object.assign(LoadingOverlay, { classes, varsResolver })

export type {
  LoadingOverlayOwnProps,
  LoadingOverlayProps,
  LoadingOverlayStylesNames,
} from './LoadingOverlay.types'
