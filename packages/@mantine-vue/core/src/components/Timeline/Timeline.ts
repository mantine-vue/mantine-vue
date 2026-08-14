import { factory } from '../../core'
import { TimelineItem } from './TimelineItem/TimelineItem'
import type { TimelineFactory } from './Timeline.types'
import TimelineComponent, { varsResolver } from './Timeline.vue'
import classes from './Timeline.module.css'
export const Timeline = factory<TimelineFactory>(TimelineComponent, {
  classes,
  varsResolver,
  Item: TimelineItem,
})
export type {
  TimelineCssVariables,
  TimelineFactory,
  TimelineOwnProps,
  TimelineProps,
  TimelineSlots,
  TimelineStylesNames,
} from './Timeline.types'
