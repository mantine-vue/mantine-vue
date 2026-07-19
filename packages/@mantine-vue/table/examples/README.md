# @mantine-vue/table — examples

Copy-pasteable, self-contained Vue 3 (`<script setup lang="ts">`) demos. Each imports
`@mantine-vue/table/styles.css` and assumes your app is wrapped in a `MantineProvider`
from `@mantine-vue/core`.

| Demo                                                         | Shows                                                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`MinimalExample.vue`](./MinimalExample.vue)                 | The smallest possible table                                                                        |
| [`BasicExample.vue`](./BasicExample.vue)                     | Full-featured: column ordering, pinning, resizing, click-to-copy, row selection, row drag-and-drop |
| [`RowSelectionExample.vue`](./RowSelectionExample.vue)       | Row selection, shift-click batch selection, reading the selection reactively                       |
| [`EditingExample.vue`](./EditingExample.vue)                 | Modal row editing with `onEditingRowSave`                                                          |
| [`DetailPanelSlotExample.vue`](./DetailPanelSlotExample.vue) | Vue named slots (`#detailPanel`, `#rowActionMenuItems`)                                            |
| [`RemoteDataExample.vue`](./RemoteDataExample.vue)           | Server-side pagination, sorting, and global filtering with a loading state                         |
| [`VirtualizedExample.vue`](./VirtualizedExample.vue)         | 10,000 rows with row virtualization                                                                |

## Running a demo

1. Install the package and its peers (see the [package README](../README.md#installation)).
2. Wrap your app root in `MantineProvider` and import the styles:

   ```ts
   // main.ts
   import { createApp } from 'vue'
   import App from './App.vue'
   import '@mantine-vue/core/styles.css'
   import '@mantine-vue/table/styles.css'

   createApp(App).mount('#app')
   ```

3. Copy any example file from this folder into your project and render it, or paste
   its `<script setup>` / `<template>` straight into a component of your own.

See the [package README](../README.md) for the full options and named-slot reference.
