import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput full-width label="Color" placeholder="Pick color" />
</template>`

const Demo = defineComponent({
  name: 'ColorInputFullWidthDemo',
  setup: () => () => h(ColorInput, { fullWidth: true, label: 'Color', placeholder: 'Pick color' }),
})

export const fullWidth: MantineDemo = { type: 'code', component: Demo, code }
