import { defineComponent, h } from 'vue'
import { Grid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Grid } from '@mantine-vue/core'
</script>

<template>
  <Grid align="stretch">
    <Grid.Col :span="4" align="flex-start">
      <div style="height: 100px; background: var(--mantine-color-blue-light)">
        flex-start
      </div>
    </Grid.Col>
    <Grid.Col :span="4" align="center">
      <div style="height: 100px; background: var(--mantine-color-blue-light)">
        center
      </div>
    </Grid.Col>
    <Grid.Col :span="4" align="flex-end">
      <div style="height: 100px; background: var(--mantine-color-blue-light)">
        flex-end
      </div>
    </Grid.Col>
  </Grid>
</template>
`

const Demo = defineComponent({
  name: 'GridColumnAlignDemo',
  setup() {
    const colStyle = {
      height: '100px',
      background: 'var(--mantine-color-blue-light)',
      padding: '4px',
      borderRadius: 'var(--mantine-radius-sm)',
      textAlign: 'center' as const,
    }
    return () =>
      h(Grid, { align: 'stretch' }, () => [
        h(
          Grid.Col,
          { span: 4, align: 'flex-start', style: { minHeight: '150px' } },
          { default: () => h('div', { style: colStyle }, 'flex-start') },
        ),
        h(
          Grid.Col,
          { span: 4, align: 'center', style: { minHeight: '150px' } },
          { default: () => h('div', { style: colStyle }, 'center') },
        ),
        h(
          Grid.Col,
          { span: 4, align: 'flex-end', style: { minHeight: '150px' } },
          { default: () => h('div', { style: colStyle }, 'flex-end') },
        ),
      ])
  },
})

export const columnAlign: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
