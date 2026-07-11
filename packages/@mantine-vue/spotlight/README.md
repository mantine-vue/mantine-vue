# @mantine-vue/spotlight

Command center (`Ctrl + K`) component for Vue applications, equivalent to `@mantine/spotlight`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/spotlight @mantine-vue/core @mantine-vue/hooks @mantine-vue/store

# or with npm
npm i @mantine-vue/spotlight @mantine-vue/core @mantine-vue/hooks @mantine-vue/store
```

## Usage

```vue
<script setup>
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import '@mantine-vue/spotlight/styles.css'

const actions = [
  { id: 'home', label: 'Home', onClick: () => console.log('Home') },
  { id: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
]
</script>

<template>
  <Spotlight :actions="actions" />
  <button @click="spotlight.open()">Open spotlight</button>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/spotlight](https://mantine-vue.dev/x/spotlight)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/hooks`
- `@mantine-vue/store`

## License

MIT
