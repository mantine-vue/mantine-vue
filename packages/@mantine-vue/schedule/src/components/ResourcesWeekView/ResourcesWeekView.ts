import { factory } from '@mantine-vue/core'
import ResourcesWeekViewComponent, { varsResolver } from './ResourcesWeekView.vue'
import type { ResourcesWeekViewFactory } from './ResourcesWeekView.types'
import classes from './ResourcesWeekView.module.css'

export const ResourcesWeekView = factory<ResourcesWeekViewFactory>(ResourcesWeekViewComponent, {
  classes,
  varsResolver,
})

export type {
  ResourcesWeekViewCssVariables,
  ResourcesWeekViewEmits,
  ResourcesWeekViewFactory,
  ResourcesWeekViewOwnProps,
  ResourcesWeekViewOwnStylesNames,
  ResourcesWeekViewProps,
  ResourcesWeekViewSlots,
  ResourcesWeekViewStylesNames,
} from './ResourcesWeekView.types'
