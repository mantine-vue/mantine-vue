import { factory } from '@mantine-vue/core'
import ResourcesMonthViewComponent, { varsResolver } from './ResourcesMonthView.vue'
import type { ResourcesMonthViewFactory } from './ResourcesMonthView.types'
import classes from './ResourcesMonthView.module.css'

export const ResourcesMonthView = factory<ResourcesMonthViewFactory>(ResourcesMonthViewComponent, {
  classes,
  varsResolver,
})

export type {
  ResourcesMonthViewCssVariables,
  ResourcesMonthViewDayClickData,
  ResourcesMonthViewEmits,
  ResourcesMonthViewFactory,
  ResourcesMonthViewOwnProps,
  ResourcesMonthViewOwnStylesNames,
  ResourcesMonthViewProps,
  ResourcesMonthViewSlots,
  ResourcesMonthViewStylesNames,
} from './ResourcesMonthView.types'
