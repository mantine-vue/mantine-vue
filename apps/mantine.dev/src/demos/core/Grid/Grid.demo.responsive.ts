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
    <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">1</Grid.Col>
    <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">2</Grid.Col>
    <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">3</Grid.Col>
    <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">4</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridResponsiveDemo',
  setup() {
    return () =>
      h(Grid, {}, () => [
        h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '1' }),
        h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '2' }),
        h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '3' }),
        h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '4' }),
      ])
  },
})

export const responsive: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
