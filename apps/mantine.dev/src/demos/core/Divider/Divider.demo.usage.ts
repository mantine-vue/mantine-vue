import { defineComponent, h } from 'vue'
import { Divider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, officiis! Fugit minus ea, perferendis eum consectetur quae vitae. Aliquid, quam reprehenderit? Maiores sed pariatur aliquid commodi atque sunt officiis natus?'

const code = `
<script setup lang="ts">
import { Text, Divider } from '@mantine-vue/core'
</script>

<template>
  <Text>{{ lorem }}</Text>
  <Divider my="md" />
  <Text>{{ lorem }}</Text>
  <Divider my="md" />
  <Text>{{ lorem }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'DividerUsageDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Text, {}, { default: () => lorem }),
        h(Divider, { my: 'md' }),
        h(Text, {}, { default: () => lorem }),
        h(Divider, { my: 'md' }),
        h(Text, {}, { default: () => lorem }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
