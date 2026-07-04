import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const cssCode = `.dropdown {
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-color: light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4));
  border-top: 0;
}

.input {
  transition: none;

  &[data-expanded] {
    border-color: light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4));
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
`

const code = [
  {
    fileName: 'Demo.vue',
    language: 'vue',
    code: `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
import classes from './Demo.module.css'
</script>

<template>
  <MultiSelect
    label="Your favorite library"
    placeholder="Pick values"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :class-names="classes"
    :combobox-props="{ position: 'bottom', middlewares: { flip: false, shift: false }, offset: 0 }"
  />
</template>
`,
  },
  { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
]

const Demo = defineComponent({
  name: 'MultiSelectDropdownOffsetDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite library',
      placeholder: 'Pick values',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      comboboxProps: { position: 'bottom', middlewares: { flip: false, shift: false }, offset: 0 },
    }),
})

export const dropdownOffset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
