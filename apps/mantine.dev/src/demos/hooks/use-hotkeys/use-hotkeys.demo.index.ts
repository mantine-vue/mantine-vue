import { defineComponent, h, ref } from 'vue'
import { Box, Group, Kbd } from '@mantine-vue/core'
import { useHotkeys } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Box, Group, Kbd } from '@mantine-vue/core'
import { useHotkeys } from '@mantine-vue/hooks'

const lastTriggered = ref('')

useHotkeys([
  ['mod + K', () => (lastTriggered.value = 'Open search')],
  ['mod + J', () => (lastTriggered.value = 'Toggle color scheme')],
  ['mod + shift + alt + X', () => (lastTriggered.value = 'Rick roll')],
])
</script>

<template>
  <Group :gap="7" :p="10">
    <Kbd>Ctrl</Kbd>
    <Box :fw="500">+</Box>
    <Kbd>K</Kbd>
    <Box ms="sm">– Open search</Box>
  </Group>
  <Group :gap="7" :p="10">
    <Kbd>Ctrl</Kbd>
    <Box :fw="500">+</Box>
    <Kbd>J</Kbd>
    <Box ms="sm">– Toggle color scheme</Box>
  </Group>
  <p v-if="lastTriggered">Last triggered: {{ lastTriggered }}</p>
</template>
`

function shortcut(symbol: string, description: string) {
  return h(
    Group,
    { gap: 7, p: 10 },
    {
      default: () => [
        h(Kbd, null, { default: () => 'Ctrl' }),
        h(Box, { fw: 500 }, { default: () => '+' }),
        h(Kbd, null, { default: () => symbol }),
        h(Box, { ms: 'sm' }, { default: () => `– ${description}` }),
      ],
    },
  )
}

const Demo = defineComponent({
  name: 'UseHotkeysIndexDemo',
  setup() {
    const lastTriggered = ref('')

    useHotkeys([
      ['mod + K', () => (lastTriggered.value = 'Open search')],
      ['mod + J', () => (lastTriggered.value = 'Toggle color scheme')],
      ['mod + shift + alt + X', () => (lastTriggered.value = 'Rick roll')],
    ])

    return () =>
      h('div', [
        shortcut('K', 'Open search'),
        shortcut('J', 'Toggle color scheme'),
        lastTriggered.value ? h('p', `Last triggered: ${lastTriggered.value}`) : null,
      ])
  },
})

export const index: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
}
