import { defineComponent, h, ref, type PropType } from 'vue'
import { Button, Group, Paper, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

interface NotificationItem {
  id: number
  text: string
}

const initialItems: NotificationItem[] = [
  { id: 1, text: 'New message from Alice' },
  { id: 2, text: 'Build succeeded' },
  { id: 3, text: 'Deployment complete' },
  { id: 4, text: 'Review requested' },
]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Paper, Text } from '@mantine-vue/core'
import { useDrag } from '@mantine-vue/hooks'

interface NotificationItem {
  id: number
  text: string
}

const initialItems: NotificationItem[] = [
  { id: 1, text: 'New message from Alice' },
  { id: 2, text: 'Build succeeded' },
  { id: 3, text: 'Deployment complete' },
  { id: 4, text: 'Review requested' },
]

const notifications = ref([...initialItems])

function dismiss(id: number) {
  notifications.value = notifications.value.filter((item) => item.id !== id)
}
</script>

<!-- SwipeNotification.vue -->
<script setup lang="ts">
const props = defineProps<{ notification: NotificationItem }>()
const emit = defineEmits<{ dismiss: [id: number] }>()

const offset = ref(0)
const dismissed = ref(false)

const { ref: dragRef, active } = useDrag(
  (state) => {
    if (state.last) {
      const shouldDismiss = Math.abs(state.movement[0]) > 120 || state.velocity[0] > 0.5
      if (shouldDismiss) {
        dismissed.value = true
        setTimeout(() => emit('dismiss', props.notification.id), 300)
      } else {
        offset.value = 0
      }
    } else {
      offset.value = state.movement[0]
    }
  },
  { axis: 'x', threshold: 5, filterTaps: true },
)
</script>

<template>
  <Paper
    :ref="(el) => dragRef((el as any)?.$el ?? el ?? null)"
    p="sm"
    mb="xs"
    withBorder
    radius="md"
    :style="{
      transform: dismissed ? \`translateX(\${offset > 0 ? 400 : -400}px)\` : \`translateX(\${offset}px)\`,
      opacity: dismissed ? 0 : 1 - Math.min(Math.abs(offset) / 200, 1) * 0.6,
      transition: active ? 'none' : 'transform 300ms ease, opacity 300ms ease',
      cursor: active ? 'grabbing' : 'grab',
      touchAction: 'pan-y',
      userSelect: 'none',
    }"
  >
    {{ notification.text }}
  </Paper>
</template>
`

const Demo = defineComponent({
  name: 'UseDragSwipeDemo',
  setup() {
    const notifications = ref<NotificationItem[]>([...initialItems])

    const dismiss = (id: number) => {
      notifications.value = notifications.value.filter((item) => item.id !== id)
    }

    return () =>
      h('div', { style: { height: '300px' } }, [
        ...notifications.value.map((notification) =>
          h(SwipeNotification, { key: notification.id, notification, onDismiss: dismiss }),
        ),
        notifications.value.length === 0
          ? h(Text, { ta: 'center', c: 'dimmed', py: 'md' }, { default: () => 'All cleared!' })
          : null,
        h(
          Group,
          { justify: 'center', mt: 'md' },
          {
            default: () =>
              h(
                Button,
                { onClick: () => (notifications.value = [...initialItems]) },
                { default: () => 'Reset' },
              ),
          },
        ),
      ])
  },
})

const SwipeNotification = defineComponent({
  name: 'SwipeNotification',
  props: {
    notification: { type: Object as PropType<NotificationItem>, required: true },
    onDismiss: { type: Function as PropType<(id: number) => void>, required: true },
  },
  setup(props) {
    const offset = ref(0)
    const dismissed = ref(false)

    const { ref: dragRef, active } = useDrag(
      (state) => {
        if (state.last) {
          const shouldDismiss = Math.abs(state.movement[0]) > 120 || state.velocity[0] > 0.5
          if (shouldDismiss) {
            dismissed.value = true
            setTimeout(() => props.onDismiss(props.notification.id), 300)
          } else {
            offset.value = 0
          }
        } else {
          offset.value = state.movement[0]
        }
      },
      { axis: 'x', threshold: 5, filterTaps: true },
    )

    return () =>
      h(
        Paper,
        {
          ref: (el: any) => dragRef(el?.$el ?? el ?? null),
          p: 'sm',
          mb: 'xs',
          withBorder: true,
          radius: 'md',
          style: {
            transform: dismissed.value
              ? `translateX(${offset.value > 0 ? 400 : -400}px)`
              : `translateX(${offset.value}px)`,
            opacity: dismissed.value ? 0 : 1 - Math.min(Math.abs(offset.value) / 200, 1) * 0.6,
            transition: active.value ? 'none' : 'transform 300ms ease, opacity 300ms ease',
            cursor: active.value ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
            userSelect: 'none',
          },
        },
        { default: () => props.notification.text },
      )
  },
})

export const swipe: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
