# @mantine-vue/qr-code

A Mantine Vue QR code component with custom data and finder shapes, image overlays, a complete Styles API, and SVG, PNG, JPEG, and WebP downloads.

## Installation

```bash
yarn add @mantine-vue/qr-code @mantine-vue/core @mantine-vue/hooks qrcode
```

Import styles after core styles:

```ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/qr-code/styles.css'
```

## Usage

```vue
<script setup lang="ts">
import { QRCode } from '@mantine-vue/qr-code'
</script>

<template>
  <QRCode value="https://mantine-vue.dev" />
</template>
```

See the Mantine Vue documentation for all customization and download examples.
