# @mantine-vue/carousel

Responsive, touch-friendly carousel component built with [Embla Carousel](https://www.embla-carousel.com/), equivalent to `@mantine/carousel`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/carousel @mantine-vue/core @mantine-vue/hooks embla-carousel embla-carousel-vue

# or with npm
npm i @mantine-vue/carousel @mantine-vue/core @mantine-vue/hooks embla-carousel embla-carousel-vue
```

## Usage

```vue
<script setup>
import { Carousel } from '@mantine-vue/carousel'
import '@mantine-vue/carousel/styles.css'
</script>

<template>
  <Carousel :height="200">
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
  </Carousel>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/carousel](https://mantine-vue.dev/x/carousel)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/hooks`
- `embla-carousel`, `embla-carousel-vue` >=8.0.0

## License

MIT
