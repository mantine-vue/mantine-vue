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
        With case-insensitive matching (default)
      </Text>
      <Highlight highlight="this">Highlight This, definitely THIS and also this!</Highlight>
    </div>

    <div>
      <Text size="sm" :fw="500" :mb="5">
        With case-sensitive matching (caseInsensitive=false)
      </Text>
      <Highlight highlight="this" :caseInsensitive="false">
        Highlight This, definitely THIS and also this!
      </Highlight>
    </div>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'HighlightCaseInsensitiveDemo',
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
                { default: () => 'With case-insensitive matching (default)' },
              ),
              h(
                Highlight,
                { highlight: 'this' },
                { default: () => 'Highlight This, definitely THIS and also this!' },
              ),
            ]),
            h('div', [
              h(
                Text,
                { size: 'sm', fw: 500, mb: 5 },
                { default: () => 'With case-sensitive matching (caseInsensitive=false)' },
              ),
              h(
                Highlight,
                { highlight: 'this', caseInsensitive: false },
                { default: () => 'Highlight This, definitely THIS and also this!' },
              ),
            ]),
          ],
        },
      )
  },
})

export const caseInsensitive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
