import type { ClassNames, Styles, Vars } from '@mantine-vue/core'
import type { NotificationPosition, NotificationsStore } from '../../notifications.store'

export type NotificationsStylesNames = 'root' | 'notification'

export type NotificationsCssVariables = {
  root: '--notifications-z-index' | '--notifications-container-width'
}

/** Props accepted by `Notifications`. */
export interface NotificationsProps {
  /** Notifications default position. @default 'bottom-right' */
  position?: NotificationPosition
  /** Auto close timeout for all notifications in ms, `false` to disable auto close, can be overwritten for individual notifications in `notifications.show` function. @default 4000 */
  autoClose?: number | false
  /** Notification transition duration in ms. @default 250 */
  transitionDuration?: number
  /** Determines whether notifications can be dismissed by dragging left or right. @default true */
  allowDragDismiss?: boolean
  /** Determines whether notifications can be dismissed with horizontal scroll gesture while hovered. @default true */
  allowScrollDismiss?: boolean
  /** Notification width, cannot exceed 100%. @default 440 */
  containerWidth?: number | string
  /** Notification `max-height`, used for transitions. @default 200 */
  notificationMaxHeight?: number | string
  /** Maximum number of notifications displayed at a time, other new notifications will be added to queue. @default 5 */
  limit?: number
  /** Notifications container z-index. @default 400 */
  zIndex?: string | number
  /** Props passed down to the `Portal` component. */
  portalProps?: Record<string, any>
  /** Store for notifications state, can be used to create multiple instances of notifications system in your application. */
  store?: NotificationsStore
  /** Determines whether notifications container should be rendered inside `Portal`. @default true */
  withinPortal?: boolean
  /** Determines which notifications should pause auto close on hover, `'all'` – pauses auto close for all notifications when any notification is hovered, `'notification'` – pauses auto close only for the hovered notification. @default 'all' */
  pauseResetOnHover?: 'all' | 'notification'
  /** CSS classes applied to component elements. */
  classNames?: ClassNames<NotificationsProps>
  /** Inline styles applied to component elements. */
  styles?: Styles<NotificationsProps>
  /** CSS variables resolver. */
  vars?: Vars<NotificationsProps>
  /** Removes default component styles. @default false */
  unstyled?: boolean
}
