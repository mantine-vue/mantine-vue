import { computed, defineComponent, h } from 'vue'
import { Code, Stack, Text, TextInput } from '@mantine-vue/core'
import { useField, useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed } from 'vue'
import { Code, Text, TextInput } from '@mantine-vue/core'
import { useField, useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: {
    name: '',
  },
  validate: {
    name: (value) => (value.length < 2 ? 'Name is too short' : null),
  },
})

const name = useField({ form, path: 'name' })
const status = computed(() => ({
  dirty: name.dirty.value,
  touched: name.touched.value,
  error: name.error.value,
}))
</script>

<template>
  <TextInput label="Name" v-bind="name.getInputProps()" />
  <Text size="sm" mt="md">Status: <Code>{{ JSON.stringify(status) }}</Code></Text>
</template>
`

const Demo = defineComponent({
  name: 'FormUseFieldDemo',
  setup() {
    const form = useForm({
      initialValues: {
        name: '',
      },
      validate: {
        name: (value) => (value.length < 2 ? 'Name is too short' : null),
      },
    })

    const name = useField({ form, path: 'name' })
    const status = computed(() => ({
      dirty: name.dirty.value,
      touched: name.touched.value,
      error: name.error.value,
    }))

    return () =>
      h(Stack, { gap: 'md' }, () => [
        h(TextInput, { label: 'Name', ...name.getInputProps() }),
        h(Text, { size: 'sm' }, () => ['Status: ', h(Code, () => JSON.stringify(status.value))]),
      ])
  },
})

export const useFieldDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 420,
}
