import { defineComponent, h } from 'vue'
import { Badge, Group, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const TRANSITIONS = [
  'fade',
  'fade-down',
  'fade-up',
  'fade-left',
  'fade-right',
  'skew-up',
  'skew-down',
  'rotate-right',
  'rotate-left',
  'slide-down',
  'slide-up',
  'slide-right',
  'slide-left',
  'scale',
  'scale-y',
  'scale-x',
  'pop',
  'pop-top-left',
  'pop-top-right',
  'pop-bottom-left',
  'pop-bottom-right',
]

const Demo = defineComponent({
  name: 'TooltipTransitionsDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center', style: { cursor: 'default' } },
        {
          default: () =>
            TRANSITIONS.map((transition) =>
              h(
                Tooltip,
                {
                  key: transition,
                  label: transition,
                  transitionProps: { transition, duration: 300 },
                },
                {
                  default: () => h(Badge, { variant: 'light' }, () => transition),
                },
              ),
            ),
        },
      )
  },
})

export const transitions: MantineDemo = {
  type: 'code',
  component: Demo,
  code: `
<script setup lang="ts">
import { Badge, Group, Tooltip } from '@mantine-vue/core'

const TRANSITIONS = [
  'fade', 'fade-down', 'fade-up', 'fade-left', 'fade-right',
  'skew-up', 'skew-down', 'rotate-right', 'rotate-left',
  'slide-down', 'slide-up', 'slide-right', 'slide-left',
  'scale', 'scale-y', 'scale-x', 'pop', 'pop-top-left',
  'pop-top-right', 'pop-bottom-left', 'pop-bottom-right',
]
</script>

<template>
  <Group justify="center" :style="{ cursor: 'default' }">
    <Tooltip
      v-for="transition in TRANSITIONS"
      :key="transition"
      :label="transition"
      :transition-props="{ transition, duration: 300 }"
    >
      <Badge variant="light">{{ transition }}</Badge>
    </Tooltip>
  </Group>
</template>
`,
}
