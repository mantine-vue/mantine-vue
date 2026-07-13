<script setup lang="ts">
import { SimpleGrid, Stack } from '@mantine-vue/core'
import {
  AreaChart,
  BarChart,
  BarsList,
  CompositeChart,
  DonutChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
  Sparkline,
} from '@mantine-vue/charts'
import DemoCard from '../components/DemoCard.vue'

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

const compositeSeries: { name: string; color: string; type: 'bar' | 'line' | 'area' }[] = [
  { name: 'Smartphones', color: 'blue.6', type: 'bar' },
  { name: 'Laptops', color: 'teal.6', type: 'line' },
  { name: 'Tablets', color: 'violet.6', type: 'area' },
]

const radialData = [
  { name: 'USA', value: 400, color: 'blue.6' },
  { name: 'India', value: 300, color: 'teal.6' },
  { name: 'Japan', value: 200, color: 'violet.6' },
  { name: 'Other', value: 100, color: 'gray.5' },
]

const scatterData = [
  { x: 10, y: 30 },
  { x: 20, y: 45 },
  { x: 30, y: 28 },
  { x: 40, y: 60 },
  { x: 50, y: 48 },
  { x: 60, y: 72 },
]
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="AreaChart" description="Filled line chart for trends over time." pkg="charts">
      <AreaChart
        :data="monthlyData"
        data-key="month"
        :series="series"
        :height="260"
        withLegend
        withGradient
      />
    </DemoCard>

    <DemoCard name="BarChart" description="Compare values across categories." pkg="charts">
      <BarChart :data="monthlyData" data-key="month" :series="series" :height="260" withLegend />
    </DemoCard>

    <DemoCard name="LineChart" description="Track continuous values over an axis." pkg="charts">
      <LineChart :data="monthlyData" data-key="month" :series="series" :height="260" withLegend />
    </DemoCard>

    <DemoCard name="CompositeChart" description="Combine bar, line and area series." pkg="charts">
      <CompositeChart
        :data="monthlyData"
        data-key="month"
        :series="compositeSeries"
        :height="260"
        withLegend
      />
    </DemoCard>

    <DemoCard name="RadarChart" description="Compare multiple quantitative variables." pkg="charts">
      <RadarChart :data="monthlyData" data-key="month" :series="series" :height="280" withLegend />
    </DemoCard>

    <DemoCard
      name="ScatterChart"
      description="Show correlation between two variables."
      pkg="charts"
    >
      <ScatterChart
        :data="scatterData"
        data-key="x"
        x-axis-key="x"
        y-axis-key="y"
        :series="[{ name: 'Sales', color: 'blue.6' }]"
        :height="260"
        withTooltip
      />
    </DemoCard>

    <DemoCard
      name="PieChart, DonutChart & RadialBarChart"
      description="Part-to-whole visualizations."
      pkg="charts"
    >
      <SimpleGrid :cols="{ base: 1, sm: 3 }">
        <PieChart :data="radialData" :height="200" withTooltip withLabels />
        <DonutChart :data="radialData" :height="200" chartLabel="1,000" withTooltip />
        <RadialBarChart :data="radialData" :height="200" :maxValue="500" withTooltip />
      </SimpleGrid>
    </DemoCard>

    <DemoCard name="Sparkline" description="Tiny inline trend chart." pkg="charts">
      <Sparkline
        :data="[10, 18, 12, 25, 20, 32, 28, 40]"
        color="blue.6"
        :height="80"
        :curveType="'natural'"
      />
    </DemoCard>

    <DemoCard name="BarsList" description="Ranked horizontal bar list." pkg="charts">
      <BarsList :data="radialData" :height="200" />
    </DemoCard>
  </Stack>
</template>
