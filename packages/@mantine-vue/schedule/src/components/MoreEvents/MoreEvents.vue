<script lang="ts">
const defaultProps = {
  dropdownType: 'popover',
  mode: 'default',
} as const

/** Pulls the popover back over the control it replaces, so the list covers the day cell. */
const POPOVER_OFFSET = -46

export { defaultProps, POPOVER_OFFSET }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { Box, Modal, Popover, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { getLabel } from '../../labels'
import type { ScheduleEventData } from '../../types'
import { ScheduleEvent } from '../ScheduleEvent'
import { resolveEventRenderers } from '../shared'
import type { MoreEventsEmits, MoreEventsOwnProps, MoreEventsSlots } from './MoreEvents.types'
import classes from './MoreEvents.module.css'

defineOptions({
  name: 'MoreEvents',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MoreEventsOwnProps>(), {
  radius: undefined,
  modalTitle: undefined,
  dropdownType: undefined,
  popoverProps: undefined,
  modalProps: undefined,
  renderEventBody: undefined,
  renderEvent: undefined,
  labels: undefined,
  mode: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<MoreEventsSlots>()

const emit = defineEmits<MoreEventsEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('MoreEvents', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'MoreEvents',
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
  rootSelector: 'moreEventsButton',
})

const opened = ref(false)

const eventRenderers = computed(() => resolveEventRenderers(props, slots))

const close = () => {
  opened.value = false
  emit('dropdownClose')
}

const clickEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) => {
  emit('eventClick', event, nativeEvent)
}

const handlePopoverChange = (value: boolean) => {
  if (!value) {
    close()
  }
}
</script>

<template>
  <!--
    The modal and the popover both wrap the same list. Rendering the modal alongside a
    disabled popover keeps a single target control for either dropdown type.
  -->
  <Modal
    v-if="props.dropdownType === 'modal'"
    v-bind="props.modalProps"
    :opened="opened"
    :radius="props.radius"
    :title="props.modalTitle"
    @close="close"
  >
    <Box v-bind="getStyles('moreEventsList')">
      <ScheduleEvent
        v-for="event in props.events"
        :key="event.id"
        :event="event"
        :radius="props.radius ?? 'sm'"
        size="md"
        :mode="props.mode"
        v-bind="eventRenderers"
        @click="clickEvent(event, $event)"
      />
    </Box>
  </Modal>

  <Popover
    position="bottom-start"
    :width="260"
    :opened="opened"
    trap-focus
    :return-focus="false"
    :disabled="props.dropdownType === 'modal'"
    :radius="props.radius"
    :transition-props="{ transition: 'pop', duration: 120 }"
    :offset="POPOVER_OFFSET"
    v-bind="props.popoverProps"
    @change="handlePopoverChange"
  >
    <Popover.Target>
      <UnstyledButton
        v-bind="{ ...attrs, ...getStyles('moreEventsButton') }"
        :mod="{ static: props.mode === 'static' }"
        :aria-expanded="opened"
        @click="opened = !opened"
      >
        {{ getLabel('moreLabel', props.labels)(props.moreEventsCount) }}
      </UnstyledButton>
    </Popover.Target>

    <Popover.Dropdown v-bind="getStyles('moreEventsDropdown')">
      <Box v-bind="getStyles('moreEventsList')">
        <ScheduleEvent
          v-for="event in props.events"
          :key="event.id"
          :event="event"
          :radius="props.radius ?? 'sm'"
          size="md"
          :mode="props.mode"
          v-bind="eventRenderers"
          @click="clickEvent(event, $event)"
        />
      </Box>
    </Popover.Dropdown>
  </Popover>
</template>
