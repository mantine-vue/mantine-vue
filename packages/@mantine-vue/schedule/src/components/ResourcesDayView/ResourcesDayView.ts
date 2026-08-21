import { factory } from '@mantine-vue/core'
import ResourcesDayViewComponent, { varsResolver } from './ResourcesDayView.vue'
import type { ResourcesDayViewFactory } from './ResourcesDayView.types'
import classes from './ResourcesDayView.module.css'

export const ResourcesDayView = factory<ResourcesDayViewFactory>(ResourcesDayViewComponent, {
  classes,
  varsResolver,
})

export type {
  ResourceExternalDropData,
  ResourceSlotDragEndData,
  ResourceTimeSlotClickData,
  ResourceViewDropData,
  ResourcesDayViewCssVariables,
  ResourcesDayViewEmits,
  ResourcesDayViewFactory,
  ResourcesDayViewOwnProps,
  ResourcesDayViewOwnStylesNames,
  ResourcesDayViewProps,
  ResourcesDayViewSlots,
  ResourcesDayViewStylesNames,
} from './ResourcesDayView.types'
