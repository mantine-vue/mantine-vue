import { defineComponent, h } from 'vue'
import { Pill, PillsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PillsInput, Pill } from '@mantine-vue/core'
</script>

<template>
  <PillsInput label="PillsInput">
    <Pill.Group>
      <Pill>React</Pill>
      <Pill>Vue</Pill>
      <Pill>Svelte</Pill>
      <PillsInput.Field placeholder="Enter tags" />
    </Pill.Group>
  </PillsInput>
</template>
`

const Demo = defineComponent({
  name: 'PillsInputUsageDemo',
  setup: () => () =>
    h(PillsInput, { label: 'PillsInput' }, () => [
      h(Pill.Group, null, () => [
        h(Pill, null, () => 'React'),
        h(Pill, null, () => 'Vue'),
        h(Pill, null, () => 'Svelte'),
        h(PillsInput.Field, { placeholder: 'Enter tags' }),
      ]),
    ]),
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 440,
  centered: true,
}
