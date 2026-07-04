import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { ColWrapper as Col } from './_col-wrapper'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <Grid{{props}}>
    <Grid.Col :span="4">1</Grid.Col>
    <Grid.Col :span="4">2</Grid.Col>
    <Grid.Col :span="4">3</Grid.Col>
    <Grid.Col :span="4">4</Grid.Col>
    <Grid.Col :span="4">5</Grid.Col>
  </Grid>
</template>
`

const Wrapper = defineComponent({
  name: 'GridGrowConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Grid, { ...attrs }, () => [
        h(Col, { span: 4 }, { default: () => '1' }),
        h(Col, { span: 4 }, { default: () => '2' }),
        h(Col, { span: 4 }, { default: () => '3' }),
        h(Col, { span: 4 }, { default: () => '4' }),
        h(Col, { span: 4 }, { default: () => '5' }),
      ])
  },
})

export const growConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'grow', type: 'boolean', initialValue: true, libraryValue: false },
    { prop: 'gap', type: 'size', initialValue: 'md', libraryValue: 'md' },
  ],
}
