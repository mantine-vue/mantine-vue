import { defineComponent, h, ref } from 'vue'
import { PhCheck, PhX } from '@phosphor-icons/vue'
import { Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { PhCheck, PhX } from '@phosphor-icons/vue'
import { Switch } from '@mantine-vue/core'

const checked = ref(false)
</script>

<template>
  <Switch
    v-model="checked"
    color="teal"
    size="md"
    label="Switch with thumb icon"
    :thumb-icon="checked
      ? h(PhCheck, { size: 12, color: 'var(--mantine-color-teal-6)' })
      : h(PhX, { size: 12, color: 'var(--mantine-color-red-6)' })"
  />
</template>
`

const Demo = defineComponent({
  name: 'SwitchThumbIconDemo',
  setup() {
    const checked = ref(false)
    return () =>
      h(Switch, {
        checked: checked.value,
        onChange: (e: Event) => {
          checked.value = (e.target as HTMLInputElement).checked
        },
        color: 'teal',
        size: 'md',
        label: 'Switch with thumb icon',
        thumbIcon: checked.value
          ? h(PhCheck, { size: 12, color: 'var(--mantine-color-teal-6)' })
          : h(PhX, { size: 12, color: 'var(--mantine-color-red-6)' }),
      })
  },
})

export const thumbIcon: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
