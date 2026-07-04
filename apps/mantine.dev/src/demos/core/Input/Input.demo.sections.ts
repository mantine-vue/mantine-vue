import { defineComponent, h, ref } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { Input, InputClearButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { Input, InputClearButton } from '@mantine-vue/core'

const value = ref('Clear me')
</script>

<template>
  <div>
    <Input placeholder="Your email" :leftSection="h(PhAt, { size: 16 })" />
    <Input
      placeholder="Clearable input"
      v-model="value"
      rightSectionPointerEvents="all"
      mt="md"
      :rightSection="value ? h(InputClearButton, { 'aria-label': 'Clear input', onClick: () => value = '' }) : null"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'InputSectionsDemo',
  setup() {
    const value = ref('Clear me')
    return () =>
      h('div', null, [
        h(Input, {
          placeholder: 'Your email',
          leftSection: h(PhAt, { size: 16 }),
        }),
        h(Input, {
          placeholder: 'Clearable input',
          value: value.value,
          onChange: (v: string) => {
            value.value = v
          },
          onInput: (e: Event) => {
            value.value = (e.target as HTMLInputElement).value
          },
          rightSectionPointerEvents: 'all',
          mt: 'md',
          rightSection: value.value
            ? h(InputClearButton, {
                'aria-label': 'Clear input',
                onClick: () => {
                  value.value = ''
                },
              })
            : null,
        }),
      ])
  },
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
