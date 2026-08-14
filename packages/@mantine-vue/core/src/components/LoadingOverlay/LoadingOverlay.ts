import { factory } from '../../core'
import type { LoadingOverlayFactory } from './LoadingOverlay.types'
import LoadingOverlayComponent, { varsResolver } from './LoadingOverlay.vue'
import classes from './LoadingOverlay.module.css'

export const LoadingOverlay = factory<LoadingOverlayFactory>(LoadingOverlayComponent, {
  classes,
  varsResolver,
})

export type {
  LoadingOverlayCssVariables,
  LoadingOverlayFactory,
  LoadingOverlayOwnProps,
  LoadingOverlayProps,
  LoadingOverlayStylesNames,
} from './LoadingOverlay.types'
