import { defineComponent, h } from 'vue'
import { Pill } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Pill } from '@mantine-vue/core'
</script>

<template>
  <Pill{{props}} with-remove-button>Test pill</Pill>
</template>
`

const Demo = defineComponent({
  name: 'PillStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'div',
        {
          style: {
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        [h(Pill, { withRemoveButton: true, style: { flex: '0' }, ...attrs }, () => 'Test pill')],
      )
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      label: 'Pill label (children)',
      remove: 'Remove button',
    },
  },
  component: Demo,
  code,
  centered: true,
  maxWidth: 200,
}
