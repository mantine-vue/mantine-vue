import { defineComponent, h } from 'vue'
import { PhArrowLeft } from '@phosphor-icons/vue'
import { Anchor, Box, Center } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhArrowLeft } from '@phosphor-icons/vue'
import { Anchor, Box, Center } from '@mantine-vue/core'
</script>

<template>
  <Anchor href="https://mantine-vue" target="_blank">
    <Center inline>
      <PhArrowLeft :size="12" />
      <Box ml="5">Back to Mantine website</Box>
    </Center>
  </Anchor>
</template>
`

const Demo = defineComponent({
  name: 'CenterInlineDemo',
  setup() {
    return () =>
      h(
        Anchor,
        { href: 'https://mantine-vue', target: '_blank' },
        {
          default: () =>
            h(
              Center,
              { inline: true },
              {
                default: () => [
                  h(PhArrowLeft, { size: 12 }),
                  h(Box, { ml: 5 }, { default: () => 'Back to Mantine website' }),
                ],
              },
            ),
        },
      )
  },
})

export const inline: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
