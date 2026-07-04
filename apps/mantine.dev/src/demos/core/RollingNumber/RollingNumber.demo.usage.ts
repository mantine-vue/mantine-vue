import { defineComponent, h, ref } from 'vue'
import { Button, Group, RollingNumber } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, RollingNumber } from '@mantine-vue/core'

const value = ref(1234)
</script>

<template>
  <RollingNumber :value="value" fz="36px" />
  <Group mt="md">
    <Button @click="value++">Increment</Button>
    <Button @click="value--">Decrement</Button>
    <Button @click="value = Math.floor(Math.random() * 10000)">Random</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'RollingNumberUsageDemo',
  setup() {
    const value = ref(1234)
    return () =>
      h('div', {}, [
        h(RollingNumber, { value: value.value, fz: '36px' }),
        h(
          Group,
          { mt: 'md' },
          {
            default: () => [
              h(
                Button,
                {
                  onClick: () => {
                    value.value++
                  },
                },
                { default: () => 'Increment' },
              ),
              h(
                Button,
                {
                  onClick: () => {
                    value.value--
                  },
                },
                { default: () => 'Decrement' },
              ),
              h(
                Button,
                {
                  onClick: () => {
                    value.value = Math.floor(Math.random() * 10000)
                  },
                },
                { default: () => 'Random' },
              ),
            ],
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
