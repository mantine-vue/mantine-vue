# @mantine-vue/mantine-header

Components used in the headers of `*.mantine.dev`-style documentation sites, Vue port of `@mantinex/mantine-header`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

This package powers the header/navigation of [mantine-vue.dev](https://mantine-vue.dev) itself. It's published for anyone building a similar documentation site on top of Mantine Vue, but it isn't a general-purpose UI package.

## Installation

```bash
yarn add @mantine-vue/mantine-header @mantine-vue/core @phosphor-icons/vue

# or with npm
npm i @mantine-vue/mantine-header @mantine-vue/core @phosphor-icons/vue
```

## Usage

```vue
<script setup>
import { HeaderControls, ColorSchemeControl, GithubControl } from '@mantine-vue/mantine-header'
</script>

<template>
  <HeaderControls>
    <ColorSchemeControl />
    <GithubControl href="https://github.com/mantine-vue/mantine-vue" />
  </HeaderControls>
</template>
```

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@phosphor-icons/vue` ^2.2

## License

MIT
