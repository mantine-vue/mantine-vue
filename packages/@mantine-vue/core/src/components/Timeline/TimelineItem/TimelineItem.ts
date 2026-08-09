import { withBoxProps } from '../../../core'
import TimelineItemComponent from './TimelineItem.vue'
import classes from '../Timeline.module.css'

export const TimelineItem = withBoxProps(Object.assign(TimelineItemComponent, { classes }))

export type {
  TimelineItemOwnProps,
  TimelineItemProps,
  TimelineItemSlots,
  TimelineItemStylesNames,
} from './TimelineItem.types'
