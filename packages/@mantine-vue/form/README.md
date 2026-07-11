# @mantine-vue/form

Powerful form management and validation library for Vue, equivalent to `@mantine/form`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/form

# or with npm
npm i @mantine-vue/form
```

## Usage

```vue
<script setup>
import { useForm } from '@mantine-vue/form'

const form = useForm({
  initialValues: { name: '' },
  validate: {
    name: (value) => (value.length < 2 ? 'Name is too short' : null),
  },
})
</script>

<template>
  <form @submit.prevent="form.onSubmit((values) => console.log(values))">
    <input v-bind="form.getInputProps('name')" />
  </form>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/form/use-form](https://mantine-vue.dev/form/use-form)

## Peer dependencies

- `vue` ^3.5.0

## License

MIT
