import { defineComponent, h } from 'vue'
import { PhEyedropper } from '@phosphor-icons/vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhEyedropper } from '@phosphor-icons/vue'
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <div>
    <ColorInput
      label="With custom left section"
      placeholder="Replaces color swatch"
      leftSectionPointerEvents="none"
      :withEyeDropper="false"
    >
      <template #leftSection>
        <PhEyedropper :size="18" />
      </template>
    </ColorInput>
    <ColorInput
      label="With custom right section"
      placeholder="Replaces eye dropper"
      rightSectionPointerEvents="none"
      mt="md"
    >
      <template #rightSection>
        <PhEyedropper :size="18" />
      </template>
    </ColorInput>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ColorInputSectionsDemo',
  setup() {
    const icon = h(PhEyedropper, { size: 18 })
    return () =>
      h('div', null, [
        h(ColorInput, {
          label: 'With custom left section',
          placeholder: 'Replaces color swatch',
          leftSection: icon,
          leftSectionPointerEvents: 'none',
          withEyeDropper: false,
        }),
        h(ColorInput, {
          label: 'With custom right section',
          placeholder: 'Replaces eye dropper',
          rightSection: icon,
          rightSectionPointerEvents: 'none',
          mt: 'md',
        }),
      ])
  },
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
