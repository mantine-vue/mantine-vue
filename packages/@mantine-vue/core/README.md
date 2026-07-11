# @mantine-vue/core

Core library of [Mantine Vue](https://mantine-vue.dev) featuring 100+ essential UI components, architecturally equivalent to `@mantine/core`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/core @mantine-vue/hooks

# or with npm
npm i @mantine-vue/core @mantine-vue/hooks
```

## Usage

```vue
<script setup>
import { MantineProvider, Button } from '@mantine-vue/core'
import '@mantine-vue/core/styles.css'
</script>

<template>
  <MantineProvider>
    <Button>Hello Mantine Vue!</Button>
  </MantineProvider>
</template>
```

## Documentation

Full component API and examples: [mantine-vue.dev/core/button](https://mantine-vue.dev/core/button/)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/hooks`
- `@mantine-vue/utils`

## License

MIT
