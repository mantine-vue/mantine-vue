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
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
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
import type {
  NotificationData,
  NotificationPosition,
  SequencedNotificationData,
} from '../../notifications.store'
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
  layout: 'default',
})
const attrs = useAttrs()
const props = useProps('Notifications', null, rawProps)
const theme = useMantineTheme()
const shouldReduceMotion = useReducedMotion()
const STACK_EXPANDED_GAP = 16
const FALLBACK_NOTIFICATION_HEIGHT = 80
const hoveredCounts = ref<Partial<Record<NotificationPosition, number>>>({})
const hoveredGroups = ref<Partial<Record<NotificationPosition, boolean>>>({})
const expandedPositions = ref<Partial<Record<NotificationPosition, boolean>>>({})
const pinnedPosition = ref<NotificationPosition | null>(null)
const notificationHeights = ref<Record<string, number>>({})
const collapseTimeouts: Partial<Record<NotificationPosition, number>> = {}
const data = useNotifications(props.store)
const duration = computed(() =>
  theme.value.respectReducedMotion && shouldReduceMotion.value ? 1 : props.transitionDuration,
)
const grouped = computed(() => getGroupedNotifications(data.value.notifications, props.position))
const hoveredCount = computed(
  () =>
    Object.values(hoveredCounts.value).reduce((sum, value) => sum + (value ?? 0), 0) +
    Object.values(hoveredGroups.value).filter(Boolean).length,
)

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

function isStackExpanded(position: NotificationPosition) {
  return props.layout === 'stacked' && Boolean(expandedPositions.value[position])
}

function orderedGroup(position: NotificationPosition) {
  const items = grouped.value[position]
  if (props.layout !== 'stacked') return items
  return [...(items as SequencedNotificationData[])].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0) || (b.__sequence ?? 0) - (a.__sequence ?? 0),
  )
}

function expandedOffset(position: NotificationPosition, index: number) {
  if (!isStackExpanded(position)) return 0
  const direction = position.startsWith('top') ? 1 : -1
  return (
    orderedGroup(position)
      .slice(0, index)
      .reduce(
        (sum, item) =>
          sum +
          (notificationHeights.value[item.id!] ?? FALLBACK_NOTIFICATION_HEIGHT) +
          STACK_EXPANDED_GAP,
        0,
      ) * direction
  )
}

function setExpanded(position: NotificationPosition, expanded: boolean) {
  expandedPositions.value = { ...expandedPositions.value, [position]: expanded }
}

function scheduleCollapse(position: NotificationPosition) {
  window.clearTimeout(collapseTimeouts[position])
  if (
    (hoveredCounts.value[position] ?? 0) > 0 ||
    hoveredGroups.value[position] ||
    pinnedPosition.value === position
  )
    return
  collapseTimeouts[position] = window.setTimeout(() => setExpanded(position, false), 200)
}

function handleHoverStart(position: NotificationPosition) {
  hoveredCounts.value = {
    ...hoveredCounts.value,
    [position]: (hoveredCounts.value[position] ?? 0) + 1,
  }
  if (props.layout === 'stacked') setExpanded(position, true)
}

function handleHoverEnd(position: NotificationPosition) {
  hoveredCounts.value = {
    ...hoveredCounts.value,
    [position]: Math.max(0, (hoveredCounts.value[position] ?? 0) - 1),
  }
  if (props.layout === 'stacked') scheduleCollapse(position)
}

function handleGroupHover(position: NotificationPosition, hovered: boolean) {
  if (props.layout !== 'stacked') return
  hoveredGroups.value = { ...hoveredGroups.value, [position]: hovered }
  if (hovered) {
    window.clearTimeout(collapseTimeouts[position])
    setExpanded(position, true)
  } else scheduleCollapse(position)
}

function handleExpandRequest(position: NotificationPosition) {
  pinnedPosition.value = position
  setExpanded(position, true)
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!pinnedPosition.value) return
  const target = event.target as Element | null
  if (!target?.closest(`[data-notifications-position="${pinnedPosition.value}"]`)) {
    const previous = pinnedPosition.value
    pinnedPosition.value = null
    scheduleCollapse(previous)
  }
}

watch(
  () => props.layout,
  (layout) => {
    if (layout !== 'stacked') {
      pinnedPosition.value = null
      hoveredGroups.value = {}
      expandedPositions.value = {}
    }
  },
)

watch(grouped, (groups) => {
  if (pinnedPosition.value && groups[pinnedPosition.value].length === 0) {
    pinnedPosition.value = null
  }
})

onMounted(() => document.addEventListener('pointerdown', handleDocumentPointerDown))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  positions.forEach((position) => window.clearTimeout(collapseTimeouts[position]))
})
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Box
      v-for="position in positions"
      :key="position"
      v-bind="{ ...attrs, ...getStyles('root') }"
      :data-position="position"
      :data-notifications-position="position"
      :data-layout="props.layout"
    >
      <TransitionGroup
        tag="div"
        :css="false"
        @mouseenter="handleGroupHover(position, true)"
        @mouseleave="handleGroupHover(position, false)"
        @focusin="handleGroupHover(position, true)"
        @focusout="handleGroupHover(position, false)"
        @before-enter="(element) => applyTransitionStyles(element, 'exited', position)"
        @enter="(element, done) => enter(element, done, position)"
        @leave="(element, done) => leave(element, done, position)"
      >
        <NotificationContainer
          v-for="(notification, stackIndex) in orderedGroup(position)"
          :key="notification.id"
          v-bind="getStyles('notification', { style: notification.style })"
          :data="notificationData(notification)"
          :auto-close="props.autoClose"
          :transition-duration="duration"
          :allow-drag-dismiss="props.allowDragDismiss"
          :allow-scroll-dismiss="props.allowScrollDismiss"
          :paused="
            (props.pauseResetOnHover === 'all' && hoveredCount > 0) ||
            (props.layout === 'stacked' && !isStackExpanded(position) && stackIndex > 0)
          "
          :render-notification="
            'renderNotification' in notification
              ? notification.renderNotification
              : props.renderNotification
          "
          :layout="props.layout"
          :stack-index="stackIndex"
          :stack-size="orderedGroup(position).length"
          :stack-position="position"
          :stack-expanded="isStackExpanded(position)"
          :stack-expanded-offset="expandedOffset(position, stackIndex)"
          transition-state="entered"
          @hide="(id) => hideNotification(id, props.store)"
          @hover-start="handleHoverStart(position)"
          @hover-end="handleHoverEnd(position)"
          @expand-request="handleExpandRequest(position)"
          @height-change="
            (height) =>
              (notificationHeights = { ...notificationHeights, [notification.id!]: height })
          "
        />
      </TransitionGroup>
    </Box>
  </OptionalPortal>
</template>
