import { defineComponent, h, ref } from 'vue'
import { ActionIcon, Group, Switch } from '@mantine-vue/core'
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
import { ref } from 'vue'
import { ActionIcon, Group, Switch } from '@mantine-vue/core'

const loading = ref(false)
</script>

<template>
  <Group>
    <ActionIcon :loading="loading" aria-label="Like">
      <!-- heart icon -->
    </ActionIcon>
    <ActionIcon variant="light" :loading="loading" aria-label="Like">
      <!-- heart icon -->
    </ActionIcon>
    <ActionIcon variant="outline" :loading="loading" aria-label="Like">
      <!-- heart icon -->
    </ActionIcon>
  </Group>

  <Switch :checked="loading" @change="loading = !loading" label="Loading state" mt="md" />
</template>
`

const Demo = defineComponent({
  name: 'ActionIconLoadingDemo',
  setup() {
    const loading = ref(false)
    return () =>
      h('div', null, [
        h(Group, null, {
          default: () => [
            h(
              ActionIcon,
              { loading: loading.value, 'aria-label': 'Like' },
              { default: () => heartSvg(18) },
            ),
            h(
              ActionIcon,
              { variant: 'light', loading: loading.value, 'aria-label': 'Like' },
              { default: () => heartSvg(18) },
            ),
            h(
              ActionIcon,
              { variant: 'outline', loading: loading.value, 'aria-label': 'Like' },
              { default: () => heartSvg(18) },
            ),
          ],
        }),
        h(Switch, {
          checked: loading.value,
          onChange: () => {
            loading.value = !loading.value
          },
          label: 'Loading state',
          mt: 'md',
        }),
      ])
  },
})

export const loading: MantineDemo = { type: 'code', component: Demo, centered: true, code }
