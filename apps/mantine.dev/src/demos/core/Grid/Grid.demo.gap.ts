import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { ColWrapper as Col } from './_col-wrapper'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <Grid :gap="{ base: 5, xs: 'md', md: 'xl', xl: 50 }">
    <Grid.Col :span="4">1</Grid.Col>
    <Grid.Col :span="4">2</Grid.Col>
    <Grid.Col :span="4">3</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridGapDemo',
  setup() {
    return () =>
      h(Grid, { gap: { base: 5, xs: 'md', md: 'xl', xl: 50 } }, () => [
        h(Col, { span: 4 }, { default: () => '1' }),
        h(Col, { span: 4 }, { default: () => '2' }),
        h(Col, { span: 4 }, { default: () => '3' }),
      ])
  },
})

export const gap: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
