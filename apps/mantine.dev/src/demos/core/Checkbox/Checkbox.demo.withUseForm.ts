/* oxlint-disable no-console */
import { defineComponent, h } from 'vue'
import { Button, Checkbox } from '@mantine-vue/core'
import { isNotEmpty, useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Checkbox } from '@mantine-vue/core'
import { isNotEmpty, useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: { terms: false },
  validate: {
    terms: isNotEmpty('You must accept terms and conditions'),
  },
})

const handleSubmit = form.onSubmit((values) => console.log(values))
</script>

<template>
  <form @submit="handleSubmit">
    <Checkbox
      label="I accept the terms and conditions"
      v-bind="form.getInputProps('terms', { type: 'checkbox' })"
    />
    <Button type="submit" mt="md">Submit</Button>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxWithUseFormDemo',
  setup() {
    const form = useForm({
      initialValues: { terms: false },
      validate: {
        terms: isNotEmpty('You must accept terms and conditions'),
      },
    })

    return () =>
      h('form', { onSubmit: form.onSubmit((values) => console.log(values)) }, [
        h(Checkbox, {
          label: 'I accept the terms and conditions',
          ...form.getInputProps('terms', { type: 'checkbox' }),
        }),
        h(Button, { type: 'submit', mt: 'md' }, { default: () => 'Submit' }),
      ])
  },
})

export const withUseForm: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
