import { defineComponent, h, ref, type CSSProperties } from 'vue'
import { Box, Button, Paper, Transition } from '@mantine-vue/core'
import { useClickOutside } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
}

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useClickOutside } from '@mantine-vue/hooks'
import { Transition, Paper, Button, Box } from '@mantine-vue/core'

const opened = ref(false)

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
}

const clickOutsideRef = useClickOutside(() => (opened.value = false))
</script>

<template>
  <Box
    :maw="200"
    pos="relative"
    :style="{ display: 'flex', justifyContent: 'center', margin: 'auto' }"
  >
    <Button @click="opened = true">Open dropdown</Button>
    <Transition :mounted="opened" :transition="scaleY" :duration="200" timing-function="ease" keep-mounted>
      <template #default="styles">
        <Paper
          shadow="md"
          p="xl"
          :h="120"
          pos="absolute"
          :top="0"
          :left="0"
          :right="0"
          :ref="clickOutsideRef"
          :style="{ ...styles, zIndex: 1 }"
        >
          Dropdown
        </Paper>
      </template>
    </Transition>
  </Box>
</template>
`

const Demo = defineComponent({
  name: 'TransitionCustomDemo',
  setup() {
    const opened = ref(false)
    const clickOutsideRef = useClickOutside<HTMLElement>(() => {
      opened.value = false
    })

    return () =>
      h(
        Box,
        {
          maw: 200,
          pos: 'relative',
          style: { display: 'flex', justifyContent: 'center', margin: 'auto' },
        },
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
              {
                mounted: opened.value,
                transition: scaleY,
                duration: 200,
                timingFunction: 'ease',
                keepMounted: true,
              },
              {
                default: (styles: CSSProperties) =>
                  h(
                    Paper,
                    {
                      shadow: 'md',
                      p: 'xl',
                      h: 120,
                      pos: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      ref: clickOutsideRef,
                      style: { ...styles, zIndex: 1 },
                    },
                    { default: () => 'Dropdown' },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const custom: MantineDemo = { type: 'code', component: Demo, code }
