import { defineComponent, h, ref } from 'vue'
import { Button, Group, ScrollArea, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ScrollArea, Button, Group, Text } from '@mantine-vue/core'

const count = ref(3)
const content =
  'Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside ' +
  'from the chest to the tip of its tail. It has a long neck, small blue eyes, slightly raised ' +
  'nostrils, and two horn-like structures protruding from the back of its rectangular head.'
</script>

<template>
  <ScrollArea.Autosize :mah="300" :maw="400" mx="auto">
    <Text v-for="i in count" :key="i" :mb="i < count ? 'md' : undefined">
      {{ content }}
    </Text>
  </ScrollArea.Autosize>

  <Group justify="center" mt="md">
    <Button @click="count++">Add paragraph</Button>
    <Button @click="count = Math.max(1, count - 1)">Remove paragraph</Button>
  </Group>
</template>
`

const content =
  'Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside ' +
  'from the chest to the tip of its tail. It has a long neck, small blue eyes, slightly raised ' +
  'nostrils, and two horn-like structures protruding from the back of its rectangular head.'

const Demo = defineComponent({
  name: 'ScrollAreaMaxHeightDemo',
  setup() {
    const count = ref(3)

    return () => [
      h(
        ScrollArea.Autosize,
        { mah: 300, maw: 400, mx: 'auto' },
        {
          default: () =>
            Array.from({ length: count.value }, (_, i) =>
              h(
                Text,
                { key: i, mb: i < count.value - 1 ? 'md' : undefined },
                { default: () => content },
              ),
            ),
        },
      ),
      h(
        Group,
        { justify: 'center', mt: 'md' },
        {
          default: () => [
            h(
              Button,
              {
                onClick: () => {
                  count.value++
                },
              },
              { default: () => 'Add paragraph' },
            ),
            h(
              Button,
              {
                onClick: () => {
                  count.value = Math.max(1, count.value - 1)
                },
              },
              { default: () => 'Remove paragraph' },
            ),
          ],
        },
      ),
    ]
  },
})

export const maxHeight: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
