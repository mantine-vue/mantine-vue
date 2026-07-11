import { defineComponent, h, type Component } from 'vue'
import {
  AreaChart,
  BarChart,
  BarsList,
  BubbleChart,
  CompositeChart,
  DonutChart,
  FunnelChart,
  Heatmap,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  ScatterChart,
  Sparkline,
  Treemap,
} from '@mantine-vue/charts'
import type { MantineDemo } from '@/demo'

const monthlyData = [
  { month: 'Jan', Smartphones: 1200, Laptops: 900, Tablets: 400 },
  { month: 'Feb', Smartphones: 1900, Laptops: 1200, Tablets: 600 },
  { month: 'Mar', Smartphones: 1400, Laptops: 1000, Tablets: 500 },
  { month: 'Apr', Smartphones: 2200, Laptops: 1600, Tablets: 800 },
  { month: 'May', Smartphones: 1700, Laptops: 1300, Tablets: 700 },
  { month: 'Jun', Smartphones: 2500, Laptops: 1800, Tablets: 900 },
]

const series = [
  { name: 'Smartphones', color: 'blue.6' },
  { name: 'Laptops', color: 'teal.6' },
  { name: 'Tablets', color: 'violet.6' },
]

const radialData = [
  { name: 'USA', value: 400, color: 'blue.6' },
  { name: 'India', value: 300, color: 'teal.6' },
  { name: 'Japan', value: 200, color: 'violet.6' },
  { name: 'Other', value: 100, color: 'gray.5' },
]

function demo(
  component: Component,
  props: Record<string, unknown>,
  code: string,
  maxWidth = 720,
): MantineDemo {
  return {
    type: 'code',
    component: defineComponent({
      name: 'ChartDocumentationDemo',
      setup: () => () => h(component, props),
    }),
    code,
    maxWidth,
  }
}

const cartesianCode = (name: string, extra = '') => `<script setup lang="ts">
import { ${name} } from '@mantine-vue/charts'

const data = ${JSON.stringify(monthlyData, null, 2)}
const series = ${JSON.stringify(series, null, 2)}
</script>

<template>
  <${name} :data="data" data-key="month" :series="series" :height="300" with-legend${extra} />
</template>`

export const areaChart = demo(
  AreaChart,
  { data: monthlyData, dataKey: 'month', series, withLegend: true, withGradient: true },
  cartesianCode('AreaChart', ' with-gradient'),
)
export const barChart = demo(
  BarChart,
  { data: monthlyData, dataKey: 'month', series, withLegend: true },
  cartesianCode('BarChart'),
)
export const lineChart = demo(
  LineChart,
  { data: monthlyData, dataKey: 'month', series, withLegend: true },
  cartesianCode('LineChart'),
)
export const compositeChart = demo(
  CompositeChart,
  {
    data: monthlyData,
    dataKey: 'month',
    series: [
      { ...series[0], type: 'bar' },
      { ...series[1], type: 'line' },
      { ...series[2], type: 'area' },
    ],
    withLegend: true,
  },
  cartesianCode('CompositeChart'),
)

const radialCode = (name: string) => `<script setup lang="ts">
import { ${name} } from '@mantine-vue/charts'
const data = ${JSON.stringify(radialData, null, 2)}
</script>

<template><${name} :data="data" :height="300" with-tooltip /></template>`

export const pieChart = demo(
  PieChart,
  { data: radialData, withTooltip: true, withLabels: true },
  radialCode('PieChart'),
)
export const donutChart = demo(
  DonutChart,
  { data: radialData, withTooltip: true, chartLabel: '1,000' },
  radialCode('DonutChart'),
)
export const radialBarChart = demo(
  RadialBarChart,
  {
    data: radialData.map((item) => ({ ...item, value: item.value / 4 })),
    withTooltip: true,
    maxValue: 100,
  },
  radialCode('RadialBarChart'),
)
export const funnelChart = demo(
  FunnelChart,
  { data: radialData, withTooltip: true, withLabels: true },
  radialCode('FunnelChart'),
)

const scatterData = [
  { x: 10, y: 30, z: 80 },
  { x: 20, y: 45, z: 140 },
  { x: 30, y: 28, z: 60 },
  { x: 40, y: 60, z: 220 },
  { x: 50, y: 48, z: 120 },
  { x: 60, y: 72, z: 260 },
]
export const scatterChart = demo(
  ScatterChart,
  {
    data: scatterData,
    dataKey: 'x',
    xAxisKey: 'x',
    yAxisKey: 'y',
    series: [{ name: 'Sales', color: 'blue.6' }],
    withTooltip: true,
  },
  `<script setup lang="ts">
import { ScatterChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(scatterData, null, 2)}
</script>
<template><ScatterChart :data="data" data-key="x" x-axis-key="x" y-axis-key="y" :series="[{ name: 'Sales', color: 'blue.6' }]" /></template>`,
)
export const bubbleChart = demo(
  BubbleChart,
  {
    data: scatterData,
    xAxisKey: 'x',
    yAxisKey: 'y',
    zAxisKey: 'z',
    color: 'teal.6',
    withTooltip: true,
  },
  `<script setup lang="ts">
import { BubbleChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(scatterData, null, 2)}
</script>
<template><BubbleChart :data="data" x-axis-key="x" y-axis-key="y" z-axis-key="z" color="teal.6" /></template>`,
)

export const radarChart = demo(
  RadarChart,
  { data: monthlyData, dataKey: 'month', series, withLegend: true },
  cartesianCode('RadarChart'),
)
export const sparkline = demo(
  Sparkline,
  { data: [10, 18, 12, 25, 20, 32, 28, 40], color: 'blue.6', height: 80 },
  `<script setup lang="ts">
import { Sparkline } from '@mantine-vue/charts'
</script>
<template><Sparkline :data="[10, 18, 12, 25, 20, 32, 28, 40]" color="blue.6" :height="80" /></template>`,
  500,
)
export const barsList = demo(
  BarsList,
  { data: radialData, valueFormatter: (value: number) => value.toLocaleString() },
  `<script setup lang="ts">
import { BarsList } from '@mantine-vue/charts'
const data = ${JSON.stringify(radialData, null, 2)}
</script>
<template><BarsList :data="data" :height="260" /></template>`,
  600,
)

const treeData = [
  {
    name: 'Products',
    children: [
      { name: 'Phones', value: 45, color: 'blue.6' },
      { name: 'Laptops', value: 30, color: 'teal.6' },
      { name: 'Tablets', value: 15, color: 'violet.6' },
      { name: 'Other', value: 10, color: 'gray.5' },
    ],
  },
]
export const treemap = demo(
  Treemap,
  { data: treeData, withTooltip: true },
  `<script setup lang="ts">
import { Treemap } from '@mantine-vue/charts'
const data = ${JSON.stringify(treeData, null, 2)}
</script>
<template><Treemap :data="data" :height="320" with-tooltip /></template>`,
)

const nodes = [{ name: 'Website' }, { name: 'Store' }, { name: 'Signup' }, { name: 'Purchase' }]
const links = [
  { source: 'Website', target: 'Store', value: 80 },
  { source: 'Website', target: 'Signup', value: 40 },
  { source: 'Store', target: 'Purchase', value: 55 },
  { source: 'Signup', target: 'Purchase', value: 20 },
]
export const sankeyChart = demo(
  SankeyChart,
  { nodes, links, withTooltip: true },
  `<script setup lang="ts">
import { SankeyChart } from '@mantine-vue/charts'
const nodes = ${JSON.stringify(nodes, null, 2)}
const links = ${JSON.stringify(links, null, 2)}
</script>
<template><SankeyChart :nodes="nodes" :links="links" :height="320" /></template>`,
)

const heatmapData = Object.fromEntries(
  Array.from({ length: 90 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 0, index + 1))
    return [date.toISOString().slice(0, 10), (index * 17) % 12]
  }),
)
export const heatmap = demo(
  Heatmap,
  {
    data: heatmapData,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    withMonthLabels: true,
    withWeekdayLabels: true,
    withLegend: true,
    height: 220,
  },
  `<script setup lang="ts">
import { Heatmap } from '@mantine-vue/charts'
const data = ${JSON.stringify(heatmapData, null, 2)}
</script>
<template><Heatmap :data="data" start-date="2026-01-01" end-date="2026-03-31" with-month-labels with-weekday-labels with-legend /></template>`,
)

export const ChartsDemos = {
  areaChart,
  barChart,
  barsList,
  bubbleChart,
  compositeChart,
  donutChart,
  funnelChart,
  heatmap,
  lineChart,
  pieChart,
  radarChart,
  radialBarChart,
  sankeyChart,
  scatterChart,
  sparkline,
  treemap,
}
