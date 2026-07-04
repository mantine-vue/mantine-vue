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
    <Grid.Col :span="3" :h="80">1</Grid.Col>
    <Grid.Col :span="3" :h="120">2</Grid.Col>
    <Grid.Col :span="3" :h="100">3</Grid.Col>
  </Grid>
</template>
`

const Wrapper = defineComponent({
  name: 'GridFlexConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Grid, { ...attrs }, () => [
        h(Col, { span: 3, h: 80 }, { default: () => '1' }),
        h(Col, { span: 3, h: 120 }, { default: () => '2' }),
        h(Col, { span: 3, h: 100 }, { default: () => '3' }),
      ])
  },
})

export const flexConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    {
      prop: 'justify',
      type: 'select',
      initialValue: 'flex-start',
      libraryValue: '__',
      data: [
        { label: 'flex-start', value: 'flex-start' },
        { label: 'flex-end', value: 'flex-end' },
        { label: 'center', value: 'center' },
        { label: 'space-between', value: 'space-between' },
        { label: 'space-around', value: 'space-around' },
      ],
    },
    {
      prop: 'align',
      type: 'select',
      initialValue: 'flex-start',
      libraryValue: '__',
      data: [
        { label: 'flex-start', value: 'flex-start' },
        { label: 'flex-end', value: 'flex-end' },
        { label: 'center', value: 'center' },
      ],
    },
  ],
}
