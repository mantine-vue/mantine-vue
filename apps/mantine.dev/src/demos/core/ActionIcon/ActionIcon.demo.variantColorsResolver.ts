import { defineComponent, h } from 'vue'
import { ActionIcon, Group } from '@mantine-vue/core'
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
import { ActionIcon, Group, createTheme, MantineProvider } from '@mantine-vue/core'

// Use variantColorResolver in your theme to customize variant colors:
const theme = createTheme({
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'light',
      },
    }),
  },
})
</script>

<template>
  <MantineProvider :theme="theme">
    <Group>
      <ActionIcon color="lime.4" aria-label="Lime action icon"><!-- icon --></ActionIcon>
      <ActionIcon color="orange" variant="outline" aria-label="Orange action icon"><!-- icon --></ActionIcon>
    </Group>
  </MantineProvider>
</template>
`

const Demo = defineComponent({
  name: 'ActionIconVariantColorsResolverDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(ActionIcon, { color: 'lime.4', 'aria-label': 'Lime action icon' }, { default: heartSvg }),
        h(
          ActionIcon,
          { color: 'orange', variant: 'outline', 'aria-label': 'Orange action icon' },
          { default: heartSvg },
        ),
      ],
    }),
})

export const variantColorsResolver: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
