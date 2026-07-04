import { defineComponent, h } from 'vue'
import { Box, Title } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Title, Box } from '@mantine-vue/core'
</script>

<template>
  <Box :maw="400">
    <Title :order="2"{{props}}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure doloremque quas dolorum. Quo
      amet earum alias consequuntur quam accusamus a quae beatae, odio, quod provident consectetur
      non repudiandae enim adipisci?
    </Title>
  </Box>
</template>
`

const Wrapper = defineComponent({
  name: 'TitleLineClampDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Box,
        { maw: 400 },
        {
          default: () =>
            h(
              Title,
              { order: 2, ...(attrs as any) },
              {
                default: () =>
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure doloremque quas dolorum. Quo amet earum alias consequuntur quam accusamus a quae beatae, odio, quod provident consectetur non repudiandae enim adipisci?',
              },
            ),
        },
      )
  },
})

export const lineClamp: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { type: 'number', prop: 'lineClamp', initialValue: 2, libraryValue: null, min: 1, max: 8 },
  ],
}
