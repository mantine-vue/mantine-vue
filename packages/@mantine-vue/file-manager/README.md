# @mantine-vue/file-manager

Backend-agnostic file manager for Mantine Vue: folder tree, breadcrumbs, five layouts, previews, an
upload queue, bulk operations with undo, context menus, keyboard navigation and a compact touch
layout.

## Installation

```bash
yarn add @mantine-vue/file-manager @mantine-vue/core @mantine-vue/hooks @mantine-vue/dropzone

# or with npm
npm i @mantine-vue/file-manager @mantine-vue/core @mantine-vue/hooks @mantine-vue/dropzone
```

Import the extension styles after the core styles:

```ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/file-manager/styles.css'
```

## Usage

`createMemoryAdapter` is a complete file system kept in memory, for demos and tests.

```vue
<script setup lang="ts">
import { FileManager, createMemoryAdapter } from '@mantine-vue/file-manager'

const adapter = createMemoryAdapter({
  files: [
    { name: 'Documents', children: [{ name: 'Notes.txt', content: 'Hello' }] },
    { name: 'Read me.md', content: '# Welcome' },
  ],
})
</script>

<template>
  <FileManager :adapter="adapter" style="height: 520px" />
</template>
```

## Connecting a backend

An adapter connects the manager to a backend. Only `list` is required, and every method you leave
out removes its feature from the interface.

```ts
import type { FileSystemAdapter } from '@mantine-vue/file-manager'

const adapter: FileSystemAdapter = {
  async list({ folderId, signal }) {
    const response = await fetch(`/api/folders/${folderId ?? 'root'}`, { signal })
    return response.json() // { folder, ancestors, items }
  },
  async rename({ id, name }) {
    /* ... */
  },
}
```

`createRestAdapter` covers an HTTP API that follows the documented convention. Permissions, file
types and sizes are checked in the browser for feedback only, so the backend must enforce them.

## Documentation

See the [documentation](https://mantine-vue.dev/file-manager/getting-started) for layouts, adapters,
theming, custom actions, previews, uploads and the known limitations.
