# @mantine-vue/dropzone

High-performance file drag & drop zone component for Vue, equivalent to `@mantine/dropzone`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/dropzone @mantine-vue/core @mantine-vue/hooks

# or with npm
npm i @mantine-vue/dropzone @mantine-vue/core @mantine-vue/hooks
```

## Usage

```vue
<script setup>
import { Dropzone } from '@mantine-vue/dropzone'
import '@mantine-vue/dropzone/styles.css'

function handleDrop(files) {
  console.log('accepted files', files)
}
</script>

<template>
  <Dropzone @drop="handleDrop" :accept="['image/png', 'image/jpeg']">
    <p>Drag files here or click to select</p>
  </Dropzone>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/dropzone](https://mantine-vue.dev/x/dropzone)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/hooks`

## License

MIT
