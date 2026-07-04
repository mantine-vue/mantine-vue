import { defineComponent, h, ref } from 'vue'
import { Button, Group, RollingNumber } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, RollingNumber } from '@mantine-vue/core'

const value = ref(99.99)
</script>

<template>
  <RollingNumber
    :value="value"
    prefix="$ "
    suffix=" USD"
    :decimalScale="2"
    fixedDecimalScale
    thousandSeparator
    fz="32px"
  />
  <Group mt="md">
    <Button @click="value = +((value + 10.5).toFixed(2))">+10.50</Button>
    <Button @click="value = +((value - 10.5).toFixed(2))">-10.50</Button>
    <Button @click="value = +(Math.random() * 10000).toFixed(2)">Random</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'RollingNumberPrefixDemo',
  setup() {
    const value = ref(99.99)
    return () =>
      h('div', {}, [
        h(RollingNumber, {
          value: value.value,
          prefix: '$ ',
          suffix: ' USD',
          decimalScale: 2,
          fixedDecimalScale: true,
          thousandSeparator: true,
          fz: '32px',
        }),
        h(
          Group,
          { mt: 'md' },
          {
            default: () => [
              h(
                Button,
                {
                  onClick: () => {
                    value.value = +(value.value + 10.5).toFixed(2)
                  },
                },
                { default: () => '+10.50' },
              ),
              h(
                Button,
                {
                  onClick: () => {
                    value.value = +(value.value - 10.5).toFixed(2)
                  },
                },
                { default: () => '-10.50' },
              ),
              h(
                Button,
                {
                  onClick: () => {
                    value.value = +(Math.random() * 10000).toFixed(2)
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

export const prefix: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
