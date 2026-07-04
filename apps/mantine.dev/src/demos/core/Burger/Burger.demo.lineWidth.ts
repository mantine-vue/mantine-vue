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
  <Burger{{props}} size="xl" :opened="opened" @click="opened = !opened" aria-label="Toggle navigation" />
</template>
`

const Wrapper = defineComponent({
  name: 'BurgerLineWidthDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const opened = ref(false)
    return () =>
      h(Burger, {
        ...attrs,
        size: 'xl',
        opened: opened.value,
        onClick: () => {
          opened.value = !opened.value
        },
        'aria-label': 'Toggle navigation',
      })
  },
})

export const lineWidth: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'number',
      prop: 'lineSize',
      initialValue: 2,
      libraryValue: null,
      min: 1,
      max: 10,
      step: 1,
    },
  ],
}
