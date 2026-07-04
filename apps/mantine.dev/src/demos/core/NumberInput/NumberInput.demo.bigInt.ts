import { defineComponent, h, ref } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput } from '@mantine-vue/core'

const value = ref<bigint | string>(BigInt('12345678901234567890'))
</script>

<template>
  <NumberInput
    label="BigInt value"
    description="BigInt mode is inferred from defaultValue/value"
    :value="value"
    @change="(v) => (value = v)"
    :step="BigInt(10)"
    :min="BigInt(0)"
    thousandSeparator=","
    prefix="$"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputBigIntDemo',
  setup() {
    const value = ref<bigint | string>(BigInt('12345678901234567890'))
    return () =>
      h(NumberInput, {
        label: 'BigInt value',
        description: 'BigInt mode is inferred from defaultValue/value',
        value: value.value,
        onChange: (v: bigint | string | number) => {
          value.value = v as bigint | string
        },
        step: BigInt(10),
        min: BigInt(0),
        thousandSeparator: ',',
        prefix: '$',
      })
  },
})

export const bigInt: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 420,
}
