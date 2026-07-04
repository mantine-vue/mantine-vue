import { defineComponent, h } from 'vue'
import { PhMoonStars, PhSun } from '@phosphor-icons/vue'
import { Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhSun, PhMoonStars } from '@phosphor-icons/vue'
import { Switch } from '@mantine-vue/core'
</script>

<template>
  <Switch
    size="md"
    color="dark.4"
    :on-label="h(PhSun, { size: 16, color: 'var(--mantine-color-yellow-4)' })"
    :off-label="h(PhMoonStars, { size: 16, color: 'var(--mantine-color-blue-6)' })"
  />
</template>
`

const Demo = defineComponent({
  name: 'SwitchIconLabelsDemo',
  setup: () => () =>
    h(Switch, {
      size: 'md',
      color: 'dark.4',
      onLabel: h(PhSun, { size: 16, color: 'var(--mantine-color-yellow-4)' }),
      offLabel: h(PhMoonStars, { size: 16, color: 'var(--mantine-color-blue-6)' }),
    }),
})

export const iconLabels: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
