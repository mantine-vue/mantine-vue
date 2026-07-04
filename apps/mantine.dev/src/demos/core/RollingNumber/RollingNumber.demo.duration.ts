import { defineComponent, h, ref } from 'vue'
import { Button, Group, RollingNumber, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, RollingNumber, Stack, Text } from '@mantine-vue/core'

const value = ref(500)
</script>

<template>
  <Stack>
    <div>
      <Text size="sm" c="dimmed">200ms</Text>
      <RollingNumber :value="value" :animationDuration="200" fz="28px" />
    </div>
    <div>
      <Text size="sm" c="dimmed">600ms (default)</Text>
      <RollingNumber :value="value" :animationDuration="600" fz="28px" />
    </div>
    <div>
      <Text size="sm" c="dimmed">1200ms</Text>
      <RollingNumber :value="value" :animationDuration="1200" fz="28px" />
    </div>
    <Group>
      <Button @click="value = Math.floor(Math.random() * 1000)">Random</Button>
    </Group>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'RollingNumberDurationDemo',
  setup() {
    const value = ref(500)
    return () =>
      h(
        Stack,
        {},
        {
          default: () => [
            h('div', {}, [
              h(Text, { size: 'sm', c: 'dimmed' }, { default: () => '200ms' }),
              h(RollingNumber, { value: value.value, animationDuration: 200, fz: '28px' }),
            ]),
            h('div', {}, [
              h(Text, { size: 'sm', c: 'dimmed' }, { default: () => '600ms (default)' }),
              h(RollingNumber, { value: value.value, animationDuration: 600, fz: '28px' }),
            ]),
            h('div', {}, [
              h(Text, { size: 'sm', c: 'dimmed' }, { default: () => '1200ms' }),
              h(RollingNumber, { value: value.value, animationDuration: 1200, fz: '28px' }),
            ]),
            h(
              Group,
              {},
              {
                default: () =>
                  h(
                    Button,
                    {
                      onClick: () => {
                        value.value = Math.floor(Math.random() * 1000)
                      },
                    },
                    { default: () => 'Random' },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const duration: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
