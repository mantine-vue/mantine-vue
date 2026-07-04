import { defineComponent, h, ref, type CSSProperties } from 'vue'
import { Button, Flex, Paper, Transition } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Flex, Paper, Transition } from '@mantine-vue/core'

const opened = ref(false)
</script>

<template>
  <Flex :maw="200" pos="relative" justify="center" m="auto">
    <Button @click="opened = true">Open dropdown</Button>

    <Transition :mounted="opened" transition="pop" :duration="400">
      <template #default="styles">
        <Paper
          shadow="md"
          p="xl"
          :h="120"
          pos="absolute"
          :inset="0"
          bottom="auto"
          :style="{ ...styles, zIndex: 1 }"
          @click="opened = false"
        >
          Click to close
        </Paper>
      </template>
    </Transition>
  </Flex>
</template>
`

const Demo = defineComponent({
  name: 'TransitionDelayDemo',
  setup() {
    const opened = ref(false)

    return () =>
      h(
        Flex,
        { maw: 200, pos: 'relative', justify: 'center', m: 'auto' },
        {
          default: () => [
            h(
              Button,
              {
                onClick: () => {
                  opened.value = true
                },
              },
              { default: () => 'Open dropdown' },
            ),
            h(
              Transition,
              { mounted: opened.value, transition: 'pop', duration: 400 },
              {
                default: (styles: CSSProperties) =>
                  h(
                    Paper,
                    {
                      shadow: 'md',
                      p: 'xl',
                      h: 120,
                      pos: 'absolute',
                      inset: 0,
                      bottom: 'auto',
                      onClick: () => {
                        opened.value = false
                      },
                      style: { ...styles, zIndex: 1 },
                    },
                    { default: () => 'Click to close' },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const delay: MantineDemo = { type: 'code', component: Demo, code }
