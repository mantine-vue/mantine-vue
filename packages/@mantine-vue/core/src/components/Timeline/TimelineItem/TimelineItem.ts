import { factory } from '../../../core'
import TimelineItemComponent from './TimelineItem.vue'
import type { TimelineItemFactory } from './TimelineItem.types'
import classes from '../Timeline.module.css'

export const TimelineItem = factory<TimelineItemFactory>(TimelineItemComponent, {
  classes,
})

export type {
  TimelineItemFactory,
  TimelineItemOwnProps,
  TimelineItemProps,
  TimelineItemSlots,
  TimelineItemStylesNames,
} from './TimelineItem.types'
