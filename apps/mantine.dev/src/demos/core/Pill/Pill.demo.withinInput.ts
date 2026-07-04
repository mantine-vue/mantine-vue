import { defineComponent, h } from 'vue'
import { InputBase, Pill } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Pill, InputBase } from '@mantine-vue/core'

const pills = Array(10)
  .fill(0)
  .map((_, index) => h(Pill, { key: index, withRemoveButton: true }, () => \`Item \${index}\`))
</script>

<template>
  <InputBase component="div" multiline>
    <Pill.Group>
      <Pill v-for="i in 10" :key="i" with-remove-button>Item {{ i - 1 }}</Pill>
    </Pill.Group>
  </InputBase>
</template>
`

const Demo = defineComponent({
  name: 'PillWithinInputDemo',
  setup() {
    const pills = Array(10)
      .fill(0)
      .map((_, index) => h(Pill, { key: index, withRemoveButton: true }, () => `Item ${index}`))

    return () =>
      h(InputBase, { component: 'div', multiline: true }, () => [h(Pill.Group, null, () => pills)])
  },
})

export const withinInput: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
