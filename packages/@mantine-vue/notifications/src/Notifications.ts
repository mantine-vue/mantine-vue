import { TransitionGroup, computed, defineComponent, h, ref, watch, type PropType } from 'vue'
import {
  Box,
  OptionalPortal,
  createVarsResolver,
  getDefaultZIndex,
  rem,
  useMantineTheme,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useReducedMotion } from '@mantine-vue/hooks'
import {
  getGroupedNotifications,
  positions,
} from './get-grouped-notifications/get-grouped-notifications'
import { getNotificationStateStyles } from './get-notification-state-styles'
import { NotificationContainer } from './NotificationContainer'
import {
  hideNotification,
  notifications,
  notificationsStore,
  useNotifications,
  type NotificationPosition,
  type NotificationsStore,
} from './notifications.store'
import classes from './Notifications.module.css'

export type NotificationsStylesNames = 'root' | 'notification'
export type NotificationsCssVariables = {
  root: '--notifications-z-index' | '--notifications-container-width'
}

export interface NotificationsProps {
  position?: NotificationPosition
  autoClose?: number | false
  transitionDuration?: number
  allowDragDismiss?: boolean
  allowScrollDismiss?: boolean
  containerWidth?: number | string
  notificationMaxHeight?: number | string
  limit?: number
  zIndex?: string | number
  portalProps?: Record<string, any>
  store?: NotificationsStore
  withinPortal?: boolean
  pauseResetOnHover?: 'all' | 'notification'
  classNames?: Record<string, any>
  styles?: Record<string, any>
  vars?: Record<string, any>
  unstyled?: boolean
}

const defaultProps = {
  position: 'bottom-right',
  autoClose: 4000,
  transitionDuration: 250,
  allowDragDismiss: true,
  allowScrollDismiss: true,
  containerWidth: 440,
  notificationMaxHeight: 200,
  limit: 5,
  zIndex: getDefaultZIndex('overlay'),
  store: notificationsStore,
  withinPortal: true,
  pauseResetOnHover: 'all',
} satisfies Partial<NotificationsProps>

const varsResolver = createVarsResolver<any>((_, { zIndex, containerWidth }) => ({
  root: {
    '--notifications-z-index': zIndex?.toString(),
    '--notifications-container-width': rem(containerWidth),
  },
}))

function applyTransitionStyles(
  element: Element,
  state: 'entered' | 'exited' | 'exiting',
  position: NotificationPosition,
  transitionDuration: number,
  maxHeight: number | string,
) {
  Object.assign(
    (element as HTMLElement).style,
    getNotificationStateStyles({
      state,
      position,
      transitionDuration,
      maxHeight,
    }),
  )
}

const NotificationsBase = defineComponent({
  name: 'Notifications',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<NotificationPosition>, default: undefined },
    autoClose: { type: [Number, Boolean] as PropType<number | false>, default: undefined },
    transitionDuration: { type: Number, default: undefined },
    allowDragDismiss: { type: Boolean, default: undefined },
    allowScrollDismiss: { type: Boolean, default: undefined },
    containerWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
    notificationMaxHeight: {
      type: [Number, String] as PropType<number | string>,
      default: undefined,
    },
    limit: { type: Number, default: undefined },
    zIndex: { type: [Number, String] as PropType<number | string>, default: undefined },
    portalProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    store: { type: Object as PropType<NotificationsStore>, default: undefined },
    withinPortal: { type: Boolean, default: undefined },
    pauseResetOnHover: { type: String as PropType<'all' | 'notification'>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<NotificationsProps>('Notifications', defaultProps, rawProps as any)
    const theme = useMantineTheme()
    const shouldReduceMotion = useReducedMotion()
    const hoveredCount = ref(0)
    const data = useNotifications(props.store)
    const reduceMotion = computed(() =>
      theme.value.respectReducedMotion ? shouldReduceMotion.value : false,
    )
    const duration = computed(() => (reduceMotion.value ? 1 : props.transitionDuration!))

    const getStyles = useStyles({
      name: 'Notifications',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    watch(
      () => [props.limit, props.position, props.store] as const,
      () => {
        props.store?.setState((current) => ({
          ...current,
          limit: props.limit || 5,
          defaultPosition: props.position!,
        }))
      },
      { immediate: true },
    )

    const handleHoverStart = () => {
      hoveredCount.value += 1
    }

    const handleHoverEnd = () => {
      hoveredCount.value = Math.max(0, hoveredCount.value - 1)
    }

    return () => {
      const grouped = getGroupedNotifications(data.value.notifications, props.position!)
      const rootProps = (position: NotificationPosition) => ({
        ...attrs,
        ...getStyles('root'),
        'data-position': position,
      })

      const renderGroup = (position: NotificationPosition) =>
        h(Box, rootProps(position), () =>
          h(
            TransitionGroup,
            {
              css: false,
              onBeforeEnter: (el: Element) =>
                applyTransitionStyles(
                  el,
                  'exited',
                  position,
                  duration.value,
                  props.notificationMaxHeight!,
                ),
              onEnter: (el: Element, done: () => void) => {
                void (el as HTMLElement).offsetHeight
                applyTransitionStyles(
                  el,
                  'entered',
                  position,
                  duration.value,
                  props.notificationMaxHeight!,
                )
                window.setTimeout(done, duration.value)
              },
              onLeave: (el: Element, done: () => void) => {
                applyTransitionStyles(
                  el,
                  'exiting',
                  position,
                  duration.value,
                  props.notificationMaxHeight!,
                )
                window.setTimeout(done, duration.value)
              },
            },
            () =>
              grouped[position].map(({ style: notificationStyle, ...notification }) =>
                h(NotificationContainer, {
                  key: notification.id,
                  data: notification,
                  onHide: (id) => hideNotification(id, props.store),
                  autoClose: props.autoClose!,
                  transitionDuration: duration.value,
                  allowDragDismiss: props.allowDragDismiss!,
                  allowScrollDismiss: props.allowScrollDismiss!,
                  paused: props.pauseResetOnHover === 'all' ? hoveredCount.value > 0 : false,
                  onHoverStart: handleHoverStart,
                  onHoverEnd: handleHoverEnd,
                  ...getStyles('notification', { style: notificationStyle }),
                }),
              ),
          ),
        )

      return h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
        positions.map((position) => renderGroup(position)),
      )
    }
  },
})

export const Notifications = Object.assign(NotificationsBase, {
  classes,
  varsResolver,
  show: notifications.show,
  hide: notifications.hide,
  update: notifications.update,
  clean: notifications.clean,
  cleanQueue: notifications.cleanQueue,
  updateState: notifications.updateState,
})
