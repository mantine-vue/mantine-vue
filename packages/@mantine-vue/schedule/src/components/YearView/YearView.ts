import { factory } from '@mantine-vue/core'
import YearViewComponent, { varsResolver } from './YearView.vue'
import type { YearViewFactory } from './YearView.types'
import classes from './YearView.module.css'

export const YearView = factory<YearViewFactory>(YearViewComponent, { classes, varsResolver })

export type {
  YearViewCssVariables,
  YearViewEmits,
  YearViewFactory,
  YearViewOwnProps,
  YearViewOwnStylesNames,
  YearViewProps,
  YearViewStylesNames,
} from './YearView.types'
