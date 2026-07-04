import { defineComponent, h, ref } from 'vue'
import { Badge, Box, Group, ScrollArea, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Box, Group, ScrollArea, Stack, Text } from '@mantine-vue/core'

const topReached = ref(0)
const bottomReached = ref(0)
const leftReached = ref(0)
const rightReached = ref(0)
</script>

<template>
  <Stack align="center">
    <Group>
      <Badge color="blue">Top: {{ topReached }}</Badge>
      <Badge color="green">Bottom: {{ bottomReached }}</Badge>
      <Badge color="orange">Left: {{ leftReached }}</Badge>
      <Badge color="grape">Right: {{ rightReached }}</Badge>
    </Group>

    <ScrollArea
      :h="200"
      :w="300"
      :onTopReached="() => topReached++"
      :onBottomReached="() => bottomReached++"
      :onLeftReached="() => leftReached++"
      :onRightReached="() => rightReached++"
    >
      <Box :w="600">
        <Text v-for="i in 50" :key="i">
          Line {{ i }} - This is a long line that requires horizontal scrolling
        </Text>
      </Box>
    </ScrollArea>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'ScrollAreaBoundariesDemo',
  setup() {
    const topReached = ref(0)
    const bottomReached = ref(0)
    const leftReached = ref(0)
    const rightReached = ref(0)

    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h(
              Group,
              {},
              {
                default: () => [
                  h(Badge, { color: 'blue' }, { default: () => `Top: ${topReached.value}` }),
                  h(Badge, { color: 'green' }, { default: () => `Bottom: ${bottomReached.value}` }),
                  h(Badge, { color: 'orange' }, { default: () => `Left: ${leftReached.value}` }),
                  h(Badge, { color: 'grape' }, { default: () => `Right: ${rightReached.value}` }),
                ],
              },
            ),
            h(
              ScrollArea,
              {
                h: 200,
                w: 300,
                onTopReached: () => {
                  topReached.value++
                },
                onBottomReached: () => {
                  bottomReached.value++
                },
                onLeftReached: () => {
                  leftReached.value++
                },
                onRightReached: () => {
                  rightReached.value++
                },
              },
              {
                default: () =>
                  h(
                    Box,
                    { w: 600 },
                    {
                      default: () =>
                        Array.from({ length: 50 }, (_, i) =>
                          h(
                            Text,
                            { key: i },
                            {
                              default: () =>
                                `Line ${i + 1} - This is a long line that requires horizontal scrolling`,
                            },
                          ),
                        ),
                    },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const boundaries: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
