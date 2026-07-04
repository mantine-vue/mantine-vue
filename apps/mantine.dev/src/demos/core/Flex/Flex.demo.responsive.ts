import { defineComponent, h } from 'vue'
import { Flex, Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Flex, Button } from '@mantine-vue/core'
</script>

<template>
  <Flex
    :direction="{ base: 'column', sm: 'row' }"
    :gap="{ base: 'sm', sm: 'lg' }"
    :justify="{ sm: 'center' }"
  >
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </Flex>
</template>
`

const Demo = defineComponent({
  name: 'FlexResponsiveDemo',
  setup() {
    return () =>
      h(
        Flex,
        {
          direction: { base: 'column', sm: 'row' },
          gap: { base: 'sm', sm: 'lg' },
          justify: { sm: 'center' },
        },
        () => [
          h(Button, {}, { default: () => 'Button 1' }),
          h(Button, {}, { default: () => 'Button 2' }),
          h(Button, {}, { default: () => 'Button 3' }),
        ],
      )
  },
})

export const responsive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
