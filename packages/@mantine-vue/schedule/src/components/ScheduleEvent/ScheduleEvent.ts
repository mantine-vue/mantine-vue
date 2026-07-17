import { defineComponent, h, ref, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { Box, UnstyledButton, useSafeMantineTheme } from '@mantine-vue/core'
import type {
  ScheduleEventProps,
  ScheduleEventRenderProps,
  RenderEvent,
  RenderEventBody,
} from '../../component-props'
import type { ScheduleEventData, ScheduleMode } from '../../types'
import classes from './ScheduleEvent.module.css'

function resolveRadius(radius: string | number | undefined) {
  if (radius == null) return undefined
  if (typeof radius === 'number') return `${radius}px`
  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(radius)
    ? `var(--mantine-radius-${radius})`
    : radius
}

export interface ScheduleEventSlots {
  /** Fallback body content (used when `renderEventBody`/`eventBody` are not provided) */
  default?: () => VNodeChild
  /** Scoped alternative to the `renderEventBody` prop */
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  /** Scoped alternative to the `renderEvent` prop */
  event?: (props: ScheduleEventRenderProps & { event: ScheduleEventData }) => VNodeChild
}

export const ScheduleEvent = defineComponent({
  name: 'ScheduleEvent',
  inheritAttrs: false,
  slots: Object as SlotsType<ScheduleEventSlots>,
  props: {
    event: { type: Object as PropType<ScheduleEventData>, required: true },
    radius: {
      type: [String, Number] as PropType<string | number>,
      default: 'sm',
    },
    nowrap: Boolean,
    autoSize: Boolean,
    size: { type: String, default: 'sm' },
    renderEventBody: Function as PropType<RenderEventBody>,
    renderEvent: Function as PropType<RenderEvent>,
    hanging: String as PropType<ScheduleEventProps['hanging']>,
    draggable: Boolean,
    onEventDragStart: Function as PropType<(event: ScheduleEventData) => void>,
    onEventDragEnd: Function as PropType<() => void>,
    isDragging: Boolean,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    withResize: Boolean,
    onResizeStart: Function as PropType<(edge: 'top' | 'bottom', event: PointerEvent) => void>,
    isResizing: Boolean,
  },
  setup(props, { attrs, slots }) {
    const theme = useSafeMantineTheme()
    const isNativeDragging = ref(false)
    return () => {
      const colors = theme.value.variantColorResolver({
        color: props.event.color || theme.value.primaryColor,
        theme: theme.value,
        variant: props.event.variant || 'light',
        autoContrast: true,
      })
      const body: VNodeChild =
        props.renderEventBody?.(props.event) ||
        slots.eventBody?.({ event: props.event }) ||
        slots.default?.() ||
        props.event.title
      const showResizeHandles = props.withResize && props.mode !== 'static'
      const rootProps = {
        ...attrs,
        class: [classes.event, attrs.class],
        style: [
          {
            '--event-color': colors.color,
            '--event-bg': colors.background,
            '--event-hover': colors.hover,
            '--event-radius': resolveRadius(props.radius),
          },
          attrs.style,
        ],
        'data-event-id': props.event.id,
        title: props.event.title,
        size: props.size,
        mod: {
          autoSize: props.autoSize,
          hanging: props.hanging,
          draggable: props.draggable,
          dragging: props.isDragging || isNativeDragging.value,
          static: props.mode === 'static',
          resizing: props.isResizing,
          resizable: showResizeHandles,
        },
        draggable: props.draggable && props.mode !== 'static',
        tabindex: props.mode === 'static' ? -1 : 0,
        onDragstart: (event: DragEvent) => {
          if (!props.draggable || props.mode === 'static') {
            event.preventDefault()
            return
          }
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData(
              'application/json',
              JSON.stringify({ eventId: props.event.id }),
            )
          }
          isNativeDragging.value = true
          props.onEventDragStart?.(props.event)
        },
        onDragend:
          props.mode === 'static'
            ? undefined
            : () => {
                isNativeDragging.value = false
                props.onEventDragEnd?.()
              },
        onClick:
          props.mode === 'static'
            ? undefined
            : (attrs.onClick as ScheduleEventRenderProps['onClick']),
      }
      const children = [
        showResizeHandles
          ? h(Box, {
              class: classes.eventResizeHandle,
              mod: { edge: 'top' },
              onPointerdown: (event: PointerEvent) => props.onResizeStart?.('top', event),
            })
          : null,
        h(
          Box,
          {
            class: classes.eventInner,
            mod: {
              nowrap: props.nowrap,
              size: props.size,
              autoSize: props.autoSize,
              hanging: props.hanging,
            },
          },
          () => body,
        ),
        showResizeHandles
          ? h(Box, {
              class: classes.eventResizeHandle,
              mod: { edge: 'bottom' },
              onPointerdown: (event: PointerEvent) => props.onResizeStart?.('bottom', event),
            })
          : null,
      ]
      const renderProps = { ...rootProps, children }
      return (
        props.renderEvent?.(props.event, renderProps) ||
        slots.event?.({ ...renderProps, event: props.event }) ||
        h(UnstyledButton, rootProps, () => children)
      )
    }
  },
})

export type { RenderEvent, RenderEventBody, ScheduleEventProps }
export type ScheduleEventStylesNames = 'event' | 'eventInner' | 'eventResizeHandle'
