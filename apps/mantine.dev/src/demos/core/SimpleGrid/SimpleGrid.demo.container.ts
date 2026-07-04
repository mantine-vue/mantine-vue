import { defineComponent, h } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { makeItems } from './_demo-item'

const code = `
<script setup lang="ts">
import { SimpleGrid } from '@mantine-vue/core'
</script>

<template>
  <!-- Wrapper div is added for demonstration purposes only,
       it is not required in real projects -->
  <div style="resize: horizontal; overflow: hidden; max-width: 100%">
    <SimpleGrid
      type="container"
      :cols="{ base: 1, '300px': 2, '500px': 5 }"
      :spacing="{ base: 10, '300px': 'xl' }"
    >
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </SimpleGrid>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'SimpleGridContainerDemo',
  setup() {
    return () =>
      h('div', { style: { resize: 'horizontal', overflow: 'hidden', maxWidth: '100%' } }, [
        h(
          SimpleGrid,
          {
            type: 'container',
            cols: { base: 1, '300px': 2, '500px': 5 },
            spacing: { base: 10, '300px': 'xl' },
          },
          () => makeItems(5),
        ),
      ])
  },
})

export const container: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
