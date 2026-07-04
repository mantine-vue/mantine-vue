import { defineComponent, h } from 'vue'
import { Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Textarea } from '@mantine-vue/core'
</script>

<template>
  <Textarea
    placeholder="Autosize with no rows limit"
    label="Autosize with no rows limit"
    autosize
    :min-rows="2"
  />

  <Textarea
    label="Autosize with 4 rows max"
    placeholder="Autosize with 4 rows max"
    autosize
    :min-rows="2"
    :max-rows="4"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'TextareaAutosizeDemo',
  setup: () => () =>
    h('div', null, [
      h(Textarea, {
        placeholder: 'Autosize with no rows limit',
        label: 'Autosize with no rows limit',
        autosize: true,
        minRows: 2,
      }),
      h(Textarea, {
        label: 'Autosize with 4 rows max',
        placeholder: 'Autosize with 4 rows max',
        autosize: true,
        minRows: 2,
        maxRows: 4,
        mt: 'md',
      }),
    ]),
})

export const autosize: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  maxWidth: 340,
  centered: true,
}
