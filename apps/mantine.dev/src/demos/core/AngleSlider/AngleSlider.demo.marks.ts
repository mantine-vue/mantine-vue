import { defineComponent, h } from 'vue'
import { AngleSlider, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const MARKS = [
  { value: 0 },
  { value: 45 },
  { value: 90 },
  { value: 135 },
  { value: 180 },
  { value: 225 },
  { value: 270 },
  { value: 315 },
]

const LABELED_MARKS = MARKS.map((m) => ({ ...m, label: `${m.value}°` }))

const code = `
<script setup lang="ts">
import { AngleSlider, Group } from '@mantine-vue/core'

const marks = [
  { value: 0 }, { value: 45 }, { value: 90 }, { value: 135 },
  { value: 180 }, { value: 225 }, { value: 270 }, { value: 315 },
]

const labeledMarks = marks.map((m) => ({ ...m, label: \`\${m.value}°\` }))
</script>

<template>
  <Group p="lg" :gap="50">
    <AngleSlider
      aria-label="Angle slider"
      :format-label="(v) => \`\${v}°\`"
      :size="100"
      restrict-to-marks
      :marks="marks"
    />

    <AngleSlider
      aria-label="Angle slider"
      :format-label="(v) => \`\${v}°\`"
      :size="100"
      :marks="labeledMarks"
    />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'AngleSliderMarksDemo',
  setup: () => () =>
    h(
      Group,
      { p: 'lg', gap: 50 },
      {
        default: () => [
          h(AngleSlider, {
            'aria-label': 'Angle slider',
            formatLabel: (v: number) => `${v}°`,
            size: 100,
            restrictToMarks: true,
            marks: MARKS,
          }),
          h(AngleSlider, {
            'aria-label': 'Angle slider',
            formatLabel: (v: number) => `${v}°`,
            size: 100,
            marks: LABELED_MARKS,
          }),
        ],
      },
    ),
})

export const marks: MantineDemo = { type: 'code', component: Demo, code, centered: true }
