/* oxlint-disable no-console */
import { defineComponent, h } from 'vue'
import { Button, Stack, TextInput } from '@mantine-vue/core'
import { useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, TextInput } from '@mantine-vue/core'
import { useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: {
    firstName: '',
    lastName: '',
  },
  transformValues: (values) => ({
    ...values,
    fullName: \`\${values.firstName} \${values.lastName}\`.trim(),
  }),
})

const handleSubmit = form.onSubmit((values) => console.log(values))
</script>

<template>
  <form @submit="handleSubmit">
    <TextInput label="First name" v-bind="form.getInputProps('firstName')" />
    <TextInput label="Last name" mt="md" v-bind="form.getInputProps('lastName')" />
    <Button type="submit" mt="md">Submit transformed values</Button>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'FormTransformValuesDemo',
  setup() {
    const form = useForm({
      initialValues: {
        firstName: '',
        lastName: '',
      },
      transformValues: (values) => ({
        ...values,
        fullName: `${values.firstName} ${values.lastName}`.trim(),
      }),
    })

    return () =>
      h(
        'form',
        { onSubmit: form.onSubmit((values) => console.log(values)) },
        h(Stack, { gap: 'md' }, () => [
          h(TextInput, { label: 'First name', ...form.getInputProps('firstName') }),
          h(TextInput, { label: 'Last name', ...form.getInputProps('lastName') }),
          h(Button, { type: 'submit' }, () => 'Submit transformed values'),
        ]),
      )
  },
})

export const transformValues: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 420,
}
