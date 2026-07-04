import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { ColWrapper as Col } from './_col-wrapper'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <Grid :columns="24">
    <Grid.Col :span="12">1</Grid.Col>
    <Grid.Col :span="6">2</Grid.Col>
    <Grid.Col :span="6">3</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridColumnsDemo',
  setup() {
    return () =>
      h(Grid, { columns: 24 }, () => [
        h(Col, { span: 12 }, { default: () => '1' }),
        h(Col, { span: 6 }, { default: () => '2' }),
        h(Col, { span: 6 }, { default: () => '3' }),
      ])
  },
})

export const columns: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
