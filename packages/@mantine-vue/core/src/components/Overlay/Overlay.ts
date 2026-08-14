import { polymorphicFactory } from '../../core'
import OverlayComponent, { varsResolver } from './Overlay.vue'
import type { OverlayFactory } from './Overlay.types'
import classes from './Overlay.module.css'

export const Overlay = polymorphicFactory<OverlayFactory>(OverlayComponent, {
  classes,
  varsResolver,
})

export type {
  OverlayCssVariables,
  OverlayFactory,
  OverlayOwnProps,
  OverlayProps,
  OverlaySlots,
  OverlayStylesNames,
} from './Overlay.types'
