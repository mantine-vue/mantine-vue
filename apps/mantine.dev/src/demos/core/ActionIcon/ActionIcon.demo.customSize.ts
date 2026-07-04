import { defineComponent, h } from 'vue'
import { ActionIcon, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const heartSvg = (size: number) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    },
    [
      h('path', {
        d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      }),
    ],
  )

const code = `
<script setup lang="ts">
import { ActionIcon, Group } from '@mantine-vue/core'
</script>

<style>
/* ActionIcon sizes are defined by --ai-size-{x} CSS variables */
:root {
  --ai-size-xxl: 4rem;
}
</style>

<template>
  <Group>
    <ActionIcon size="lg" aria-label="Large"><!-- icon --></ActionIcon>
    <ActionIcon size="xl" aria-label="XL"><!-- icon --></ActionIcon>
    <!-- Custom size: use a CSS variable or numeric value -->
    <ActionIcon :size="64" aria-label="64px custom"><!-- icon --></ActionIcon>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconCustomSizeDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(ActionIcon, { size: 'lg', 'aria-label': 'Large' }, { default: () => heartSvg(18) }),
        h(ActionIcon, { size: 'xl', 'aria-label': 'XL' }, { default: () => heartSvg(24) }),
        h(ActionIcon, { size: 64, 'aria-label': '64px custom' }, { default: () => heartSvg(32) }),
      ],
    }),
})

export const customSize: MantineDemo = { type: 'code', component: Demo, centered: true, code }
