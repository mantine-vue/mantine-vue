import { defineComponent, h } from 'vue'
import { Text, Typography } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Typography, Text } from '@mantine-vue/core'
</script>

<template>
  <Text :lineClamp="3" component="div">
    <Typography>
      <h3>Line clamp with Typography</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nulla quam aut sed
        corporis voluptates praesentium inventore, sapiente ex tempore sit consequatur debitis
        non! Illo cum ipsa reiciendis quidem facere, deserunt eos totam impedit. Vel ab, ipsum
        veniam aperiam odit molestiae incidunt minus, sint eos iusto earum quaerat vitae
        perspiciatis.
      </p>
    </Typography>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'TextLineClampDemo',
  setup() {
    return () =>
      h(
        Text,
        { lineClamp: 3, component: 'div' },
        {
          default: () =>
            h(
              Typography,
              {},
              {
                default: () => [
                  h('h3', { style: { marginTop: 0 } }, 'Line clamp with Typography'),
                  h(
                    'p',
                    {},
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nulla quam aut sed corporis voluptates praesentium inventore, sapiente ex tempore sit consequatur debitis non! Illo cum ipsa reiciendis quidem facere, deserunt eos totam impedit. Vel ab, ipsum veniam aperiam odit molestiae incidunt minus, sint eos iusto earum quaerat vitae perspiciatis.',
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const lineClamp: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
