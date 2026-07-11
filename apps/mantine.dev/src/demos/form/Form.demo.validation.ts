/* oxlint-disable no-console */
import { defineComponent, h } from 'vue'
import { Button, Group, Stack, TextInput } from '@mantine-vue/core'
import { hasLength, isEmail, useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, TextInput } from '@mantine-vue/core'
import { hasLength, isEmail, useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: {
    name: '',
    email: '',
    age: 18,
  },
  validateInputOnBlur: ['email'],
  validate: {
    name: hasLength({ min: 2 }, 'Name must have at least 2 characters'),
    email: isEmail('Invalid email'),
    age: (value) => (value < 18 ? 'You must be at least 18' : null),
  },
})

const handleSubmit = form.onSubmit((values) => console.log(values))
</script>

<template>
  <form @submit="handleSubmit">
    <TextInput label="Name" v-bind="form.getInputProps('name')" />
    <TextInput label="Email" mt="md" v-bind="form.getInputProps('email')" />
    <TextInput label="Age" mt="md" v-bind="form.getInputProps('age')" />

    <Group justify="space-between" mt="md">
      <Button variant="default" type="button" @click="form.validate">Validate</Button>
      <Button type="submit">Submit</Button>
    </Group>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'FormValidationDemo',
  setup() {
    const form = useForm({
      initialValues: {
        name: '',
        email: '',
        age: 18,
      },
      validateInputOnBlur: ['email'],
      validate: {
        name: hasLength({ min: 2 }, 'Name must have at least 2 characters'),
        email: isEmail('Invalid email'),
        age: (value) => (Number(value) < 18 ? 'You must be at least 18' : null),
      },
    })

    return () =>
      h(
        'form',
        { onSubmit: form.onSubmit((values) => console.log(values)) },
        h(Stack, { gap: 'md' }, () => [
          h(TextInput, { label: 'Name', ...form.getInputProps('name') }),
          h(TextInput, { label: 'Email', ...form.getInputProps('email') }),
          h(TextInput, { label: 'Age', ...form.getInputProps('age') }),
          h(Group, { justify: 'space-between' }, () => [
            h(
              Button,
              { variant: 'default', type: 'button', onClick: form.validate },
              () => 'Validate',
            ),
            h(Button, { type: 'submit' }, () => 'Submit'),
          ]),
        ]),
      )
  },
})

export const validation: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 420,
}
