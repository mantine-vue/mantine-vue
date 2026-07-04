import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { ColWrapper as Col } from './_col-wrapper'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <!-- Wrapper div is added for demonstration purposes only.
       It is not required in real projects. -->
  <div style="resize: horizontal; overflow: hidden; max-width: 100%">
    <Grid
      type="container"
      :breakpoints="{ xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' }"
    >
      <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">1</Grid.Col>
      <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">2</Grid.Col>
      <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">3</Grid.Col>
      <Grid.Col :span="{ base: 12, md: 6, lg: 3 }">4</Grid.Col>
    </Grid>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'GridContainerDemo',
  setup() {
    return () =>
      h('div', { style: { resize: 'horizontal', overflow: 'hidden', maxWidth: '100%' } }, [
        h(
          Grid,
          {
            type: 'container',
            breakpoints: { xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' },
          },
          () => [
            h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '1' }),
            h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '2' }),
            h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '3' }),
            h(Col, { span: { base: 12, md: 6, lg: 3 } }, { default: () => '4' }),
          ],
        ),
      ])
  },
})

export const container: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
