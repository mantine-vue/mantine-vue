/* oxlint-disable no-console */
import { defineComponent, h } from 'vue'
import { Button, Group, PasswordInput, Stack, TextInput } from '@mantine-vue/core'
import { isEmail, isNotEmpty, useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, PasswordInput, TextInput } from '@mantine-vue/core'
import { isEmail, isNotEmpty, useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validate: {
    email: isEmail('Invalid email'),
    password: isNotEmpty('Password is required'),
  },
})

const handleSubmit = form.onSubmit((values) => console.log(values))
</script>

<template>
  <form @submit="handleSubmit">
    <TextInput
      label="Email"
      placeholder="you@mantine.dev"
      v-bind="form.getInputProps('email')"
    />
    <PasswordInput
      label="Password"
      placeholder="Your password"
      mt="md"
      v-bind="form.getInputProps('password')"
    />

    <Group justify="flex-end" mt="md">
      <Button type="submit">Submit</Button>
    </Group>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'FormUsageDemo',
  setup() {
    const form = useForm({
      initialValues: {
        email: '',
        password: '',
      },
      validate: {
        email: isEmail('Invalid email'),
        password: isNotEmpty('Password is required'),
      },
    })

    return () =>
      h(
        'form',
        { onSubmit: form.onSubmit((values) => console.log(values)) },
        h(Stack, { gap: 'md' }, () => [
          h(TextInput, {
            label: 'Email',
            placeholder: 'you@mantine.dev',
            ...form.getInputProps('email'),
          }),
          h(PasswordInput, {
            label: 'Password',
            placeholder: 'Your password',
            ...form.getInputProps('password'),
          }),
          h(Group, { justify: 'flex-end' }, () => h(Button, { type: 'submit' }, () => 'Submit')),
        ]),
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 420,
}
