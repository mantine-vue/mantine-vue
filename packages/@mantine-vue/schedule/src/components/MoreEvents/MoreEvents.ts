import { factory } from '@mantine-vue/core'
import MoreEventsComponent from './MoreEvents.vue'
import type { MoreEventsFactory } from './MoreEvents.types'
import classes from './MoreEvents.module.css'

export const MoreEvents = factory<MoreEventsFactory>(MoreEventsComponent, { classes })

export type {
  MoreEventsDropdownType,
  MoreEventsEmits,
  MoreEventsFactory,
  MoreEventsOwnProps,
  MoreEventsProps,
  MoreEventsSlots,
  MoreEventsStylesNames,
} from './MoreEvents.types'
