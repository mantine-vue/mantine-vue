import { factory } from '@mantine-vue/core'
import ViewSelectComponent from './ViewSelect.vue'
import type { ViewSelectFactory } from './ViewSelect.types'
import classes from './ViewSelect.module.css'

export const ViewSelect = factory<ViewSelectFactory>(ViewSelectComponent, { classes })

export type {
  ViewSelectEmits,
  ViewSelectFactory,
  ViewSelectOwnProps,
  ViewSelectProps,
  ViewSelectStylesNames,
} from './ViewSelect.types'
