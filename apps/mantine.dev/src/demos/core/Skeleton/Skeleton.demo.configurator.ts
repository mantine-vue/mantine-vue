import { defineComponent, h } from 'vue'
import { Skeleton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Skeleton } from '@mantine-vue/core'
</script>

<template>
  <div>
    <Skeleton height="50" circle mb="xl" />
    <Skeleton height="8" radius="xl" />
    <Skeleton height="8" :mt="6" radius="xl" />
    <Skeleton height="8" :mt="6" width="70%" radius="xl" />
  </div>
</template>
`

const Wrapper = defineComponent({
  name: 'SkeletonConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h('div', [
        h(Skeleton, { height: 50, circle: true, mb: 'xl', ...(attrs as any) }),
        h(Skeleton, { height: 8, radius: 'xl', ...(attrs as any) }),
        h(Skeleton, { height: 8, mt: 6, radius: 'xl', ...(attrs as any) }),
        h(Skeleton, { height: 8, mt: 6, width: '70%', radius: 'xl', ...(attrs as any) }),
      ])
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [{ prop: 'animate', type: 'boolean', initialValue: true, libraryValue: true }],
}
