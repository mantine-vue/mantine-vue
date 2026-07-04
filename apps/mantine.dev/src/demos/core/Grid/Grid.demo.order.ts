import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { ColWrapper as Col } from './_col-wrapper'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <Grid>
    <Grid.Col :span="3" :order="{ base: 2, sm: 1, lg: 3 }">2</Grid.Col>
    <Grid.Col :span="3" :order="{ base: 3, sm: 2, lg: 2 }">3</Grid.Col>
    <Grid.Col :span="3" :order="{ base: 1, sm: 3, lg: 1 }">1</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridOrderDemo',
  setup() {
    return () =>
      h(Grid, {}, () => [
        h(Col, { span: 3, order: { base: 2, sm: 1, lg: 3 } }, { default: () => '2' }),
        h(Col, { span: 3, order: { base: 3, sm: 2, lg: 2 } }, { default: () => '3' }),
        h(Col, { span: 3, order: { base: 1, sm: 3, lg: 1 } }, { default: () => '1' }),
      ])
  },
})

export const order: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
