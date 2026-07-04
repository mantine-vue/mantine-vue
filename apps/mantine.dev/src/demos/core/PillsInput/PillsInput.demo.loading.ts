import { defineComponent, h } from 'vue'
import { Pill, PillsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PillsInput, Pill } from '@mantine-vue/core'
</script>

<template>
  <PillsInput label="Enter items" loading>
    <Pill.Group>
      <Pill>React</Pill>
      <Pill>Vue</Pill>
      <PillsInput.Field placeholder="Enter value" />
    </Pill.Group>
  </PillsInput>
</template>
`

const Demo = defineComponent({
  name: 'PillsInputLoadingDemo',
  setup: () => () =>
    h(PillsInput, { label: 'Enter items', loading: true }, () => [
      h(Pill.Group, null, () => [
        h(Pill, null, () => 'React'),
        h(Pill, null, () => 'Vue'),
        h(PillsInput.Field, { placeholder: 'Enter value' }),
      ]),
    ]),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
