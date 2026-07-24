# Mantine Vue

A comprehensive, fully-featured Vue 3 component library ported directly from [Mantine React](https://mantine.dev/).

> **Disclaimer:** Mantine Vue is an independent community port of Mantine for Vue. This project is not affiliated with or endorsed by the Mantine team.

## Links

- [Documentation](https://mantine-vue.dev)

## Packages

Mantine Vue uses a monorepo architecture, allowing you to install only the features you need.

| Package                       | Description                                               | Documentation                                                |
| :---------------------------- | :-------------------------------------------------------- | :----------------------------------------------------------- |
| `@mantine-vue/core`           | Core library featuring 100+ essential UI components       | [View Docs](https://mantine-vue.dev/core/button/)            |
| `@mantine-vue/hooks`          | Collection of 80+ composables for state and UI management | [View Docs](https://mantine-vue.dev/hooks/use-click-outside) |
| `@mantine-vue/form`           | Powerful form management and validation library           | [View Docs](https://mantine-vue.dev/form/use-form)           |
| `@mantine-vue/charts`         | Recharts-based charting and data visualization library    | [View Docs](https://mantine-vue.dev/charts/getting-started/) |
| `@mantine-vue/notifications`  | Fully featured, customizable notifications system         | [View Docs](https://mantine-vue.dev/x/notifications)         |
| `@mantine-vue/contextmenu`    | Desktop-grade context menus with nested submenu support   | [Package README](./packages/@mantine-vue/contextmenu/)       |
| `@mantine-vue/spotlight`      | Command center (`Ctrl + K`) for your application          | [View Docs](https://mantine-vue.dev/x/spotlight)             |
| `@mantine-vue/code-highlight` | Code highlighting component built with highlight.js       | [View Docs](https://mantine-vue.dev/x/code-highlight/)       |
| `@mantine-vue/tiptap`         | Advanced rich text editor built on top of Tiptap          | [View Docs](https://mantine-vue.dev/x/tiptap)                |
| `@mantine-vue/dropzone`       | High-performance file drag-and-drop zone                  | [View Docs](https://mantine-vue.dev/x/dropzone)              |
| `@mantine-vue/carousel`       | Responsive, touch-friendly Carousel component             | [View Docs](https://mantine-vue.dev/x/carousel)              |
| `@mantine-vue/nprogress`      | Slim, customizable navigation progress bars               | [View Docs](https://mantine-vue.dev/x/nprogress)             |
| `@mantine-vue/modals`         | Centralized manager for dynamic and nested modals         | [View Docs](https://mantine-vue.dev/x/modals)                |

---

## Quick Start

### Installation

Install the core components and hooks via your preferred package manager:

```bash
# Using yarn
yarn add @mantine-vue/core @mantine-vue/hooks

# Using npm
npm i @mantine-vue/core @mantine-vue/hooks
```

### Usage

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

## License

MIT
