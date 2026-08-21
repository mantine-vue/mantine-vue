import { factory } from '@mantine-vue/core'
import MobileMonthViewComponent, { varsResolver } from './MobileMonthView.vue'
import type { MobileMonthViewFactory } from './MobileMonthView.types'
import classes from './MobileMonthView.module.css'

export const MobileMonthView = factory<MobileMonthViewFactory>(MobileMonthViewComponent, {
  classes,
  varsResolver,
})

export type {
  MobileMonthViewCssVariables,
  MobileMonthViewEmits,
  MobileMonthViewFactory,
  MobileMonthViewHeaderPayload,
  MobileMonthViewOwnProps,
  MobileMonthViewProps,
  MobileMonthViewSlots,
  MobileMonthViewStylesNames,
} from './MobileMonthView.types'
