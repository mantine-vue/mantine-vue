import { defineComponent, h } from 'vue'
import { PhMoon, PhSun } from '@phosphor-icons/vue'
import { Rating } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Rating } from '@mantine-vue/core'
import { PhSun, PhMoon } from '@phosphor-icons/vue'
</script>

<template>
  <Rating
    :empty-symbol="() => h(PhSun, { size: 16 })"
    :full-symbol="() => h(PhMoon, { size: 16 })"
  />
</template>
`

const Demo = defineComponent({
  name: 'RatingSymbolDemo',
  setup: () => () =>
    h(Rating, {
      emptySymbol: () => h(PhSun, { size: 16 }),
      fullSymbol: () => h(PhMoon, { size: 16 }),
    }),
})

export const symbol: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
