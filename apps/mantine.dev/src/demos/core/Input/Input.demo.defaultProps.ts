import { defineComponent, h } from 'vue'
import { MantineThemeProvider, NativeSelect, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MantineThemeProvider, TextInput, NativeSelect } from '@mantine-vue/core'

const theme = {
  components: {
    Input: {
      defaultProps: { variant: 'filled' },
    },
    InputWrapper: {
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    },
  },
}
</script>

<template>
  <MantineThemeProvider :theme="theme">
    <TextInput
      label="Text input"
      placeholder="Text input"
      description="Description below the input"
    />
    <NativeSelect
      mt="md"
      label="Native select"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      description="Description below the input"
    />
  </MantineThemeProvider>
</template>
`

const theme = {
  components: {
    Input: { defaultProps: { variant: 'filled' } },
    InputWrapper: {
      defaultProps: { inputWrapperOrder: ['label', 'input', 'description', 'error'] },
    },
  },
}

const Demo = defineComponent({
  name: 'InputDefaultPropsDemo',
  setup: () => () =>
    h(
      MantineThemeProvider,
      { theme },
      {
        default: () => [
          h(TextInput, {
            label: 'Text input',
            placeholder: 'Text input',
            description: 'Description below the input',
          }),
          h(NativeSelect, {
            mt: 'md',
            label: 'Native select',
            data: ['React', 'Angular', 'Vue', 'Svelte'],
            description: 'Description below the input',
          }),
        ],
      },
    ),
})

export const defaultProps: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  code,
}
