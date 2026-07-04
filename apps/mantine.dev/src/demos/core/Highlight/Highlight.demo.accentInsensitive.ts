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
        With accent-insensitive matching (default)
      </Text>
      <Highlight highlight="cafe">We visited café and cafe.</Highlight>
    </div>

    <div>
      <Text size="sm" :fw="500" :mb="5">
        With accent-sensitive matching (accentInsensitive=false)
      </Text>
      <Highlight highlight="cafe" :accentInsensitive="false">
        We visited café and cafe.
      </Highlight>
    </div>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'HighlightAccentInsensitiveDemo',
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
                { default: () => 'With accent-insensitive matching (default)' },
              ),
              h(Highlight, { highlight: 'cafe' }, { default: () => 'We visited café and cafe.' }),
            ]),
            h('div', [
              h(
                Text,
                { size: 'sm', fw: 500, mb: 5 },
                { default: () => 'With accent-sensitive matching (accentInsensitive=false)' },
              ),
              h(
                Highlight,
                { highlight: 'cafe', accentInsensitive: false },
                { default: () => 'We visited café and cafe.' },
              ),
            ]),
          ],
        },
      )
  },
})

export const accentInsensitive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
