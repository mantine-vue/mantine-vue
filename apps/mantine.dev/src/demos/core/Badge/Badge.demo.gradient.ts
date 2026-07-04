import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
</script>

<template>
  <Badge
    size="xl"
    variant="gradient"
    :gradient="{ from: 'blue', to: 'cyan', deg: 90 }"
  >
    Gradient badge
  </Badge>
</template>
`

const Wrapper = defineComponent({
  name: 'BadgeGradientDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => {
      const { gradientFrom, gradientTo, gradientDegree, ...rest } = attrs as any
      return h(
        Badge,
        {
          size: 'xl',
          variant: 'gradient',
          gradient: {
            from: gradientFrom ?? 'blue',
            to: gradientTo ?? 'cyan',
            deg: gradientDegree ?? 90,
          },
          ...rest,
        },
        { default: () => 'Gradient badge' },
      )
    }
  },
})

export const gradient: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { type: 'color', prop: 'gradientFrom', initialValue: 'blue', libraryValue: '__none__' },
    { type: 'color', prop: 'gradientTo', initialValue: 'cyan', libraryValue: '__none__' },
    {
      type: 'number',
      prop: 'gradientDegree',
      initialValue: 90,
      min: 0,
      max: 360,
      libraryValue: '__none__',
    },
  ],
}
