# @mantine-vue/nprogress

Slim, customizable navigation progress bar for Vue, equivalent to `@mantine/nprogress`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/nprogress @mantine-vue/core @mantine-vue/store

# or with npm
npm i @mantine-vue/nprogress @mantine-vue/core @mantine-vue/store
```

## Usage

```vue
<script setup>
import { NavigationProgress, nprogress } from '@mantine-vue/nprogress'
import '@mantine-vue/nprogress/styles.css'

function start() {
  nprogress.start()
}
</script>

<template>
  <NavigationProgress />
  <button @click="start">Start</button>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/nprogress](https://mantine-vue.dev/x/nprogress)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/store`

## License

MIT
