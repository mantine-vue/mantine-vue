import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { useLongPress } from '@mantine-vue/hooks'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { useLongPress } from '@mantine-vue/hooks'
import { notifications } from '@mantine-vue/notifications'

const handlers = useLongPress(() => notifications.show({ message: 'Long press triggered' }))
</script>

<template>
  <Button v-on="handlers">Press and hold</Button>
</template>
`

const Demo = defineComponent({
  name: 'UseLongPressUsageDemo',
  setup() {
    const handlers = useLongPress(() => notifications.show({ message: 'Long press triggered' }))

    return () => h(Button, { ...handlers }, { default: () => 'Press and hold' })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
