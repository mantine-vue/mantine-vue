<script lang="ts">
import { createVarsResolver, rem } from '@mantine-vue/core'

const varsResolver = createVarsResolver<any>((_, { zIndex, containerWidth }) => ({
  root: {
    '--notifications-z-index': zIndex?.toString(),
    '--notifications-container-width': rem(containerWidth),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import {
  Box,
  OptionalPortal,
  getDefaultZIndex,
  useMantineTheme,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useReducedMotion } from '@mantine-vue/hooks'
import NotificationContainer from '../NotificationContainer/NotificationContainer.vue'
import {
  getGroupedNotifications,
  positions,
} from '../../get-grouped-notifications/get-grouped-notifications'
import { getNotificationStateStyles } from '../../get-notification-state-styles'
import { hideNotification, notificationsStore, useNotifications } from '../../notifications.store'
import type { NotificationData, NotificationPosition } from '../../notifications.store'
import type { NotificationsProps } from './Notifications.types'
import classes from '../../Notifications.module.css'

defineOptions({ name: 'Notifications', inheritAttrs: false })

const rawProps = withDefaults(defineProps<NotificationsProps>(), {
  position: 'bottom-right',
  autoClose: 4000,
  transitionDuration: 250,
  allowDragDismiss: true,
  allowScrollDismiss: true,
  containerWidth: 440,
  notificationMaxHeight: 200,
  limit: 5,
  zIndex: () => getDefaultZIndex('overlay'),
  store: () => notificationsStore,
  withinPortal: true,
  pauseResetOnHover: 'all',
})
const attrs = useAttrs()
const props = useProps('Notifications', null, rawProps)
const theme = useMantineTheme()
const shouldReduceMotion = useReducedMotion()
const hoveredCount = ref(0)
const data = useNotifications(props.store)
const duration = computed(() =>
  theme.value.respectReducedMotion && shouldReduceMotion.value ? 1 : props.transitionDuration,
)
const grouped = computed(() => getGroupedNotifications(data.value.notifications, props.position))

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
    props.store.setState((current) => ({
      ...current,
      limit: props.limit || 5,
      defaultPosition: props.position,
    }))
  },
  { immediate: true },
)

function applyTransitionStyles(
  element: Element,
  state: 'entered' | 'exited' | 'exiting',
  position: NotificationPosition,
) {
  Object.assign(
    (element as HTMLElement).style,
    getNotificationStateStyles({
      state,
      position,
      transitionDuration: duration.value,
      maxHeight: props.notificationMaxHeight,
    }),
  )
}

function enter(element: Element, done: () => void, position: NotificationPosition) {
  void (element as HTMLElement).offsetHeight
  applyTransitionStyles(element, 'entered', position)
  window.setTimeout(done, duration.value)
}

function leave(element: Element, done: () => void, position: NotificationPosition) {
  applyTransitionStyles(element, 'exiting', position)
  window.setTimeout(done, duration.value)
}

function notificationData(notification: NotificationData) {
  const data = { ...notification }
  delete data.style
  return data
}
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Box
      v-for="position in positions"
      :key="position"
      v-bind="{ ...attrs, ...getStyles('root') }"
      :data-position="position"
    >
      <TransitionGroup
        :css="false"
        @before-enter="(element) => applyTransitionStyles(element, 'exited', position)"
        @enter="(element, done) => enter(element, done, position)"
        @leave="(element, done) => leave(element, done, position)"
      >
        <NotificationContainer
          v-for="notification in grouped[position]"
          :key="notification.id"
          v-bind="getStyles('notification', { style: notification.style })"
          :data="notificationData(notification)"
          :auto-close="props.autoClose"
          :transition-duration="duration"
          :allow-drag-dismiss="props.allowDragDismiss"
          :allow-scroll-dismiss="props.allowScrollDismiss"
          :paused="props.pauseResetOnHover === 'all' && hoveredCount > 0"
          @hide="(id) => hideNotification(id, props.store)"
          @hover-start="hoveredCount += 1"
          @hover-end="hoveredCount = Math.max(0, hoveredCount - 1)"
        />
      </TransitionGroup>
    </Box>
  </OptionalPortal>
</template>
