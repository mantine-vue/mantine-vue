import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import { useIdle } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@mantine-vue/core'
import { useIdle } from '@mantine-vue/hooks'

const idle = useIdle(2000)
const color = computed(() => (idle.value ? 'blue' : 'teal'))
</script>

<template>
  <Badge :color="color">Current state: {{ idle ? 'idle' : 'not idle' }}</Badge>
</template>
`

const Demo = defineComponent({
  name: 'UseIdleUsageDemo',
  setup() {
    const idle = useIdle(2000)

    return () =>
      h(
        Badge,
        { color: idle.value ? 'blue' : 'teal' },
        () => `Current state: ${idle.value ? 'idle' : 'not idle'}`,
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
