import { defineComponent, h } from 'vue'
import { RingProgress, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RingProgress, Text } from '@mantine-vue/core'
</script>

<template>
  <RingProgress
    :label="h(Text, { size: 'xs', ta: 'center' }, { default: () => 'Application data usage' })"
    :sections="[
      { value: 40, color: 'cyan' },
      { value: 15, color: 'orange' },
      { value: 15, color: 'grape' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'RingProgressUsageDemo',
  setup() {
    return () =>
      h(RingProgress, {
        label: h(Text, { size: 'xs', ta: 'center' }, { default: () => 'Application data usage' }),
        sections: [
          { value: 40, color: 'cyan' },
          { value: 15, color: 'orange' },
          { value: 15, color: 'grape' },
        ],
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
