import { withBoxProps } from '../../core'
import NotificationComponent, { varsResolver } from './Notification.vue'
import classes from './Notification.module.css'

export const Notification = withBoxProps(NotificationComponent)
Object.assign(Notification, { classes, varsResolver })

export type {
  NotificationOwnProps,
  NotificationProps,
  NotificationSlots,
  NotificationStylesNames,
} from './Notification.types'
