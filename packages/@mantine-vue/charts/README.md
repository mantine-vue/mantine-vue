# @mantine-vue/charts

Charts components built with [Apache ECharts](https://echarts.apache.org/) and Mantine Vue, equivalent to `@mantine/charts`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/charts @mantine-vue/core echarts vue-echarts

# or with npm
npm i @mantine-vue/charts @mantine-vue/core echarts vue-echarts
```

## Usage

```vue
<script setup>
import { LineChart } from '@mantine-vue/charts'
import '@mantine-vue/charts/styles.css'

const data = [
  { date: 'Mar 22', value: 2890 },
  { date: 'Mar 23', value: 2338 },
]
</script>

<template>
  <LineChart :h="300" :data="data" data-key="date" :series="[{ name: 'value', color: 'indigo.6' }]" />
</template>
```

## Documentation

Full component API and examples: [mantine-vue.dev/charts/getting-started](https://mantine-vue.dev/charts/getting-started/)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `echarts` >=6.0.0
- `vue-echarts` >=8.0.0

## License

MIT
