import TourComponent, { varsResolver } from './Tour.vue'
import TourRoot from './TourRoot.vue'
import TourStep from './TourStep.vue'
import TourOverlay from './TourOverlay.vue'
import TourTooltip from './TourTooltip.vue'
import TourBeacon from './TourBeacon.vue'
import TourTitle from './TourTitle.vue'
import TourBody from './TourBody.vue'
import TourCloseButton from './TourCloseButton.vue'
import TourNavigation from './TourNavigation.vue'
import classes from './Tour.module.css'

export {
  TourRoot,
  TourStep,
  TourOverlay,
  TourTooltip,
  TourBeacon,
  TourTitle,
  TourBody,
  TourCloseButton,
  TourNavigation,
}
export const Tour = Object.assign(TourComponent, {
  classes,
  varsResolver,
  Root: TourRoot,
  Step: TourStep,
  Overlay: TourOverlay,
  Tooltip: TourTooltip,
  Beacon: TourBeacon,
  Title: TourTitle,
  Body: TourBody,
  CloseButton: TourCloseButton,
  Navigation: TourNavigation,
})
export type * from './Tour.types'
