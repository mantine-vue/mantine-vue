import { defineComponent, h } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { makeItems } from './_demo-item'

const code = `
<script setup lang="ts">
import { SimpleGrid } from '@mantine-vue/core'
</script>

<template>
  <SimpleGrid :cols="3" autoRows="minmax(100px, auto)">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </SimpleGrid>
</template>
`

const Demo = defineComponent({
  name: 'SimpleGridAutoRowsDemo',
  setup() {
    return () => h(SimpleGrid, { cols: 3, autoRows: 'minmax(100px, auto)' }, () => makeItems(5))
  },
})

export const autoRows: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
