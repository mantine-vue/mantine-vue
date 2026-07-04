import { defineComponent, h } from 'vue'
import { ThemeIcon } from '@mantine-vue/core'
import { PhHeart } from '@phosphor-icons/vue'
import { gradientControls } from '../../shared/variants-data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ThemeIcon } from '@mantine-vue/core'
import { PhHeart } from '@phosphor-icons/vue'
</script>

<template>
  <ThemeIcon
    variant="gradient"
    {{props}}
    size="xl"
    aria-label="Gradient action icon"
   
  >
    <PhHeart />
  </ThemeIcon>
</template>
`

const Wrapper = defineComponent({
  name: 'ThemeIconGradientDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const a = attrs as any
    return () =>
      h(
        ThemeIcon,
        {
          variant: 'gradient',
          size: 'xl',
          'aria-label': 'Gradient action icon',
          gradient: {
            from: a.gradientFrom ?? 'blue',
            to: a.gradientTo ?? 'cyan',
            deg: a.gradientDegree ?? 90,
          },
        },
        { default: () => h(PhHeart) },
      )
  },
})

export const gradient: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: gradientControls,
}
