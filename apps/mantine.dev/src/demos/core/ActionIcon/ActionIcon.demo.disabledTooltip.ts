import { defineComponent, h } from 'vue'
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const heartSvg = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '60%',
      height: '60%',
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
import { ActionIcon, Tooltip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Tooltip for disabled button">
    <ActionIcon
      aria-label="Hover to see tooltip"
      size="xl"
      data-disabled
      @click.prevent
    >
      <!-- heart icon -->
    </ActionIcon>
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconDisabledTooltipDemo',
  setup: () => () =>
    h(
      Tooltip,
      { label: 'Tooltip for disabled button' },
      {
        default: () =>
          h(
            ActionIcon,
            {
              'aria-label': 'Hover to see tooltip',
              size: 'xl',
              'data-disabled': true,
              onClick: (e: Event) => e.preventDefault(),
            },
            { default: heartSvg },
          ),
      },
    ),
})

export const disabledTooltip: MantineDemo = { type: 'code', component: Demo, centered: true, code }
