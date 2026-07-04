import { defineComponent, h, ref } from 'vue'
import { ColorInput, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ColorInput, Text } from '@mantine-vue/core'

const changeEndValue = ref('#FFFFFF')
</script>

<template>
  <div>
    <Text mb="md">
      Change end value: <b>{{ changeEndValue }}</b>
    </Text>
    <ColorInput
      label="Pick color"
      placeholder="Pick color"
      defaultValue="#FFFFFF"
      :onChangeEnd="(v) => (changeEndValue = v)"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ColorInputOnChangeEndDemo',
  setup() {
    const changeEndValue = ref('#FFFFFF')
    return () =>
      h('div', null, [
        h(
          Text,
          { mb: 'md' },
          {
            default: () => ['Change end value: ', h('b', null, changeEndValue.value)],
          },
        ),
        h(ColorInput, {
          label: 'Pick color',
          placeholder: 'Pick color',
          defaultValue: '#FFFFFF',
          onChangeEnd: (v: string) => {
            changeEndValue.value = v
          },
        }),
      ])
  },
})

export const onChangeEnd: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
