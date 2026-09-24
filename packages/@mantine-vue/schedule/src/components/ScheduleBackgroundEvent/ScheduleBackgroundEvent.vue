<script setup lang="ts">
import { computed, h, onBeforeUnmount, ref, useAttrs, useSlots } from 'vue'
import { Box, UnstyledButton, useMantineTheme } from '@mantine-vue/core'
import type {
  ScheduleBackgroundEventEmits,
  ScheduleBackgroundEventOwnProps,
  ScheduleBackgroundEventSlots,
} from './ScheduleBackgroundEvent.types'

defineOptions({ name: 'ScheduleBackgroundEvent', inheritAttrs: false })

const props = withDefaults(defineProps<ScheduleBackgroundEventOwnProps>(), {
  interactive: false,
  renderEvent: undefined,
  renderEventBody: undefined,
  withResize: false,
  resizeAxis: 'vertical',
  isResizing: false,
  activeResizeEdge: undefined,
})
const emit = defineEmits<ScheduleBackgroundEventEmits>()
defineSlots<ScheduleBackgroundEventSlots>()

const attrs = useAttrs()
const slots = useSlots()
const theme = useMantineTheme()
const dragPassthrough = ref(false)

const resetDragPassthrough = () => {
  dragPassthrough.value = false
}

const enableDragPassthrough = () => {
  if (!props.interactive || dragPassthrough.value) return
  dragPassthrough.value = true
  document.addEventListener('dragend', resetDragPassthrough, { once: true })
  document.addEventListener('drop', resetDragPassthrough, { once: true })
  document.addEventListener('pointermove', resetDragPassthrough, { once: true })
}

onBeforeUnmount(() => {
  document.removeEventListener('dragend', resetDragPassthrough)
  document.removeEventListener('drop', resetDragPassthrough)
  document.removeEventListener('pointermove', resetDragPassthrough)
})

const rootProps = computed(() => {
  const colors = theme.value.variantColorResolver({
    color: props.event.color || theme.value.primaryColor,
    theme: theme.value,
    variant: 'light',
    autoContrast: true,
  })
  const style = [
    attrs.style,
    {
      '--bg-event-bg': colors.background,
      '--bg-event-color': colors.color,
      '--bg-event-hover': colors.hover,
      ...(dragPassthrough.value ? { pointerEvents: 'none' } : {}),
    },
  ]

  return {
    ...attrs,
    style,
    mod: [
      attrs.mod,
      { interactive: props.interactive, resizable: props.withResize, resizing: props.isResizing },
    ],
    ...(props.interactive
      ? {
          'data-event-id': props.event.id,
          title: props.event.title,
          onClick: (event: MouseEvent) => emit('eventClick', props.event, event),
          onDragenter: enableDragPassthrough,
          onDragover: enableDragPassthrough,
        }
      : {}),
  }
})

const content = () => {
  const body =
    slots.default?.({ event: props.event }) ??
    props.renderEventBody?.(props.event) ??
    props.event.title
  const edges = props.resizeAxis === 'horizontal' ? ['start', 'end'] : ['top', 'bottom']

  return props.withResize
    ? [
        ...edges.map((edge) =>
          h(Box, {
            ...props.resizeHandleProps,
            key: edge,
            mod: { edge },
            'data-active': props.isResizing && props.activeResizeEdge === edge ? true : undefined,
            onPointerdown: (event: PointerEvent) => emit('resizeStart', edge as any, event),
          }),
        ),
        body,
      ]
    : body
}

const render = () => {
  const component = props.interactive ? UnstyledButton : Box
  if (props.renderEvent) {
    return props.renderEvent(props.event, { ...rootProps.value, children: content() } as any)
  }
  return h(component as any, rootProps.value as any, { default: content })
}
</script>

<template>
  <render />
</template>
