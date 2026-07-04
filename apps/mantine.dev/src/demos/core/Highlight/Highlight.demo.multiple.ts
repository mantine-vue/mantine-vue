import { defineComponent, h } from 'vue'
import { Highlight } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Highlight } from '@mantine-vue/core'
</script>

<template>
  <Highlight :highlight="['this', 'that']">Highlight this and also that</Highlight>
</template>
`

const Demo = defineComponent({
  name: 'HighlightMultipleDemo',
  setup() {
    return () =>
      h(
        Highlight,
        { highlight: ['this', 'that'] },
        { default: () => 'Highlight this and also that' },
      )
  },
})

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
