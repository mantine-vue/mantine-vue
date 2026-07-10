import { defineComponent, h, Fragment } from 'vue'
import { useTextSelection } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useTextSelection } from '@mantine-vue/hooks'

const selection = useTextSelection()
</script>

<template>
  <div>Select some text here or anywhere on the page and it will be displayed below</div>
  <div>Selected text: <b>{{ selection?.toString() }}</b></div>
</template>
`

const Demo = defineComponent({
  name: 'UseTextSelectionUsageDemo',
  setup() {
    const selection = useTextSelection()
    return () =>
      h(Fragment, null, [
        h('div', 'Select some text here or anywhere on the page and it will be displayed below'),
        h('div', ['Selected text: ', h('b', {}, selection.value?.toString())]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
