import NotificationsComponent, { varsResolver } from './Notifications.vue'
import { notifications } from '../../notifications.store'
import classes from '../../Notifications.module.css'

export const Notifications = Object.assign(NotificationsComponent, {
  classes,
  varsResolver,
  show: notifications.show,
  hide: notifications.hide,
  update: notifications.update,
  clean: notifications.clean,
  cleanQueue: notifications.cleanQueue,
  updateState: notifications.updateState,
})

export type {
  NotificationsCssVariables,
  NotificationsProps,
  NotificationsStylesNames,
} from './Notifications.types'
