# @mantine-vue/code-highlight

Code highlighting components built with highlight.js, equivalent to `@mantine/code-highlight`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/code-highlight @mantine-vue/core @mantine-vue/hooks

# or with npm
npm i @mantine-vue/code-highlight @mantine-vue/core @mantine-vue/hooks
```

## Usage

```vue
<script setup>
import { CodeHighlight } from '@mantine-vue/code-highlight'
import '@mantine-vue/code-highlight/styles.css'

const code = `function sum(a, b) {\n  return a + b\n}`
</script>

<template>
  <CodeHighlight :code="code" language="js" />
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/code-highlight](https://mantine-vue.dev/x/code-highlight/)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/hooks`

## License

MIT
