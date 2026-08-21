import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { RenderEvent, RenderEventBody, ScheduleEventRenderProps } from '../../component-props'
import type { ScheduleEventData, ScheduleMode } from '../../types'

export type ScheduleEventStylesNames = 'event' | 'eventInner' | 'eventResizeHandle'

export type ScheduleEventCssVariables = {
  event: '--event-color' | '--event-bg' | '--event-hover' | '--event-radius'
}

/** Edge of the week or month the event continues past. */
export type ScheduleEventHanging = 'start' | 'end' | 'both' | 'none'

/** Edge of an event grabbed by a resize handle. */
export type ScheduleEventResizeEdge = 'top' | 'bottom'

export interface ScheduleEventSlots {
  /** Fallback body, used when neither `renderEventBody` nor the `eventBody` slot is set. */
  default?: () => VNodeChild

  /** Replaces the body of the event. Takes precedence over `renderEventBody`. */
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild

  /** Replaces the event entirely, root element included. Takes precedence over `renderEvent`. */
  event?: (props: ScheduleEventRenderProps & { event: ScheduleEventData }) => VNodeChild
}

/** Props declared by `ScheduleEvent` itself. See `ScheduleEventProps` for the full public type. */
export interface ScheduleEventOwnProps extends StylesApiProps<ScheduleEventFactory> {
  /** Event rendered by the component. */
  event: ScheduleEventData

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   * @default 'sm'
   */
  radius?: string | number

  /**
   * If set, the event title is truncated to a single line instead of wrapping.
   * @default false
   */
  nowrap?: boolean

  /**
   * If set, the event stretches to fill the box it is positioned in. Used by the
   * time-axis views, where position and size come from inline styles.
   * @default false
   */
  autoSize?: boolean

  /**
   * Controls font size and padding.
   * @default 'sm'
   */
  size?: 'sm' | 'md' | (string & {})

  /**
   * Replaces the body of the event. Can also be set with the `eventBody` slot,
   * which takes precedence over the prop.
   */
  renderEventBody?: RenderEventBody

  /**
   * Replaces the event entirely, root element included. Can also be set with the
   * `event` slot, which takes precedence over the prop.
   */
  renderEvent?: RenderEvent

  /** Edge of the week or month the event continues past, used to flatten that corner. */
  hanging?: ScheduleEventHanging

  /**
   * If set, the event can be picked up with native drag and drop.
   * @default false
   */
  draggable?: boolean

  /**
   * If set, the event is marked as being dragged. Set by the parent view while a drag
   * driven by something other than this event is in progress.
   * @default false
   */
  isDragging?: boolean

  /**
   * Interaction mode. `static` removes the event from the tab order and disables
   * clicking, dragging and resizing.
   * @default 'default'
   */
  mode?: ScheduleMode

  /**
   * If set, resize handles are rendered on the top and bottom edges.
   * @default false
   */
  withResize?: boolean

  /**
   * If set, the event is marked as being resized.
   * @default false
   */
  isResizing?: boolean
}

export interface ScheduleEventProps
  extends Omit<BoxProps, keyof ScheduleEventOwnProps>, ScheduleEventOwnProps {}

export interface ScheduleEventEmits {
  /** Emitted when a native drag of this event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a native drag of this event ends. */
  eventDragEnd: []

  /** Emitted when a resize handle is pressed. */
  resizeStart: [edge: ScheduleEventResizeEdge, event: PointerEvent]
}

export type ScheduleEventFactory = Factory<{
  props: Omit<ScheduleEventProps, 'rootRef'>
  slots: ScheduleEventSlots
  emits: ScheduleEventEmits
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: ScheduleEventStylesNames
  vars: ScheduleEventCssVariables
}>
