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
    <Grid.Col span="content">fit content</Grid.Col>
    <Grid.Col :span="6">2</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridContentDemo',
  setup() {
    return () =>
      h(Grid, {}, () => [
        h(Col, { span: 'content' }, { default: () => 'fit content' }),
        h(Col, { span: 6 }, { default: () => '2' }),
      ])
  },
})

export const content: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
