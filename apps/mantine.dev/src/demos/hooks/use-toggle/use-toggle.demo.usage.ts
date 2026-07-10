import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { upperFirst, useToggle } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { upperFirst, useToggle } from '@mantine-vue/hooks'

const [value, toggle] = useToggle(['blue', 'orange', 'cyan', 'teal'])
</script>

<template>
  <Button :color="value" @click="toggle()">{{ upperFirst(value) }}</Button>
</template>
`

const Demo = defineComponent({
  name: 'UseToggleUsageDemo',
  setup() {
    const [value, toggle] = useToggle(['blue', 'orange', 'cyan', 'teal'])

    return () =>
      h(
        Button,
        { color: value.value, onClick: () => toggle() },
        {
          default: () => upperFirst(value.value),
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
