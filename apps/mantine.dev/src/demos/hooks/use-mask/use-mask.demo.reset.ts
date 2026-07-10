import { defineComponent, h } from 'vue'
import { Button, Group, Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, value, rawValue, reset } = useMask({
  mask: '(999) 999-9999',
})
</script>

<template>
  <TextInput :root-ref="ref" label="Phone number" placeholder="(___) ___-____" />
  <Text size="sm" mt="sm">Masked: {{ value }}</Text>
  <Text size="sm">Raw: {{ rawValue }}</Text>
  <Group mt="xs">
    <Button size="xs" variant="default" @click="reset">Reset</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskResetDemo',
  setup() {
    const { ref, value, rawValue, reset } = useMask({
      mask: '(999) 999-9999',
    })

    return () =>
      h('div', [
        h(TextInput, { rootRef: ref, label: 'Phone number', placeholder: '(___) ___-____' }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Masked: ${value.value}` }),
        h(Text, { size: 'sm' }, { default: () => `Raw: ${rawValue.value}` }),
        h(
          Group,
          { mt: 'xs' },
          {
            default: () =>
              h(
                Button,
                { size: 'xs', variant: 'default', onClick: reset },
                { default: () => 'Reset' },
              ),
          },
        ),
      ])
  },
})

export const reset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
