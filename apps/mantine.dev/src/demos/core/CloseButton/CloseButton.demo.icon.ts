import { defineComponent, h } from 'vue'
import { CloseButton } from '@mantine-vue/core'
import { PhXCircle } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { CloseButton } from '@mantine-vue/core'
import { PhXCircle } from '@phosphor-icons/vue'
</script>

<template>
  <CloseButton :icon="h(PhXCircle, { size: 18 })" />
</template>
`

const Demo = defineComponent({
  name: 'CloseButtonIconDemo',
  setup() {
    return () => h(CloseButton, { icon: h(PhXCircle, { size: 18 }) })
  },
})

export const icon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
