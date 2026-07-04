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
    <Grid.Col :span="4">1</Grid.Col>
    <Grid.Col :span="4">2</Grid.Col>
    <Grid.Col :span="4">3</Grid.Col>
    <Grid.Col :span="4">4</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridRowsDemo',
  setup() {
    return () =>
      h(Grid, {}, () => [
        h(Col, { span: 4 }, { default: () => '1' }),
        h(Col, { span: 4 }, { default: () => '2' }),
        h(Col, { span: 4 }, { default: () => '3' }),
        h(Col, { span: 4 }, { default: () => '4' }),
      ])
  },
})

export const rows: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
