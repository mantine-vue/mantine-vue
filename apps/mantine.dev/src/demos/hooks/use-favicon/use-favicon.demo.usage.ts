import { defineComponent, h, ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { useFavicon } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useFavicon } from '@mantine-vue/hooks'
import { Group, Button } from '@mantine-vue/core'

const favicon = ref('https://mantine.dev/favicon.svg')
const setMantineFavicon = () => (favicon.value = 'https://mantine.dev/favicon.svg')
const setMantineUIFavicon = () => (favicon.value = 'https://ui.mantine.dev/favicon.svg')

useFavicon(favicon)
</script>

<template>
  <Group justify="center">
    <Button @click="setMantineFavicon">Mantine favicon</Button>
    <Button @click="setMantineUIFavicon">Mantine UI favicon</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseFaviconUsageDemo',
  setup() {
    const favicon = ref('https://mantine.dev/favicon.svg')
    const setMantineFavicon = () => {
      favicon.value = 'https://mantine.dev/favicon.svg'
    }
    const setMantineUIFavicon = () => {
      favicon.value = 'https://ui.mantine.dev/favicon.svg'
    }

    useFavicon(favicon)

    return () =>
      h(Group, { justify: 'center' }, () => [
        h(Button, { onClick: setMantineFavicon }, { default: () => 'Mantine favicon' }),
        h(Button, { onClick: setMantineUIFavicon }, { default: () => 'Mantine UI favicon' }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
