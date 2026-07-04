import { defineComponent, h } from 'vue'
import { Progress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Progress } from '@mantine-vue/core'
</script>

<template>
  <Progress.Root size="xl">
    <Progress.Section :value="35" color="cyan">
      <Progress.Label>Documents</Progress.Label>
    </Progress.Section>
    <Progress.Section :value="28" color="pink">
      <Progress.Label>Photos</Progress.Label>
    </Progress.Section>
    <Progress.Section :value="15" color="orange">
      <Progress.Label>Other</Progress.Label>
    </Progress.Section>
  </Progress.Root>
</template>
`

const Demo = defineComponent({
  name: 'ProgressCompoundDemo',
  setup() {
    return () =>
      h(
        Progress.Root,
        { size: 'xl' },
        {
          default: () => [
            h(
              Progress.Section,
              { value: 35, color: 'cyan' },
              {
                default: () => h(Progress.Label, {}, { default: () => 'Documents' }),
              },
            ),
            h(
              Progress.Section,
              { value: 28, color: 'pink' },
              {
                default: () => h(Progress.Label, {}, { default: () => 'Photos' }),
              },
            ),
            h(
              Progress.Section,
              { value: 15, color: 'orange' },
              {
                default: () => h(Progress.Label, {}, { default: () => 'Other' }),
              },
            ),
          ],
        },
      )
  },
})

export const compound: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
