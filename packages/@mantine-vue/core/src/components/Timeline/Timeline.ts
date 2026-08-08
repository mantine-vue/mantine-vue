import { withBoxProps } from '../../core'
import { TimelineItem } from './TimelineItem/TimelineItem'
import TimelineComponent, { varsResolver } from './Timeline.vue'
import classes from './Timeline.module.css'
export const Timeline = withBoxProps(
  Object.assign(TimelineComponent, { classes, varsResolver, Item: TimelineItem }),
)
export type {
  TimelineCssVariables,
  TimelineOwnProps,
  TimelineProps,
  TimelineSlots,
  TimelineStylesNames,
} from './Timeline.types'
