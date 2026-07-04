import { defineComponent, h } from 'vue'
import { ActionIcon, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const fingerprintSvg = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
    },
    [
      h('path', {
        d: 'M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4',
      }),
      h('path', {
        d: 'M5 19.5C5.5 18 6 15 6 12c0-1.7.5-3.2 1.5-4.3',
      }),
      h('path', {
        d: 'M22 12c0 3-1 5-3 7',
      }),
      h('path', {
        d: 'M12 12c0 3-1 5.5-2.5 7.5',
      }),
      h('path', {
        d: 'M12 7c2.8 0 5 2.2 5 5 0 .5 0 1-.1 1.5',
      }),
    ],
  )

const code = `
<script setup lang="ts">
import { ActionIcon, Group } from '@mantine-vue/core'
</script>

<template>
  <Group>
    <ActionIcon aria-label="default action icon" size="lg" color="lime.4">
      <!-- fingerprint icon -->
    </ActionIcon>
    <ActionIcon auto-contrast aria-label="autoContrast action icon" size="lg" color="lime.4">
      <!-- fingerprint icon -->
    </ActionIcon>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconAutoContrastDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(
          ActionIcon,
          { 'aria-label': 'default action icon', size: 'lg', color: 'lime.4' },
          { default: fingerprintSvg },
        ),
        h(
          ActionIcon,
          {
            autoContrast: true,
            'aria-label': 'autoContrast action icon',
            size: 'lg',
            color: 'lime.4',
          },
          { default: fingerprintSvg },
        ),
      ],
    }),
})

export const autoContrast: MantineDemo = { type: 'code', component: Demo, code, centered: true }
