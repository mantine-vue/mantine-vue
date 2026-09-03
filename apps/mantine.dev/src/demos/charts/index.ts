import { defineComponent, h, type Component } from 'vue'
import {
  AreaChart,
  BarChart,
  BarsList,
  BubbleChart,
  CandlestickChart,
  CompositeChart,
  DonutChart,
  FunnelChart,
  GaugeChart,
  Heatmap,
  LineChart,
  MatrixChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  ScatterChart,
  Sparkline,
  Treemap,
  WaffleChart,
} from '@mantine-vue/charts'
import type { MantineDemo } from '@/demo'

const templateExpression = (value: string) => ['$', `{${value}}`].join('')

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
export const areaChartStream = demo(
  AreaChart,
  { data: monthlyData, dataKey: 'month', series, type: 'stream', withLegend: true },
  cartesianCode('AreaChart', ' type="stream"'),
)
export const areaChartReferences = demo(
  AreaChart,
  {
    data: monthlyData,
    dataKey: 'month',
    series,
    referenceAreas: [{ x1: 'Feb', x2: 'Apr', color: 'blue.1', label: 'Campaign' }],
    referenceDots: [{ x: 'Apr', y: 2200, color: 'red.6', label: 'Peak', r: 6 }],
  },
  cartesianCode(
    'AreaChart',
    ` :reference-areas="[{ x1: 'Feb', x2: 'Apr', color: 'blue.1', label: 'Campaign' }]"
    :reference-dots="[{ x: 'Apr', y: 2200, color: 'red.6', label: 'Peak', r: 6 }]"`,
  ),
)
export const barChart = demo(
  BarChart,
  { data: monthlyData, dataKey: 'month', series, withLegend: true },
  cartesianCode('BarChart'),
)
export const barChartReferences = demo(
  BarChart,
  {
    data: monthlyData,
    dataKey: 'month',
    series,
    referenceAreas: [{ y1: 1000, y2: 1800, color: 'orange.1', label: 'Target range' }],
    referenceDots: [{ x: 'Jun', y: 2500, color: 'red.6', label: 'Peak', r: 6 }],
  },
  cartesianCode(
    'BarChart',
    ` :reference-areas="[{ y1: 1000, y2: 1800, color: 'orange.1', label: 'Target range' }]"
    :reference-dots="[{ x: 'Jun', y: 2500, color: 'red.6', label: 'Peak', r: 6 }]"`,
  ),
)
export const lineChart = demo(
  LineChart,
  { data: monthlyData, dataKey: 'month', series, withLegend: true },
  cartesianCode('LineChart'),
)
export const lineChartReferences = demo(
  LineChart,
  {
    data: monthlyData,
    dataKey: 'month',
    series,
    referenceAreas: [{ y1: 1000, y2: 1800, color: 'teal.1', label: 'Target range' }],
    referenceDots: [{ x: 'Jun', y: 2500, color: 'grape.6', label: 'Record', r: 6 }],
  },
  cartesianCode(
    'LineChart',
    ` :reference-areas="[{ y1: 1000, y2: 1800, color: 'teal.1', label: 'Target range' }]"
    :reference-dots="[{ x: 'Jun', y: 2500, color: 'grape.6', label: 'Record', r: 6 }]"`,
  ),
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
export const compositeChartReferences = demo(
  CompositeChart,
  {
    data: monthlyData,
    dataKey: 'month',
    series: [
      { ...series[0], type: 'bar' },
      { ...series[1], type: 'line' },
      { ...series[2], type: 'area' },
    ],
    referenceAreas: [{ x1: 'Mar', x2: 'May', color: 'grape.1', label: 'Quarter' }],
    referenceDots: [{ x: 'Apr', y: 2200, color: 'red.6', label: 'Peak', r: 6 }],
  },
  cartesianCode(
    'CompositeChart',
    ` :reference-areas="[{ x1: 'Mar', x2: 'May', color: 'grape.1', label: 'Quarter' }]"
    :reference-dots="[{ x: 'Apr', y: 2200, color: 'red.6', label: 'Peak', r: 6 }]"`,
  ),
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
export const scatterChartReferences = demo(
  ScatterChart,
  {
    data: scatterData,
    dataKey: 'x',
    xAxisKey: 'x',
    yAxisKey: 'y',
    series: [{ name: 'Sales', color: 'blue.6' }],
    referenceAreas: [{ x1: 20, x2: 45, y1: 25, y2: 55, color: 'yellow.2', label: 'Expected' }],
    referenceDots: [{ x: 60, y: 72, color: 'red.6', label: 'Outlier', r: 7 }],
  },
  `<script setup lang="ts">
import { ScatterChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(scatterData, null, 2)}
</script>
<template><ScatterChart :data="data" data-key="x" x-axis-key="x" y-axis-key="y"
  :series="[{ name: 'Sales', color: 'blue.6' }]"
  :reference-areas="[{ x1: 20, x2: 45, y1: 25, y2: 55, color: 'yellow.2' }]"
  :reference-dots="[{ x: 60, y: 72, color: 'red.6', label: 'Outlier' }]" /></template>`,
)
const scatterRightAxisData = [
  { x: 10, y: 28, name: 'Conversion' },
  { x: 20, y: 34, name: 'Conversion' },
  { x: 30, y: 42, name: 'Conversion' },
  { x: 10, y: 1200, name: 'Revenue' },
  { x: 20, y: 1900, name: 'Revenue' },
  { x: 30, y: 2600, name: 'Revenue' },
]
export const scatterChartRightYAxis = demo(
  ScatterChart,
  {
    data: scatterRightAxisData,
    xAxisKey: 'x',
    yAxisKey: 'y',
    series: [
      { name: 'Conversion', color: 'blue.6' },
      { name: 'Revenue', color: 'teal.6', yAxisId: 'right' },
    ],
    withRightYAxis: true,
    yAxisLabel: 'Conversion, %',
    rightYAxisLabel: 'Revenue, $',
    withLegend: true,
  },
  `<script setup lang="ts">
import { ScatterChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(scatterRightAxisData, null, 2)}
</script>
<template><ScatterChart :data="data" x-axis-key="x" y-axis-key="y"
  :series="[{ name: 'Conversion', color: 'blue.6' }, { name: 'Revenue', color: 'teal.6', yAxisId: 'right' }]"
  with-right-y-axis y-axis-label="Conversion, %" right-y-axis-label="Revenue, $" with-legend /></template>`,
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
  Array.from({ length: 150 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 0, index + 1))
    return [date.toISOString().slice(0, 10), (index * 17) % 12]
  }),
)
export const heatmap = demo(
  Heatmap,
  {
    data: heatmapData,
    startDate: '2026-01-01',
    endDate: '2026-05-31',
    withMonthLabels: true,
    withWeekdayLabels: true,
    withLegend: true,
    height: 300,
    rectSize: 20,
    gap: 2,
  },
  `<script setup lang="ts">
import { Heatmap } from '@mantine-vue/charts'
const data = ${JSON.stringify(heatmapData, null, 2)}
</script>
<template><Heatmap :data="data" start-date="2026-01-01" end-date="2026-03-31" with-month-labels with-weekday-labels with-legend /></template>`,
)

export const ChartsDemos = {
  areaChart,
  areaChartStream,
  areaChartReferences,
  barChart,
  barChartReferences,
  barsList,
  bubbleChart,
  compositeChart,
  compositeChartReferences,
  donutChart,
  funnelChart,
  heatmap,
  lineChart,
  lineChartReferences,
  pieChart,
  radarChart,
  radialBarChart,
  sankeyChart,
  scatterChart,
  scatterChartReferences,
  scatterChartRightYAxis,
  sparkline,
  treemap,
}

const gaugeCode = (attributes = ':value="72"') => `<script setup lang="ts">
import { h } from 'vue'
import { GaugeChart } from '@mantine-vue/charts'
</script>
<template><GaugeChart ${attributes} aria-label="CPU utilization" /></template>`

export const GaugeChartDemos = {
  usage: demo(
    GaugeChart,
    { value: 72, size: 240, filledColor: 'blue.6', ariaLabel: 'CPU utilization' },
    gaugeCode(),
    420,
  ),
  sectionsProp: demo(
    GaugeChart,
    {
      value: 68,
      size: 240,
      sections: [
        { value: 40, color: 'green.6' },
        { value: 75, color: 'yellow.6' },
        { value: 100, color: 'red.6' },
      ],
      target: 68,
    },
    gaugeCode(`:value="68" :sections="[
      { value: 40, color: 'green.6' },
      { value: 75, color: 'yellow.6' },
      { value: 100, color: 'red.6' },
    ]" :target="68"`),
    420,
  ),
  target: demo(
    GaugeChart,
    { value: 62, target: 80, targetColor: 'red.6', targetSize: 5, size: 240 },
    gaugeCode(':value="62" :target="80" target-color="red.6" :target-size="5"'),
    420,
  ),
  angles: demo(
    GaugeChart,
    { value: 72, startAngle: -90, endAngle: 90, size: 240 },
    gaugeCode(':value="72" :start-angle="-90" :end-angle="90"'),
    420,
  ),
  thickness: demo(
    GaugeChart,
    { value: 72, thickness: 24, size: 260 },
    gaugeCode(':value="72" :thickness="24" :size="260"'),
    420,
  ),
  label: demo(
    GaugeChart,
    { value: 72, size: 240, label: h('strong', {}, '72% CPU') },
    gaugeCode(':value="72" :label="h(\'strong\', \'72% CPU\')"'),
    420,
  ),
  roundCaps: demo(
    GaugeChart,
    { value: 72, roundCaps: true, size: 240 },
    gaugeCode(':value="72" round-caps'),
    420,
  ),
}

const waffleData = [
  { name: 'Completed', value: 64, color: 'blue.6' },
  { name: 'In progress', value: 21, color: 'teal.6' },
]
const waffleCode = (attributes = '', total = 100) => `<script setup lang="ts">
import { WaffleChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(waffleData, null, 2)}
</script>
<template><WaffleChart :data="data" :total="${total}" ${attributes} aria-label="Project status" /></template>`

export const WaffleChartDemos = {
  usage: demo(WaffleChart, { data: waffleData, total: 100, size: 320 }, waffleCode(), 520),
  total: demo(WaffleChart, { data: waffleData, total: 120, size: 320 }, waffleCode('', 120), 520),
  tooltip: demo(
    WaffleChart,
    {
      data: waffleData,
      total: 100,
      size: 320,
      withTooltip: true,
      getTooltipLabel: (cell: { name: string; count: number }) => `${cell.name}: ${cell.count}%`,
    },
    waffleCode(
      'with-tooltip :get-tooltip-label="(cell) => `' +
        templateExpression('cell.name') +
        ': ' +
        templateExpression('cell.count') +
        '%`"',
    ),
    520,
  ),
  legend: demo(
    WaffleChart,
    { data: waffleData, total: 100, size: 320, withLegend: true, legendPosition: 'right' },
    waffleCode('with-legend legend-position="right"'),
    620,
  ),
  gap: demo(
    WaffleChart,
    { data: waffleData, total: 100, rows: 8, columns: 12, gap: 4, cellRadius: 3 },
    waffleCode(':rows="8" :columns="12" :gap="4" :cell-radius="3"'),
    520,
  ),
  fillDirection: demo(
    WaffleChart,
    { data: waffleData, total: 100, fillDirection: 'bottom-to-top', size: 320 },
    waffleCode('fill-direction="bottom-to-top"'),
    520,
  ),
  emptyColor: demo(
    WaffleChart,
    { data: waffleData, total: 100, emptyColor: 'gray.2', size: 320 },
    waffleCode('empty-color="gray.2"'),
    520,
  ),
}

const matrixData = [
  { x: 'Mon', y: 'API', value: 2 },
  { x: 'Tue', y: 'API', value: 8 },
  { x: 'Wed', y: 'API', value: 5 },
  { x: 'Thu', y: 'API', value: null },
  { x: 'Fri', y: 'API', value: 11 },
  { x: 'Mon', y: 'Web', value: 7 },
  { x: 'Tue', y: 'Web', value: 4 },
  { x: 'Wed', y: 'Web', value: 13 },
  { x: 'Thu', y: 'Web', value: 9 },
  { x: 'Fri', y: 'Web', value: 6 },
]
const matrixCode = (attributes = '') => `<script setup lang="ts">
import { MatrixChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(matrixData, null, 2)}
</script>
<template><MatrixChart :data="data" ${attributes} aria-label="Deployments by service and weekday" /></template>`

export const MatrixChartDemos = {
  usage: demo(
    MatrixChart,
    { data: matrixData, withXLabels: true, withYLabels: true },
    matrixCode('with-x-labels with-y-labels'),
  ),
  labels: demo(
    MatrixChart,
    {
      data: matrixData,
      xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      yLabels: ['API', 'Web'],
      withXLabels: true,
      withYLabels: true,
    },
    matrixCode(
      ":x-labels=\"['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\" :y-labels=\"['API', 'Web']\" with-x-labels with-y-labels",
    ),
  ),
  xLabelsRotation: demo(
    MatrixChart,
    { data: matrixData, withXLabels: true, withYLabels: true, xLabelsRotation: -45 },
    matrixCode('with-x-labels with-y-labels :x-labels-rotation="-45"'),
  ),
  tooltip: demo(
    MatrixChart,
    {
      data: matrixData,
      withTooltip: true,
      getTooltipLabel: (cell: { x: string; y: string; value: number | null }) =>
        `${cell.y} on ${cell.x}: ${cell.value ?? 'No data'}`,
    },
    matrixCode(
      'with-tooltip :get-tooltip-label="(cell) => `' +
        templateExpression('cell.y') +
        ' on ' +
        templateExpression('cell.x') +
        ': ' +
        templateExpression("cell.value ?? 'No data'") +
        '`"',
    ),
  ),
  colors: demo(
    MatrixChart,
    { data: matrixData, colors: ['yellow.1', 'orange.5', 'red.8'] },
    matrixCode(":colors=\"['yellow.1', 'orange.5', 'red.8']\""),
  ),
  domain: demo(MatrixChart, { data: matrixData, domain: [0, 20] }, matrixCode(':domain="[0, 20]"')),
  cellSize: demo(
    MatrixChart,
    { data: matrixData, cellSize: 42, gap: 5, cellRadius: 6 },
    matrixCode(':cell-size="42" :gap="5" :cell-radius="6"'),
  ),
  getCellProps: demo(
    MatrixChart,
    {
      data: matrixData,
      getCellProps: (cell: { value: number | null }) => ({
        opacity: cell.value == null ? 0.35 : 1,
        'data-high': (cell.value ?? 0) > 10 || undefined,
      }),
    },
    matrixCode(':get-cell-props="(cell) => ({ opacity: cell.value == null ? 0.35 : 1 })"'),
  ),
  legend: demo(
    MatrixChart,
    { data: matrixData, withLegend: true, legendLabels: ['Low', 'High'] },
    matrixCode("with-legend :legend-labels=\"['Low', 'High']\""),
  ),
}

const candleData = [
  { date: 'Mar 01', open: 136, high: 142, low: 133, close: 140 },
  { date: 'Mar 02', open: 140, high: 145, low: 138, close: 139 },
  { date: 'Mar 03', open: 139, high: 141, low: 129, close: 131 },
  { date: 'Mar 04', open: 131, high: 138, low: 128, close: 136 },
  { date: 'Mar 05', open: 136, high: 149, low: 135, close: 147 },
]
const candleCode = (attributes = '') => `<script setup lang="ts">
import { CandlestickChart } from '@mantine-vue/charts'
const data = ${JSON.stringify(candleData, null, 2)}
</script>
<template><CandlestickChart :data="data" data-key="date" :height="300" ${attributes} /></template>`

export const CandlestickChartDemos = {
  usage: demo(CandlestickChart, { data: candleData, dataKey: 'date', height: 300 }, candleCode()),
  dataKeys: demo(
    CandlestickChart,
    {
      data: candleData.map(({ date, open, high, low, close }) => ({
        date,
        o: open,
        h: high,
        l: low,
        c: close,
      })),
      dataKey: 'date',
      dataKeys: { open: 'o', high: 'h', low: 'l', close: 'c' },
      height: 300,
    },
    candleCode(":data-keys=\"{ open: 'o', high: 'h', low: 'l', close: 'c' }\""),
  ),
  colors: demo(
    CandlestickChart,
    { data: candleData, dataKey: 'date', upColor: 'blue.6', downColor: 'orange.6', height: 300 },
    candleCode('up-color="blue.6" down-color="orange.6"'),
  ),
  maxCandleWidth: demo(
    CandlestickChart,
    { data: candleData, dataKey: 'date', maxCandleWidth: 18, height: 300 },
    candleCode(':max-candle-width="18"'),
  ),
  valueFormatter: demo(
    CandlestickChart,
    {
      data: candleData,
      dataKey: 'date',
      valueFormatter: (value: number) => `$${value.toFixed(2)}`,
      height: 300,
    },
    candleCode(':value-formatter="(value) => `$' + templateExpression('value.toFixed(2)') + '`"'),
  ),
  tooltipLabels: demo(
    CandlestickChart,
    {
      data: candleData,
      dataKey: 'date',
      labels: { open: 'Ouverture', high: 'Haut', low: 'Bas', close: 'Clôture' },
      height: 300,
    },
    candleCode(":labels=\"{ open: 'Ouverture', high: 'Haut', low: 'Bas', close: 'Clôture' }\""),
  ),
  axisLabels: demo(
    CandlestickChart,
    {
      data: candleData,
      dataKey: 'date',
      xAxisLabel: 'Trading day',
      yAxisLabel: 'Price, USD',
      height: 300,
    },
    candleCode('x-axis-label="Trading day" y-axis-label="Price, USD"'),
  ),
  referenceLines: demo(
    CandlestickChart,
    {
      data: candleData,
      dataKey: 'date',
      referenceLines: [{ y: 140, label: 'Resistance', color: 'red.6' }],
      height: 300,
    },
    candleCode(":reference-lines=\"[{ y: 140, label: 'Resistance', color: 'red.6' }]\""),
  ),
}
