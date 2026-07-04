import { defineComponent, h, ref } from 'vue'
import { Avatar, Button, Indicator, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Indicator, Button, Stack } from '@mantine-vue/core'

const visible = ref(false)
</script>

<template>
  <Stack align="center">
    <Indicator inline :disabled="!visible" color="red" :size="12">
      <Avatar
        size="lg"
        radius="sm"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png"
      />
    </Indicator>
    <Button @click="visible = !visible">Toggle indicator</Button>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'IndicatorDisabledDemo',
  setup() {
    const visible = ref(false)
    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h(
              Indicator,
              { inline: true, disabled: !visible.value, color: 'red', size: 12 },
              {
                default: () =>
                  h(Avatar, {
                    size: 'lg',
                    radius: 'sm',
                    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
                  }),
              },
            ),
            h(
              Button,
              {
                onClick: () => {
                  visible.value = !visible.value
                },
              },
              { default: () => 'Toggle indicator' },
            ),
          ],
        },
      )
  },
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
