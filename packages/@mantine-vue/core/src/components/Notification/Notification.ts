import { factory } from '../../core'
import NotificationComponent, { varsResolver } from './Notification.vue'
import type { NotificationFactory } from './Notification.types'
import classes from './Notification.module.css'

export const Notification = factory<NotificationFactory>(NotificationComponent, {
  classes,
  varsResolver,
})

export type {
  NotificationCssVariables,
  NotificationFactory,
  NotificationOwnProps,
  NotificationProps,
  NotificationSlots,
  NotificationStylesNames,
} from './Notification.types'
