import { defineComponent, h } from 'vue'
import { randomId, useHash } from '@mantine-vue/hooks'
import { Button, Code, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { randomId, useHash } from '@mantine-vue/hooks'
import { Button, Code, Group, Text } from '@mantine-vue/core'

const [hash, setHash] = useHash()
</script>

<template>
  <Group justify="center">
    <Button @click="setHash(randomId())">Set hash to random string</Button>
  </Group>
  <Text ta="center" mt="md">
    Current hash: <Code>{{ hash }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseHashUsageDemo',
  setup() {
    const [hash, setHash] = useHash()

    return () =>
      h('div', [
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h(
                Button,
                { onClick: () => setHash(randomId()) },
                { default: () => 'Set hash to random string' },
              ),
          },
        ),
        h(
          Text,
          { ta: 'center', mt: 'md' },
          {
            default: () => ['Current hash: ', h(Code, null, { default: () => hash.value })],
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
