import { defineComponent, h } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { makeItems } from './_demo-item'

const code = `
<script setup lang="ts">
import { SimpleGrid } from '@mantine-vue/core'
</script>

<template>
  <SimpleGrid
    :cols="{ base: 1, sm: 2, lg: 5 }"
    :spacing="{ base: 10, sm: 'xl' }"
    :verticalSpacing="{ base: 'md', sm: 'xl' }"
  >
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </SimpleGrid>
</template>
`

const Demo = defineComponent({
  name: 'SimpleGridResponsiveDemo',
  setup() {
    return () =>
      h(
        SimpleGrid,
        {
          cols: { base: 1, sm: 2, lg: 5 },
          spacing: { base: 10, sm: 'xl' },
          verticalSpacing: { base: 'md', sm: 'xl' },
        },
        () => makeItems(5),
      )
  },
})

export const responsive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
