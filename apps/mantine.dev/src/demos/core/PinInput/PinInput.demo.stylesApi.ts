import { defineComponent, h } from 'vue'
import { PinInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PinInput } from '@mantine-vue/core'
</script>

<template>
  <PinInput{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'PinInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(PinInput, { ...attrs })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element, contains all pin inputs',
      pinInput: 'Wrapper element around each individual input',
      input: 'Individual pin input element',
    },
  },
  component: Wrapper,
  code,
  centered: true,
}
