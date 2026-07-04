import { defineComponent, h } from 'vue'
import { ActionIcon, Group, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ActionIcon, Group, TextInput } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <TextInput placeholder="sm size input" size="sm" />
    <ActionIcon size="input-sm" variant="default" aria-label="ActionIcon the same size as inputs">
      SM
    </ActionIcon>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconInputSizeDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(TextInput, { placeholder: 'sm size input', size: 'sm' }),
        h(
          ActionIcon,
          {
            size: 'input-sm',
            variant: 'default',
            'aria-label': 'ActionIcon the same size as inputs',
          },
          { default: () => 'SM' },
        ),
      ],
    }),
})

export const inputSize: MantineDemo = { type: 'code', component: Demo, code, centered: true }
