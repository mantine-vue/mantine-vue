import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import { useIdle } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
import { useIdle } from '@mantine-vue/hooks'

const idle = useIdle(2000, { events: ['click', 'touchstart'] })
</script>

<template>
  <Badge :color="idle ? 'blue' : 'teal'">Current state: {{ idle ? 'idle' : 'not idle' }}</Badge>
</template>
`

const Demo = defineComponent({
  name: 'UseIdleEventsDemo',
  setup() {
    const idle = useIdle(2000, { events: ['click', 'touchstart'] })

    return () =>
      h(
        Badge,
        { color: idle.value ? 'blue' : 'teal' },
        () => `Current state: ${idle.value ? 'idle' : 'not idle'}`,
      )
  },
})

export const events: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
