import { defineComponent, h, ref, type PropType, type SlotsType } from 'vue'
import { Box, Modal, Popover, UnstyledButton } from '@mantine-vue/core'
import { getLabel, type ScheduleLabelsOverride } from '../../labels'
import type {
  MoreEventsDropdownType,
  MoreEventsProps,
  RenderEvent,
  RenderEventBody,
} from '../../component-props'
import type { ScheduleEventData, ScheduleMode } from '../../types'
import { ScheduleEvent } from '../ScheduleEvent/ScheduleEvent'
import { forwardEventSlots, type EventSlots } from '../shared'
import classes from './MoreEvents.module.css'

export const MoreEvents = defineComponent({
  name: 'MoreEvents',
  inheritAttrs: false,
  slots: Object as SlotsType<EventSlots>,
  props: {
    events: { type: Array as PropType<ScheduleEventData[]>, required: true },
    moreEventsCount: { type: Number, required: true },
    radius: [String, Number] as PropType<string | number>,
    modalTitle: String,
    dropdownType: { type: String as PropType<MoreEventsDropdownType>, default: 'popover' },
    popoverProps: Object as PropType<Record<string, unknown>>,
    modalProps: Object as PropType<Record<string, unknown>>,
    onDropdownClose: Function as PropType<() => void>,
    renderEventBody: Function as PropType<RenderEventBody>,
    renderEvent: Function as PropType<RenderEvent>,
    labels: Object as PropType<ScheduleLabelsOverride>,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    onEventClick: Function as PropType<(event: ScheduleEventData, nativeEvent: MouseEvent) => void>,
  },
  setup(props, { attrs, slots }) {
    const opened = ref(false)
    const close = () => {
      opened.value = false
      props.onDropdownClose?.()
    }

    return () => {
      const eventsList = h(Box, { class: classes.moreEventsList }, () =>
        props.events.map((event) =>
          h(
            ScheduleEvent,
            {
              key: event.id,
              event,
              radius: props.radius ?? 'sm',
              size: 'md',
              mode: props.mode,
              renderEvent: props.renderEvent,
              renderEventBody: props.renderEventBody,
              onClick: (nativeEvent: MouseEvent) => props.onEventClick?.(event, nativeEvent),
            },
            forwardEventSlots(slots),
          ),
        ),
      )

      return [
        props.dropdownType === 'modal'
          ? h(
              Modal,
              {
                ...props.modalProps,
                opened: opened.value,
                onClose: close,
                radius: props.radius,
                title: props.modalTitle,
              },
              () => eventsList,
            )
          : null,
        h(
          Popover,
          {
            position: 'bottom-start',
            width: 260,
            opened: opened.value,
            trapFocus: true,
            returnFocus: false,
            disabled: props.dropdownType === 'modal',
            radius: props.radius,
            transitionProps: { transition: 'pop', duration: 120 },
            offset: -46,
            ...props.popoverProps,
            onChange: (value: boolean) => {
              if (!value) close()
            },
          },
          () => [
            h(Popover.Target, null, () =>
              h(
                UnstyledButton,
                {
                  ...attrs,
                  class: [classes.moreEventsButton, attrs.class],
                  mod: { static: props.mode === 'static' },
                  'aria-expanded': opened.value,
                  onClick: () => {
                    opened.value = !opened.value
                  },
                },
                () => getLabel('moreLabel', props.labels)(props.moreEventsCount),
              ),
            ),
            h(Popover.Dropdown, { class: classes.moreEventsDropdown }, () => eventsList),
          ],
        ),
      ]
    }
  },
})

export type { MoreEventsDropdownType, MoreEventsProps }
export type MoreEventsStylesNames = 'moreEventsButton' | 'moreEventsDropdown' | 'moreEventsList'
