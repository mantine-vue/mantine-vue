import { defineComponent, h } from 'vue'
import { Group, RingProgress, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group, RingProgress, Stack, Text } from '@mantine-vue/core'

const sections = [{ value: 40, color: 'cyan' }]
</script>

<template>
  <Group justify="center">
    <Stack align="center" gap="xs">
      <RingProgress :sections="sections" :startAngle="0" />
      <Text size="sm">0° (right)</Text>
    </Stack>
    <Stack align="center" gap="xs">
      <RingProgress :sections="sections" :startAngle="90" />
      <Text size="sm">90° (bottom)</Text>
    </Stack>
    <Stack align="center" gap="xs">
      <RingProgress :sections="sections" :startAngle="180" />
      <Text size="sm">180° (left)</Text>
    </Stack>
    <Stack align="center" gap="xs">
      <RingProgress :sections="sections" :startAngle="270" />
      <Text size="sm">270° (top)</Text>
    </Stack>
  </Group>
</template>
`

const sections = [{ value: 40, color: 'cyan' }]

const Demo = defineComponent({
  name: 'RingProgressStartAngleDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              Stack,
              { align: 'center', gap: 'xs' },
              {
                default: () => [
                  h(RingProgress, { sections, startAngle: 0 }),
                  h(Text, { size: 'sm' }, { default: () => '0° (right)' }),
                ],
              },
            ),
            h(
              Stack,
              { align: 'center', gap: 'xs' },
              {
                default: () => [
                  h(RingProgress, { sections, startAngle: 90 }),
                  h(Text, { size: 'sm' }, { default: () => '90° (bottom)' }),
                ],
              },
            ),
            h(
              Stack,
              { align: 'center', gap: 'xs' },
              {
                default: () => [
                  h(RingProgress, { sections, startAngle: 180 }),
                  h(Text, { size: 'sm' }, { default: () => '180° (left)' }),
                ],
              },
            ),
            h(
              Stack,
              { align: 'center', gap: 'xs' },
              {
                default: () => [
                  h(RingProgress, { sections, startAngle: 270 }),
                  h(Text, { size: 'sm' }, { default: () => '270° (top)' }),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const startAngle: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
