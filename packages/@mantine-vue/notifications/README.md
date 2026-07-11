# @mantine-vue/notifications

Fully featured, customizable notifications system for Vue, equivalent to `@mantine/notifications`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/notifications @mantine-vue/core @mantine-vue/hooks @mantine-vue/store

# or with npm
npm i @mantine-vue/notifications @mantine-vue/core @mantine-vue/hooks @mantine-vue/store
```

## Usage

```vue
<script setup>
import { Notifications, notifications } from '@mantine-vue/notifications'
import '@mantine-vue/notifications/styles.css'

function showNotification() {
  notifications.show({ title: 'Default notification', message: 'Hey there!' })
}
</script>

<template>
  <Notifications />
  <button @click="showNotification">Show notification</button>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/notifications](https://mantine-vue.dev/x/notifications)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/hooks`
- `@mantine-vue/store`

## License

MIT
