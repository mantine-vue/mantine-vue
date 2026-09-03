import type { VNodeChild } from 'vue'
import type { NotificationData, NotificationPosition } from '../../notifications.store'

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
  /** Custom renderer used instead of the default Notification component. */
  renderNotification?: ((notification: NotificationData) => VNodeChild) | null
  /** Notification layout inherited from the notifications container. */
  layout?: 'default' | 'stacked'
  /** Zero-based position of the notification in its stack. */
  stackIndex?: number
  /** Total number of notifications in the stack. */
  stackSize?: number
  /** Screen position used to determine stack expansion direction. */
  stackPosition?: NotificationPosition
  /** Determines whether the notification stack is expanded. */
  stackExpanded?: boolean
  /** Pixel offset applied when the notification stack is expanded. */
  stackExpandedOffset?: number
  /** Current transition state used to coordinate stacked transforms. */
  transitionState?: 'entered' | 'exited' | 'exiting'
}

/** Events emitted by `NotificationContainer`. */
export interface NotificationContainerEmits {
  /** Emitted when the notification should be removed. */
  hide: [id: string]
  /** Emitted when the pointer enters the notification. */
  hoverStart: []
  /** Emitted when the pointer leaves the notification. */
  hoverEnd: []
  expandRequest: []
  heightChange: [height: number]
}
