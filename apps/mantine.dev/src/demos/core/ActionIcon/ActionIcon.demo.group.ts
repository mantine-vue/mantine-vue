import { defineComponent, h } from 'vue'
import { ActionIcon, ActionIconGroup } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const imageSvg = () =>
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
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
      h('circle', { cx: '8.5', cy: '8.5', r: '1.5' }),
      h('polyline', { points: '21 15 16 10 5 21' }),
    ],
  )

const gearSvg = () =>
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
        d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
      }),
      h('circle', { cx: '12', cy: '12', r: '3' }),
    ],
  )

const heartSvg = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 20,
      height: 20,
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
import { ActionIcon, ActionIconGroup } from '@mantine-vue/core'
</script>

<template>
  <ActionIconGroup{{props}}>
    <ActionIcon variant="default" size="lg" aria-label="Gallery">
      <!-- image icon -->
    </ActionIcon>
    <ActionIcon variant="default" size="lg" aria-label="Settings">
      <!-- gear icon -->
    </ActionIcon>
    <ActionIcon variant="default" size="lg" aria-label="Likes">
      <!-- heart icon -->
    </ActionIcon>
  </ActionIconGroup>
</template>
`

const Wrapper = defineComponent({
  name: 'ActionIconGroupDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        ActionIconGroup,
        { ...attrs },
        {
          default: () => [
            h(
              ActionIcon,
              { variant: 'default', size: 'lg', 'aria-label': 'Gallery' },
              { default: imageSvg },
            ),
            h(
              ActionIcon,
              { variant: 'default', size: 'lg', 'aria-label': 'Settings' },
              { default: gearSvg },
            ),
            h(
              ActionIcon,
              { variant: 'default', size: 'lg', 'aria-label': 'Likes' },
              { default: heartSvg },
            ),
          ],
        },
      )
  },
})

export const group: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'segmented',
      prop: 'orientation',
      data: ['horizontal', 'vertical'],
      initialValue: 'horizontal',
      libraryValue: 'horizontal',
    },
  ],
}
