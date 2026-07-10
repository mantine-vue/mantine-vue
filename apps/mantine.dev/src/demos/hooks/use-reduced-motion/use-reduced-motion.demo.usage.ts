import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import { useReducedMotion } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
import { useReducedMotion } from '@mantine-vue/hooks'

const reduceMotion = useReducedMotion()
</script>

<template>
  <Badge
    :color="reduceMotion ? 'red' : 'teal'"
    :style="{ transitionDuration: reduceMotion ? '0ms' : '200ms' }"
    variant="filled"
  >
    {{ reduceMotion ? 'You prefer to reduce motion' : 'You prefer not to reduce motion' }}
  </Badge>
</template>
`

const Demo = defineComponent({
  name: 'UseReducedMotionUsageDemo',
  setup() {
    const reduceMotion = useReducedMotion()

    return () =>
      h(
        Badge,
        {
          color: reduceMotion.value ? 'red' : 'teal',
          style: { transitionDuration: reduceMotion.value ? '0ms' : '200ms' },
          variant: 'filled',
        },
        {
          default: () =>
            reduceMotion.value ? 'You prefer to reduce motion' : 'You prefer not to reduce motion',
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
