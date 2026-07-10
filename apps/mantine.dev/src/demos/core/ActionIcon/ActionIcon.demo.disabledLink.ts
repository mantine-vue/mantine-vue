import { defineComponent, h } from 'vue'
import { ActionIcon } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ActionIcon } from '@mantine-vue/core'
</script>

<template>
  <ActionIcon
    component="a"
    href="https://mantine-vue"
    data-disabled
    size="xl"
    aria-label="Open in a new tab"
    @click.prevent
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  </ActionIcon>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconDisabledLinkDemo',
  setup: () => () =>
    h(
      ActionIcon,
      {
        component: 'a',
        href: 'https://mantine-vue',
        'data-disabled': true,
        size: 'xl',
        'aria-label': 'Open in a new tab',
        onClick: (e: Event) => e.preventDefault(),
      },
      {
        default: () =>
          h(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '60%',
              height: '60%',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '2',
            },
            [
              h('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
              h('polyline', { points: '15 3 21 3 21 9' }),
              h('line', { x1: '10', y1: '14', x2: '21', y2: '3' }),
            ],
          ),
      },
    ),
})

export const disabledLink: MantineDemo = { type: 'code', component: Demo, centered: true, code }
