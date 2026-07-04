import { defineComponent, h, ref } from 'vue'
import { Button, Group, MaskInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MaskInput, Button, Group } from '@mantine-vue/core'

const resetRef = ref<(() => void) | null>(null)
</script>

<template>
  <MaskInput
    label="Phone number"
    placeholder="(___) ___-____"
    mask="(999) 999-9999"
    :resetRef="resetRef"
  />

  <Group mt="md">
    <Button @click="resetRef?.()">Reset</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'MaskInputResetRefDemo',
  setup() {
    const resetRef = ref<(() => void) | null>(null)
    return () =>
      h('div', null, [
        h(MaskInput, {
          label: 'Phone number',
          placeholder: '(___) ___-____',
          mask: '(999) 999-9999',
          resetRef,
        }),
        h(
          Group,
          { mt: 'md' },
          {
            default: () =>
              h(Button, { onClick: () => resetRef.value?.() }, { default: () => 'Reset' }),
          },
        ),
      ])
  },
})

export const resetRef: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
