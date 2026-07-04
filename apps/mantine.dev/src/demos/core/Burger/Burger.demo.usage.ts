import { defineComponent, h, ref } from 'vue'
import { Burger } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Burger } from '@mantine-vue/core'

const opened = ref(false)
</script>

<template>
  <Burger{{props}} :opened="opened" @click="opened = !opened" aria-label="Toggle navigation" />
</template>
`

const Wrapper = defineComponent({
  name: 'BurgerUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const opened = ref(false)
    return () =>
      h(Burger, {
        ...attrs,
        opened: opened.value,
        onClick: () => {
          opened.value = !opened.value
        },
        'aria-label': 'Toggle navigation',
      })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [{ type: 'size', prop: 'size', initialValue: 'md', libraryValue: 'md' }],
}
