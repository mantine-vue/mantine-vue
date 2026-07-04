import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
</script>

<template>
  <Text
    size="xl"
    :fw="900"
    variant="gradient"
    :gradient="{ from: 'blue', to: 'cyan', deg: 90 }"
  >
    Gradient Text
  </Text>
</template>
`

const Wrapper = defineComponent({
  name: 'TextGradientDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => {
      const { gradientFrom, gradientTo, gradientDegree, ...rest } = attrs as any
      return h(
        Text,
        {
          size: 'xl',
          fw: 900,
          variant: 'gradient',
          gradient: {
            from: gradientFrom ?? 'blue',
            to: gradientTo ?? 'cyan',
            deg: gradientDegree ?? 90,
          },
          ...rest,
        },
        { default: () => 'Gradient Text' },
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
