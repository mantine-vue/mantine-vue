import { defineComponent, h } from 'vue'
import { PhLock } from '@phosphor-icons/vue'
import { PasswordInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhLock } from '@phosphor-icons/vue'
import { PasswordInput } from '@mantine-vue/core'
</script>

<template>
  <PasswordInput
    leftSectionPointerEvents="none"
    label="With left section"
    placeholder="With left section"
  >
    <template #leftSection>
      <PhLock :size="18" />
    </template>
  </PasswordInput>
  <PasswordInput
    label="With right section"
    placeholder="With right section"
    rightSectionPointerEvents="none"
    mt="md"
  >
    <template #rightSection>
      <PhLock :size="18" />
    </template>
  </PasswordInput>
</template>
`

const Demo = defineComponent({
  name: 'PasswordInputSectionsDemo',
  setup: () => () =>
    h('div', null, [
      h(PasswordInput, {
        leftSection: h(PhLock, { size: 18 }),
        leftSectionPointerEvents: 'none',
        label: 'With left section',
        placeholder: 'With left section',
      }),
      h(PasswordInput, {
        rightSection: h(PhLock, { size: 18 }),
        label: 'With right section',
        placeholder: 'With right section',
        rightSectionPointerEvents: 'none',
        mt: 'md',
      }),
    ]),
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
