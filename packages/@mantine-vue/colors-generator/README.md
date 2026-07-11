# @mantine-vue/colors-generator

A small library that generates 10 shades of a color from a single provided color value, powered by [chroma.js](https://gka.github.io/chroma.js/). This is the same logic used by the color generator tool on [mantine-vue.dev](https://mantine-vue.dev/colors-generator).

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/colors-generator chroma-js

# or with npm
npm i @mantine-vue/colors-generator chroma-js
```

## Usage

```ts
import { generateColors } from '@mantine-vue/colors-generator'

const shades = generateColors('#1971c2')
// ['#e7f5ff', '#d0ebff', ..., '#1971c2', ...]
```

## Try it

Interactive version: [mantine-vue.dev/colors-generator](https://mantine-vue.dev/colors-generator)

## Peer dependencies

- `chroma-js` >=2.4.2

## License

MIT
