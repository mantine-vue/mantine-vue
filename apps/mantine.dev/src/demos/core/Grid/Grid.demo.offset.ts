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
    <Grid.Col :span="3">1</Grid.Col>
    <Grid.Col :span="3">2</Grid.Col>
    <Grid.Col :span="3" :offset="3">3</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridOffsetDemo',
  setup() {
    return () =>
      h(Grid, {}, () => [
        h(Col, { span: 3 }, { default: () => '1' }),
        h(Col, { span: 3 }, { default: () => '2' }),
        h(Col, { span: 3, offset: 3 }, { default: () => '3' }),
      ])
  },
})

export const offset: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
