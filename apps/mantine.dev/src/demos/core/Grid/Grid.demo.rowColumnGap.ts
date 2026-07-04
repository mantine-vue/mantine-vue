import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { ColWrapper as Col } from './_col-wrapper'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <Grid gap="md" rowGap="xl" columnGap="sm">
    <Grid.Col :span="3">1</Grid.Col>
    <Grid.Col :span="3">2</Grid.Col>
    <Grid.Col :span="3">3</Grid.Col>
    <Grid.Col :span="3">4</Grid.Col>
    <Grid.Col :span="3">5</Grid.Col>
    <Grid.Col :span="3">6</Grid.Col>
    <Grid.Col :span="3">7</Grid.Col>
    <Grid.Col :span="3">8</Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridRowColumnGapDemo',
  setup() {
    return () =>
      h(Grid, { gap: 'md', rowGap: 'xl', columnGap: 'sm' }, () =>
        Array.from({ length: 8 }, (_, i) => h(Col, { span: 3 }, { default: () => String(i + 1) })),
      )
  },
})

export const rowColumnGap: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
