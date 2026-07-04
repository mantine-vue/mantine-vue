import { defineComponent, h } from 'vue'
import { Chip } from '@mantine-vue/core'
import { PhX } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Chip } from '@mantine-vue/core'
import { PhX } from '@phosphor-icons/vue'
</script>

<template>
  <Chip :icon="h(PhX, { size: 16 })" color="red" variant="filled" defaultChecked>
    Forbidden
  </Chip>
</template>
`

const Demo = defineComponent({
  name: 'ChipIconDemo',
  setup: () => () =>
    h(
      Chip,
      { icon: h(PhX, { size: 16 }), color: 'red', variant: 'filled', defaultChecked: true },
      { default: () => 'Forbidden' },
    ),
})

export const icon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
