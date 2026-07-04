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
    <Grid.Col span="auto">1</Grid.Col>
    <Grid.Col :span="6">2</Grid.Col>
    <Grid.Col span="auto">3</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridAutoDemo',
  setup() {
    return () =>
      h(Grid, {}, () => [
        h(Col, { span: 'auto' }, { default: () => '1' }),
        h(Col, { span: 6 }, { default: () => '2' }),
        h(Col, { span: 'auto' }, { default: () => '3' }),
      ])
  },
})

export const auto: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
