import { defineComponent, h } from 'vue'
import { Rating } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Rating } from '@mantine-vue/core'
</script>

<template>
  <Rating :value="3.5" :fractions="2" read-only />
</template>
`

const Demo = defineComponent({
  name: 'RatingReadOnlyDemo',
  setup: () => () => h(Rating, { value: 3.5, fractions: 2, readOnly: true }),
})

export const readOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
