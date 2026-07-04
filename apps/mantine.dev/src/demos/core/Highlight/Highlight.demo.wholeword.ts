import { defineComponent, h } from 'vue'
import { Highlight, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Highlight, Stack, Text } from '@mantine-vue/core'
</script>

<template>
  <Stack gap="md">
    <div>
      <Text size="sm" :fw="500" :mb="5">
        With whole word matching (wholeWord=true)
      </Text>
      <Highlight highlight="the" wholeWord>The theme is there</Highlight>
    </div>

    <div>
      <Text size="sm" :fw="500" :mb="5">
        Without whole word matching (default)
      </Text>
      <Highlight highlight="the">The theme is there</Highlight>
    </div>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'HighlightWholeWordDemo',
  setup() {
    return () =>
      h(
        Stack,
        { gap: 'md' },
        {
          default: () => [
            h('div', [
              h(
                Text,
                { size: 'sm', fw: 500, mb: 5 },
                { default: () => 'With whole word matching (wholeWord=true)' },
              ),
              h(
                Highlight,
                { highlight: 'the', wholeWord: true },
                { default: () => 'The theme is there' },
              ),
            ]),
            h('div', [
              h(
                Text,
                { size: 'sm', fw: 500, mb: 5 },
                { default: () => 'Without whole word matching (default)' },
              ),
              h(Highlight, { highlight: 'the' }, { default: () => 'The theme is there' }),
            ]),
          ],
        },
      )
  },
})

export const wholeword: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
