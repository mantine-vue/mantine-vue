import { factory } from '@mantine-vue/core'
import CurrentTimeIndicatorComponent, { varsResolver } from './CurrentTimeIndicator.vue'
import type { CurrentTimeIndicatorFactory } from './CurrentTimeIndicator.types'
import classes from './CurrentTimeIndicator.module.css'

export const CurrentTimeIndicator = factory<CurrentTimeIndicatorFactory>(
  CurrentTimeIndicatorComponent,
  { classes, varsResolver },
)

export type {
  CurrentTimeIndicatorCssVariables,
  CurrentTimeIndicatorFactory,
  CurrentTimeIndicatorOwnProps,
  CurrentTimeIndicatorProps,
  CurrentTimeIndicatorStylesNames,
} from './CurrentTimeIndicator.types'
