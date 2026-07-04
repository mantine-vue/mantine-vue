import { defineComponent, h } from 'vue'
import { Button, Checkbox, CheckboxGroup, Group } from '@mantine-vue/core'
import { hasLength, useForm } from '@mantine-vue/form'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Checkbox, CheckboxGroup, Group } from '@mantine-vue/core'
import { hasLength, useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: { frameworks: [] as string[] },
  validate: {
    frameworks: hasLength({ min: 1 }, 'Select at least one framework'),
  },
})

const handleSubmit = form.onSubmit((values) => console.log(values))
</script>

<template>
  <form @submit="handleSubmit">
    <CheckboxGroup
      v-bind="form.getInputProps('frameworks')"
      label="Select your favorite frameworks/libraries"
      withAsterisk
    >
      <Group :my="5">
        <Checkbox value="react" label="React" />
        <Checkbox value="svelte" label="Svelte" />
        <Checkbox value="ng" label="Angular" />
        <Checkbox value="vue" label="Vue" />
      </Group>
    </CheckboxGroup>
    <Button type="submit" mt="md">Submit</Button>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxGroupWithUseFormDemo',
  setup() {
    const form = useForm({
      initialValues: { frameworks: [] as string[] },
      validate: {
        frameworks: hasLength({ min: 1 }, 'Select at least one framework'),
      },
    })

    return () =>
      h('form', { onSubmit: form.onSubmit((values) => console.log(values)) }, [
        h(
          CheckboxGroup,
          {
            ...form.getInputProps('frameworks'),
            label: 'Select your favorite frameworks/libraries',
            withAsterisk: true,
          },
          {
            default: () =>
              h(
                Group,
                { my: 5 },
                {
                  default: () => [
                    h(Checkbox, { value: 'react', label: 'React' }),
                    h(Checkbox, { value: 'svelte', label: 'Svelte' }),
                    h(Checkbox, { value: 'ng', label: 'Angular' }),
                    h(Checkbox, { value: 'vue', label: 'Vue' }),
                  ],
                },
              ),
          },
        ),
        h(Button, { type: 'submit', mt: 'md' }, { default: () => 'Submit' }),
      ])
  },
})

export const groupWithUseForm: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
