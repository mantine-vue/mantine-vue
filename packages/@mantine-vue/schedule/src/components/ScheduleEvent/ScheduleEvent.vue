<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { resolveScheduleRadius } from '../shared'

const defaultProps = {
  radius: 'sm',
  size: 'sm',
  mode: 'default',
} as const

// Colors come from each event's data rather than a component-level color prop.
const varsResolver = createVarsResolver<any>((theme, { event, radius }) => {
  const colors = theme.variantColorResolver({
    color: event?.color || theme.primaryColor,
    theme,
    variant: event?.variant || 'light',
    autoContrast: true,
  })

  return {
    event: {
      '--event-color': colors.color,
      '--event-bg': colors.background,
      '--event-hover': colors.hover,
      '--event-radius': resolveScheduleRadius(radius),
    },
  }
})

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, ref, useAttrs, useSlots, type VNodeChild } from 'vue'
import { Box, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useDragContext } from '../DragContext'
import type {
  ScheduleEventEmits,
  ScheduleEventOwnProps,
  ScheduleEventResizeEdge,
  ScheduleEventSlots,
} from './ScheduleEvent.types'
import classes from './ScheduleEvent.module.css'

defineOptions({
  name: 'ScheduleEvent',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ScheduleEventOwnProps>(), {
  radius: undefined,
  size: undefined,
  mode: undefined,
  hanging: undefined,
  renderEvent: undefined,
  renderEventBody: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ScheduleEventSlots>()

const emit = defineEmits<ScheduleEventEmits>()

const slots = useSlots()
const attrs = useAttrs()

const dragContext = useDragContext()

const props = useProps('ScheduleEvent', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'ScheduleEvent',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  rootSelector: 'event',
})

const isNativeDragging = ref(false)

/**
 * Ends the native drag, however it ended. Idempotent, because it is reached from both the
 * element's own `dragend` and a `document` listener.
 *
 * The element handler alone is not enough: `dragend` fires on the element the drag started
 * from, which a schedule usually re-renders under a different key the moment the drop is
 * handled — so this element can be gone before the browser gets there and the event never
 * arrives. `document` catches both the drop and the cancel: exactly one of them always fires,
 * and both bubble.
 */
const stopNativeDrag = () => {
  if (!isNativeDragging.value) {
    return
  }

  isNativeDragging.value = false
  document.removeEventListener('drop', stopNativeDrag, true)
  document.removeEventListener('dragend', stopNativeDrag, true)
  emit('eventDragEnd')
}

onBeforeUnmount(() => {
  document.removeEventListener('drop', stopNativeDrag, true)
  document.removeEventListener('dragend', stopNativeDrag, true)
})

const isStatic = computed(() => props.mode === 'static')
const isDraggable = computed(() => props.draggable && !isStatic.value)
const withResizeHandles = computed(() => Boolean(props.withResize) && !isStatic.value)

const body = computed<VNodeChild>(
  () =>
    slots.eventBody?.({ event: props.event }) ??
    props.renderEventBody?.(props.event) ??
    slots.default?.() ??
    props.event.title,
)

const handleDragStart = (nativeEvent: DragEvent) => {
  if (!isDraggable.value) {
    nativeEvent.preventDefault()
    return
  }

  if (nativeEvent.dataTransfer) {
    nativeEvent.dataTransfer.effectAllowed = 'move'
    nativeEvent.dataTransfer.setData(
      'application/json',
      JSON.stringify({ eventId: props.event.id }),
    )
  }

  isNativeDragging.value = true
  document.addEventListener('drop', stopNativeDrag, true)
  document.addEventListener('dragend', stopNativeDrag, true)
  emit('eventDragStart', props.event)
}

const handleResizeStart = (edge: ScheduleEventResizeEdge, nativeEvent: PointerEvent) => {
  emit('resizeStart', edge, nativeEvent)
}

const isBeingDragged = computed(() => props.isDragging || isNativeDragging.value)

const rootMod = computed(() => [
  {
    autoSize: props.autoSize,
    hanging: props.hanging,
    draggable: isDraggable.value,
    dragging: isBeingDragged.value,
    // Set on every event while a drag is in progress, so the ones that are not being dragged
    // can step back visually.
    anyDragging: dragContext.isDragging,
    static: isStatic.value,
    resizing: props.isResizing,
    resizable: withResizeHandles.value,
  },
  (attrs as any).mod,
])

/**
 * Everything spread onto the root element. `renderEvent` receives the same object, so a
 * custom root behaves like the built-in one.
 */
const rootProps = computed(() => ({
  ...attrs,
  ...getStyles('event'),
  'data-event-id': props.event.id,
  title: props.event.title,
  mod: rootMod.value,
  draggable: isDraggable.value,
  tabindex: isStatic.value ? -1 : 0,
  onDragstart: handleDragStart,
  // The element's own `dragend` is the fast path; `stopNativeDrag` also listens on `document`
  // for the case where this element is replaced before the browser gets to fire it.
  onDragend: isStatic.value ? undefined : stopNativeDrag,
  onClick: isStatic.value
    ? undefined
    : (attrs.onClick as ((event: MouseEvent) => void) | undefined),
}))

/**
 * Default children as a functional component, so the template and the `renderEvent`
 * payload share one definition instead of building the tree twice.
 */
const EventChildren = () => [
  withResizeHandles.value
    ? h(Box, {
        ...getStyles('eventResizeHandle'),
        mod: { edge: 'top' },
        onPointerdown: (nativeEvent: PointerEvent) => handleResizeStart('top', nativeEvent),
      })
    : null,
  h(
    Box,
    {
      ...getStyles('eventInner'),
      mod: {
        nowrap: props.nowrap,
        size: props.size,
        autoSize: props.autoSize,
        hanging: props.hanging,
      },
    },
    () => body.value,
  ),
  withResizeHandles.value
    ? h(Box, {
        ...getStyles('eventResizeHandle'),
        mod: { edge: 'bottom' },
        onPointerdown: (nativeEvent: PointerEvent) => handleResizeStart('bottom', nativeEvent),
      })
    : null,
]

const customEvent = computed<VNodeChild>(() => {
  if (!slots.event && !props.renderEvent) {
    return null
  }

  const payload = { ...rootProps.value, children: h(EventChildren) }
  return (
    slots.event?.({ ...payload, event: props.event }) ??
    props.renderEvent?.(props.event, payload) ??
    null
  )
})

const renderCustomEvent = () => customEvent.value
</script>

<template>
  <component :is="renderCustomEvent" v-if="customEvent" />
  <UnstyledButton v-else v-bind="rootProps">
    <EventChildren />
  </UnstyledButton>
</template>
