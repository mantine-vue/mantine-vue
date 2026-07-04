import { defineComponent, h } from 'vue'
import { MantineThemeProvider, NativeSelect, NumberInput, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MantineThemeProvider, TextInput, NumberInput, NativeSelect } from '@mantine-vue/core'

const theme = {
  components: {
    Input: {
      defaultProps: { size: 'md', radius: 'md' },
    },
    InputWrapper: {
      defaultProps: { withAsterisk: true },
    },
    NumberInput: {
      defaultProps: { size: 'lg' },
    },
  },
}
</script>

<template>
  <MantineThemeProvider :theme="theme">
    <TextInput label="Text input" placeholder="Inherits size and radius from Input" />
    <NativeSelect
      mt="md"
      label="Native select"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
    />
    <NumberInput mt="md" label="Number input" placeholder="Overrides shared size with lg" />
  </MantineThemeProvider>
</template>
`

const theme = {
  components: {
    Input: { defaultProps: { size: 'md', radius: 'md' } },
    InputWrapper: { defaultProps: { withAsterisk: true } },
    NumberInput: { defaultProps: { size: 'lg' } },
  },
}

const Demo = defineComponent({
  name: 'InputSharedDefaultPropsDemo',
  setup: () => () =>
    h(
      MantineThemeProvider,
      { theme },
      {
        default: () => [
          h(TextInput, { label: 'Text input', placeholder: 'Inherits size and radius from Input' }),
          h(NativeSelect, {
            mt: 'md',
            label: 'Native select',
            data: ['React', 'Angular', 'Vue', 'Svelte'],
          }),
          h(NumberInput, {
            mt: 'md',
            label: 'Number input',
            placeholder: 'Overrides shared size with lg',
          }),
        ],
      },
    ),
})

export const sharedDefaultProps: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  code,
}
