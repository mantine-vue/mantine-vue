import { defineComponent, h } from 'vue'
import { useWindowScroll } from '@mantine-vue/hooks'
import { Button, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useWindowScroll } from '@mantine-vue/hooks'
import { Button, Group, Text } from '@mantine-vue/core'

const [scroll, scrollTo] = useWindowScroll()
</script>

<template>
  <Group justify="center">
    <Text>Scroll position x: {{ scroll.x }}, y: {{ scroll.y }}</Text>
    <Button @click="scrollTo({ y: 0 })">Scroll to top</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseWindowScrollUsageDemo',
  setup() {
    const [scroll, scrollTo] = useWindowScroll()

    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(Text, null, {
              default: () => `Scroll position x: ${scroll.value.x}, y: ${scroll.value.y}`,
            }),
            h(Button, { onClick: () => scrollTo({ y: 0 }) }, { default: () => 'Scroll to top' }),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
