# @mantine-vue/modals

Centralized manager for dynamic and nested modals in Vue, equivalent to `@mantine/modals`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/modals @mantine-vue/core @mantine-vue/store

# or with npm
npm i @mantine-vue/modals @mantine-vue/core @mantine-vue/store
```

## Usage

```vue
<script setup>
import { ModalsProvider, modals } from '@mantine-vue/modals'

function openConfirm() {
  modals.openConfirmModal({
    title: 'Please confirm your action',
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onConfirm: () => console.log('Confirmed'),
  })
}
</script>

<template>
  <ModalsProvider>
    <button @click="openConfirm">Open confirm modal</button>
  </ModalsProvider>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/modals](https://mantine-vue.dev/x/modals)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/store`

## License

MIT
