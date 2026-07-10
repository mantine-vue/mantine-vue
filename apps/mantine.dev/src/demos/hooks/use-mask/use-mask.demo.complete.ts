import { defineComponent, h } from 'vue'
import { Button, Group, Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, isComplete, rawValue } = useMask({
  mask: 'AAA-9999',
  slotChar: 'XXX-0000',
  transform: (char) => char.toUpperCase(),
})
</script>

<template>
  <TextInput :root-ref="ref" label="Promo code" placeholder="Enter promo code" />
  <Text size="sm" mt="sm">Raw value: {{ rawValue }}</Text>
  <Group mt="xs">
    <Button :disabled="!isComplete" size="xs">Apply code</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskCompleteDemo',
  setup() {
    const { ref, isComplete, rawValue } = useMask({
      mask: 'AAA-9999',
      slotChar: 'XXX-0000',
      transform: (char) => char.toUpperCase(),
    })

    return () =>
      h('div', [
        h(TextInput, { rootRef: ref, label: 'Promo code', placeholder: 'Enter promo code' }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Raw value: ${rawValue.value}` }),
        h(
          Group,
          { mt: 'xs' },
          {
            default: () =>
              h(
                Button,
                { disabled: !isComplete.value, size: 'xs' },
                { default: () => 'Apply code' },
              ),
          },
        ),
      ])
  },
})

export const complete: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
