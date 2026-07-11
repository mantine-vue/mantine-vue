import type { MantineColor } from '@mantine-vue/core'
import type { DefineComponent, HTMLAttributes, VNodeChild } from 'vue'
import { createChartComponent } from './internal/component'
import {
  cartesianOption,
  heatmapOption,
  radarOption,
  radialBarOption,
  radialOption,
  scatterOption,
  simpleOption,
  sparklineOption,
} from './internal/options'
import type {
  ChartData,
  ChartOptionProps,
  ChartRootProps,
  ChartSeries,
  GridChartBaseProps,
  MantineChartDotProps,
} from './types'

export type LineChartCurveType =
  | 'bump'
  | 'linear'
  | 'natural'
  | 'monotone'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'
export type AreaChartCurveType = LineChartCurveType
export type CompositeChartCurveType = LineChartCurveType
export interface LineChartSeries extends ChartSeries {
  strokeDasharray?: string | number
  curveType?: LineChartCurveType
}
export interface AreaChartSeries extends ChartSeries {
  color: MantineColor
  strokeDasharray?: string | number
  curveType?: AreaChartCurveType
}
export interface BarChartSeries extends ChartSeries {
  stackId?: string
}
export interface CompositeChartSeries extends ChartSeries {
  type: 'line' | 'area' | 'bar'
  strokeDasharray?: string | number
}

export interface LineChartProps extends GridChartBaseProps {
  series: LineChartSeries[]
  type?: 'default' | 'gradient'
  gradientStops?: { offset: number; color: MantineColor }[]
  curveType?: LineChartCurveType
  fillOpacity?: number
  withDots?: boolean
  dotProps?: MantineChartDotProps
  activeDotProps?: MantineChartDotProps
  strokeWidth?: number
  lineChartProps?: ChartOptionProps
  connectNulls?: boolean
  lineProps?: ChartOptionProps | ((series: LineChartSeries) => ChartOptionProps)
  withPointLabels?: boolean
}
export interface AreaChartProps extends GridChartBaseProps {
  series: AreaChartSeries[]
  type?: 'default' | 'stacked' | 'percent' | 'split'
  withGradient?: boolean
  curveType?: AreaChartCurveType
  withDots?: boolean
  dotProps?: MantineChartDotProps
  activeDotProps?: MantineChartDotProps
  strokeWidth?: number
  areaChartProps?: ChartOptionProps
  fillOpacity?: number
  splitColors?: [MantineColor, MantineColor]
  splitOffset?: number
  connectNulls?: boolean
  areaProps?: ChartOptionProps | ((series: AreaChartSeries) => ChartOptionProps)
  withPointLabels?: boolean
}
export interface BarChartProps extends GridChartBaseProps {
  series: BarChartSeries[]
  type?: 'default' | 'stacked' | 'percent' | 'waterfall'
  fillOpacity?: number
  cursorFill?: MantineColor
  barChartProps?: ChartOptionProps
  barProps?: ChartOptionProps | ((series: BarChartSeries) => ChartOptionProps)
  withBarValueLabel?: boolean
  valueLabelProps?: ChartOptionProps | ((series: BarChartSeries) => ChartOptionProps)
  minBarSize?: number
  maxBarWidth?: number
  barLabelColor?: MantineColor
  getBarColor?: (value: number, series: BarChartSeries) => MantineColor
}
export interface CompositeChartProps extends Omit<GridChartBaseProps, 'orientation'> {
  series: CompositeChartSeries[]
  curveType?: CompositeChartCurveType
  withDots?: boolean
  dotProps?: MantineChartDotProps
  activeDotProps?: MantineChartDotProps
  strokeWidth?: number
  connectNulls?: boolean
  lineProps?: ChartOptionProps | ((series: CompositeChartSeries) => ChartOptionProps)
  areaProps?: ChartOptionProps | ((series: CompositeChartSeries) => ChartOptionProps)
  barProps?: ChartOptionProps | ((series: CompositeChartSeries) => ChartOptionProps)
  withPointLabels?: boolean
  withBarValueLabel?: boolean
  minBarSize?: number
  maxBarWidth?: number
  composedChartProps?: ChartOptionProps
}

export interface PieChartCell {
  name: string
  value: number
  color?: MantineColor
}
export interface PieChartProps extends ChartRootProps {
  data: PieChartCell[]
  withTooltip?: boolean
  withLabels?: boolean
  withLabelsLine?: boolean
  labelsPosition?: 'inside' | 'outside'
  labelsType?: 'value' | 'percent'
  tooltipDataSource?: 'segment' | 'all'
  valueFormatter?: (value: number) => string
  strokeWidth?: number
  size?: number
  startAngle?: number
  endAngle?: number
  paddingAngle?: number
  pieProps?: ChartOptionProps
  tooltipProps?: ChartOptionProps
}
export interface DonutChartProps extends PieChartProps {
  thickness?: number
  chartLabel?: string
  chartLabelColor?: MantineColor
  chartLabelFontSize?: number
  chartLabelProps?: ChartOptionProps
}

export interface ScatterChartSeries extends ChartSeries {
  data?: ChartData
}
export interface ScatterChartProps extends GridChartBaseProps {
  data: ChartData
  series: ScatterChartSeries[]
  xAxisKey?: string
  yAxisKey?: string
  scatterProps?: ChartOptionProps | ((series: ScatterChartSeries) => ChartOptionProps)
}
export interface BubbleChartProps extends ChartRootProps {
  data: ChartData
  xAxisKey?: string
  yAxisKey?: string
  zAxisKey?: string
  name?: string
  color?: MantineColor
  range?: number
  withTooltip?: boolean
  withXAxis?: boolean
  withYAxis?: boolean
  xAxisProps?: ChartOptionProps
  yAxisProps?: ChartOptionProps
  tooltipProps?: ChartOptionProps
  gridProps?: ChartOptionProps
  valueFormatter?: (value: number) => string
}

export interface RadarChartProps extends GridChartBaseProps {
  series: ChartSeries[]
  maxValue?: number
  withPolarGrid?: boolean
  withAngleAxis?: boolean
  withRadiusAxis?: boolean
  shape?: 'polygon' | 'circle'
  radarProps?: ChartOptionProps
}
export interface RadialBarChartCell {
  name: string
  value: number
  color?: MantineColor
}
export interface RadialBarChartProps extends ChartRootProps {
  data: RadialBarChartCell[]
  maxValue?: number
  withLabels?: boolean
  withLegend?: boolean
  withTooltip?: boolean
  startAngle?: number
  endAngle?: number
  barSize?: number
  radialBarProps?: ChartOptionProps
  tooltipProps?: ChartOptionProps
  legendProps?: ChartOptionProps
}
export interface FunnelChartCell extends PieChartCell {
  label?: string
}
export interface FunnelChartProps extends ChartRootProps {
  data: FunnelChartCell[]
  withTooltip?: boolean
  withLabels?: boolean
  withLegend?: boolean
  valueFormatter?: (value: number) => string
  funnelProps?: ChartOptionProps
  tooltipProps?: ChartOptionProps
}

export interface TreemapData {
  name: string
  value?: number
  color?: MantineColor
  children?: TreemapData[]
}
export interface TreemapProps extends ChartRootProps {
  data: TreemapData[]
  withTooltip?: boolean
  withLegend?: boolean
  valueFormatter?: (value: number) => string
  treemapProps?: ChartOptionProps
}
export interface SankeyChartNode {
  name: string
  color?: MantineColor
  [key: string]: unknown
}
export interface SankeyChartLink {
  source: string | number
  target: string | number
  value: number
  [key: string]: unknown
}
export interface SankeyChartProps extends ChartRootProps {
  data?: SankeyChartNode[]
  nodes?: SankeyChartNode[]
  links: SankeyChartLink[]
  withTooltip?: boolean
  valueFormatter?: (value: number) => string
  sankeyProps?: ChartOptionProps
}

export interface SparklineTrendColors {
  positive: MantineColor
  negative: MantineColor
  neutral?: MantineColor
}
export interface SparklineProps extends ChartRootProps {
  data: (number | null)[]
  color?: MantineColor
  withGradient?: boolean
  fillOpacity?: number
  curveType?: LineChartCurveType
  strokeWidth?: number
  trendColors?: SparklineTrendColors
  connectNulls?: boolean
  areaProps?: ChartOptionProps
}
export interface HeatmapRectData {
  date: string
  value: number | null
}
export interface HeatmapProps extends ChartRootProps {
  data: Record<string, number>
  domain?: [number, number]
  startDate?: Date | string
  endDate?: Date | string
  withMonthLabels?: boolean
  monthLabels?: string[]
  withWeekdayLabels?: boolean
  weekdayLabels?: string[]
  withOutsideDates?: boolean
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  rectSize?: number
  gap?: number
  rectRadius?: number
  colors?: string[]
  weekdaysLabelsWidth?: number
  monthsLabelsHeight?: number
  fontSize?: number
  getTooltipLabel?: (input: HeatmapRectData) => VNodeChild
  withTooltip?: boolean
  tooltipProps?: ChartOptionProps
  getRectProps?: (input: HeatmapRectData) => Record<string, unknown>
  splitMonths?: boolean
  withLegend?: boolean
  legendLabels?: [string, string]
}

export interface BarsListBarData {
  name: string
  value: number
  color?: MantineColor
  textColor?: MantineColor
  variant?: 'light' | 'filled'
}
export interface BarsListProps extends ChartRootProps {
  data: BarsListBarData[]
  valueFormatter?: (value: number) => string
  barsLabel?: string
  valueLabel?: string
  getBarProps?: (data: BarsListBarData) => HTMLAttributes
  renderBar?: (data: BarsListBarData, defaultBar: VNodeChild) => VNodeChild
  barGap?: string | number
  minBarSize?: string | number
  barHeight?: string | number
  barColor?: MantineColor
  barTextColor?: MantineColor
  autoContrast?: boolean
}

type PublicComponent<P> = DefineComponent<P>
export const AreaChart = createChartComponent('AreaChart', (p) =>
  cartesianOption(p, 'area'),
) as PublicComponent<AreaChartProps>
export const BarChart = createChartComponent('BarChart', (p) =>
  cartesianOption(p, 'bar'),
) as PublicComponent<BarChartProps>
export const LineChart = createChartComponent('LineChart', (p) =>
  cartesianOption(p, 'line'),
) as PublicComponent<LineChartProps>
export const CompositeChart = createChartComponent('CompositeChart', (p) =>
  cartesianOption(p, 'composite'),
) as PublicComponent<CompositeChartProps>
export const PieChart = createChartComponent('PieChart', (p) =>
  radialOption(p),
) as PublicComponent<PieChartProps>
export const DonutChart = createChartComponent('DonutChart', (p) =>
  radialOption(p, true),
) as PublicComponent<DonutChartProps>
export const ScatterChart = createChartComponent('ScatterChart', (p) =>
  scatterOption(p),
) as PublicComponent<ScatterChartProps>
export const BubbleChart = createChartComponent('BubbleChart', (p) =>
  scatterOption(p, true),
) as PublicComponent<BubbleChartProps>
export const RadarChart = createChartComponent(
  'RadarChart',
  radarOption,
) as PublicComponent<RadarChartProps>
export const RadialBarChart = createChartComponent(
  'RadialBarChart',
  radialBarOption,
) as PublicComponent<RadialBarChartProps>
export const FunnelChart = createChartComponent('FunnelChart', (p) =>
  simpleOption('funnel', p),
) as PublicComponent<FunnelChartProps>
export const Treemap = createChartComponent('Treemap', (p) =>
  simpleOption('treemap', p),
) as PublicComponent<TreemapProps>
export const SankeyChart = createChartComponent('SankeyChart', (p) =>
  simpleOption('sankey', p),
) as PublicComponent<SankeyChartProps>
export const Sparkline = createChartComponent(
  'Sparkline',
  sparklineOption,
) as PublicComponent<SparklineProps>
export const Heatmap = createChartComponent(
  'Heatmap',
  heatmapOption,
) as PublicComponent<HeatmapProps>
export const BarsList = createChartComponent('BarsList', (p) =>
  cartesianOption(
    {
      ...p,
      dataKey: 'name',
      series: [{ name: 'value', color: p.barColor }],
      orientation: 'vertical',
      withXAxis: false,
      withYAxis: true,
      withTooltip: false,
      maxBarWidth: p.barHeight,
    },
    'bar',
  ),
) as PublicComponent<BarsListProps>

export type AreaChartStylesNames =
  | 'area'
  | import('./types').BaseChartStylesNames
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type BarChartStylesNames =
  | 'bar'
  | import('./types').BaseChartStylesNames
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type LineChartStylesNames =
  | 'line'
  | import('./types').BaseChartStylesNames
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type CompositeChartStylesNames =
  | 'line'
  | 'area'
  | 'bar'
  | import('./types').BaseChartStylesNames
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type PieChartStylesNames = 'root' | 'label'
export type DonutChartStylesNames = PieChartStylesNames
export type ScatterChartStylesNames =
  | import('./types').BaseChartStylesNames
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type BubbleChartStylesNames = ScatterChartStylesNames
export type RadarChartStylesNames =
  | 'root'
  | 'container'
  | 'axis'
  | 'grid'
  | 'curve'
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type RadialBarChartStylesNames =
  | 'root'
  | 'container'
  | 'label'
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type FunnelChartStylesNames =
  | 'root'
  | 'container'
  | 'label'
  | ChartLegendStylesNames
  | ChartTooltipStylesNames
export type TreemapStylesNames = 'root' | 'container'
export type SankeyChartStylesNames = 'root' | 'container'
export type SparklineStylesNames = 'root'
export type HeatmapStylesNames =
  | 'root'
  | 'rect'
  | 'weekdayLabel'
  | 'monthLabel'
  | 'legend'
  | 'legendLabel'
  | 'legendRect'
export type BarsListStylesNames = 'root' | 'bar' | 'barLabel' | 'barValue' | 'labelsRow'

export type ChartTooltipStylesNames =
  | 'tooltip'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'tooltipBody'
export type ChartLegendStylesNames = 'legendItem' | 'legendItemColor' | 'legendItemName' | 'legend'
export type ChartCssVariables = Record<string, string>
