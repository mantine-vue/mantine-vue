import { defineComponent, h } from 'vue'
import { Box, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, Box } from '@mantine-vue/core'
</script>

<template>
  <Box :w="300">
    <Text{{props}}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde provident eos fugiat id
      necessitatibus magni ducimus molestias. Placeat, consequatur. Quisquam, quae magnam
      perspiciatis excepturi iste sint itaque sunt laborum. Nihil?
    </Text>
  </Box>
</template>
`

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde provident eos fugiat id necessitatibus magni ducimus molestias. Placeat, consequatur. Quisquam, quae magnam perspiciatis excepturi iste sint itaque sunt laborum. Nihil?'

const Wrapper = defineComponent({
  name: 'TextTruncateDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Box,
        { w: 300 },
        {
          default: () => h(Text, { ...(attrs as any) }, { default: () => lorem }),
        },
      )
  },
})

export const truncate: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'segmented',
      prop: 'truncate',
      data: ['start', 'end'],
      initialValue: 'end',
      libraryValue: null,
    },
  ],
}
