import type { NotificationData } from '../../notifications.store'

/** Internal props accepted by `NotificationContainer`. */
export interface NotificationContainerProps {
  /** Notification data rendered by the container. */
  data: NotificationData
  /** Default auto-close timeout. */
  autoClose: number | false
  /** Exit transition duration in milliseconds. */
  transitionDuration: number
  /** Enables pointer-drag dismissal. */
  allowDragDismiss: boolean
  /** Enables horizontal scroll dismissal. */
  allowScrollDismiss: boolean
  /** Pauses the auto-close timer. */
  paused: boolean
}

/** Events emitted by `NotificationContainer`. */
export interface NotificationContainerEmits {
  /** Emitted when the notification should be removed. */
  hide: [id: string]
  /** Emitted when the pointer enters the notification. */
  hoverStart: []
  /** Emitted when the pointer leaves the notification. */
  hoverEnd: []
}
