import { defineComponent, h } from 'vue'
import { Group, Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <Radio :checked="true" disabled label="React" value="react" />
    <Radio disabled label="Angular" value="nu" />
    <Radio disabled label="Svelte" value="sv" />
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'RadioDisabledDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Radio, { checked: true, disabled: true, label: 'React', value: 'react' }),
        h(Radio, { disabled: true, label: 'Angular', value: 'nu' }),
        h(Radio, { disabled: true, label: 'Svelte', value: 'sv' }),
      ],
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
