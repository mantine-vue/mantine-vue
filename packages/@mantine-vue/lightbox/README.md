# @mantine-vue/lightbox

Full-screen image, video and custom-content lightbox for Vue 3, equivalent to `@mantine/lightbox`.

```vue
<script setup>
import { Lightbox } from '@mantine-vue/lightbox'
import '@mantine-vue/lightbox/styles.css'
</script>

<template>
  <Lightbox :opened="opened" :slides="[{ src: '/photo.jpg' }]" @close="opened = false" />
</template>
```
