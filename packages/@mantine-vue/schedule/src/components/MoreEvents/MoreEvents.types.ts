import type { BoxProps, Factory, ModalProps, PopoverProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  EventSlots,
  ForwardedProps,
  RenderEvent,
  RenderEventBody,
} from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type { ScheduleEventData, ScheduleMode } from '../../types'

export type MoreEventsStylesNames = 'moreEventsButton' | 'moreEventsDropdown' | 'moreEventsList'

/** How the hidden events are revealed. */
export type MoreEventsDropdownType = 'popover' | 'modal'

export type MoreEventsSlots = EventSlots

/** Props declared by `MoreEvents` itself. See `MoreEventsProps` for the full public type. */
export interface MoreEventsOwnProps extends StylesApiProps<MoreEventsFactory> {
  /** Events listed in the dropdown. */
  events: ScheduleEventData[]

  /** Number of events hidden behind the control, used to build its label. */
  moreEventsCount: number

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Title of the modal, used only when `dropdownType` is `modal`. */
  modalTitle?: string

  /**
   * Whether the hidden events open in a popover or in a modal.
   * @default 'popover'
   */
  dropdownType?: MoreEventsDropdownType

  /** Props passed to the underlying `Popover`. */
  popoverProps?: ForwardedProps<PopoverProps>

  /** Props passed to the underlying `Modal`. */
  modalProps?: ForwardedProps<ModalProps>

  /**
   * Replaces the body of every listed event. Can also be set with the `eventBody` slot,
   * which takes precedence over the prop.
   */
  renderEventBody?: RenderEventBody

  /**
   * Replaces every listed event entirely. Can also be set with the `event` slot,
   * which takes precedence over the prop.
   */
  renderEvent?: RenderEvent

  /** Label overrides, used for the control text and accessible names. */
  labels?: ScheduleLabelsOverride

  /**
   * Interaction mode. `static` keeps the control visible but non-interactive.
   * @default 'default'
   */
  mode?: ScheduleMode
}

export interface MoreEventsProps
  extends Omit<BoxProps, keyof MoreEventsOwnProps>, MoreEventsOwnProps {}

export interface MoreEventsEmits {
  /** Emitted when the dropdown closes. */
  dropdownClose: []

  /** Emitted when a listed event is clicked. */
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]
}

export type MoreEventsFactory = Factory<{
  props: Omit<MoreEventsProps, 'rootRef'>
  slots: MoreEventsSlots
  emits: MoreEventsEmits
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: MoreEventsStylesNames
}>
