import { defineComponent, h } from 'vue'
import { RingProgress, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RingProgress, Stack, Text } from '@mantine-vue/core'

const sections = [
  { value: 40, color: 'cyan' },
  { value: 25, color: 'orange' },
  { value: 15, color: 'grape' },
]
</script>

<template>
  <Stack align="center">
    <div>
      <Text size="sm" ta="center" mb="xs">No gap (default)</Text>
      <RingProgress :sections="sections" />
    </div>
    <div>
      <Text size="sm" ta="center" mb="xs">5° gap</Text>
      <RingProgress :sections="sections" :sectionGap="5" />
    </div>
    <div>
      <Text size="sm" ta="center" mb="xs">10° gap</Text>
      <RingProgress :sections="sections" :sectionGap="10" />
    </div>
  </Stack>
</template>
`

const sections = [
  { value: 40, color: 'cyan' },
  { value: 25, color: 'orange' },
  { value: 15, color: 'grape' },
]

const Demo = defineComponent({
  name: 'RingProgressSectionGapDemo',
  setup() {
    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h('div', [
              h(
                Text,
                { size: 'sm', ta: 'center', mb: 'xs' },
                { default: () => 'No gap (default)' },
              ),
              h(RingProgress, { sections }),
            ]),
            h('div', [
              h(Text, { size: 'sm', ta: 'center', mb: 'xs' }, { default: () => '5° gap' }),
              h(RingProgress, { sections, sectionGap: 5 }),
            ]),
            h('div', [
              h(Text, { size: 'sm', ta: 'center', mb: 'xs' }, { default: () => '10° gap' }),
              h(RingProgress, { sections, sectionGap: 10 }),
            ]),
          ],
        },
      )
  },
})

export const sectionGap: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
