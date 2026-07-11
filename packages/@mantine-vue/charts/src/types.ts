import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue'
import type { EChartsOption } from 'echarts'
import type { MantineColor } from '@mantine-vue/core'

export type ChartDataItem = Record<string, unknown>
export type ChartData = ChartDataItem[]
export type ChartOptionProps = Record<string, unknown>

export interface ChartSeries {
  name: string
  color?: MantineColor
  label?: string
  yAxisId?: string
}

export interface ChartReferenceLineProps {
  x?: string | number
  y?: string | number
  color?: MantineColor
  label?: string | Record<string, unknown>
  labelPosition?: string
  strokeDasharray?: string | number
  [key: string]: unknown
}

export type BaseChartStylesNames =
  | 'root'
  | 'container'
  | 'axis'
  | 'grid'
  | 'referenceLine'
  | 'axisLabel'

export interface ChartRootProps {
  class?: HTMLAttributes['class']
  className?: string
  style?: CSSProperties | string
  id?: string
  dir?: 'ltr' | 'rtl' | 'auto'
  height?: string | number
  width?: string | number
  option?: EChartsOption
  loading?: boolean
  autoresize?: boolean
  /** ECharts renderer used to draw the chart. @default 'canvas' */
  renderer?: 'canvas' | 'svg'
  /** Additional options passed to `echarts.init`. */
  initOptions?: Record<string, unknown>
}

export interface GridChartBaseProps extends ChartRootProps {
  data: ChartData
  dataKey: string
  referenceLines?: ChartReferenceLineProps[]
  withXAxis?: boolean
  withYAxis?: boolean
  xAxisProps?: ChartOptionProps
  yAxisProps?: ChartOptionProps
  rightYAxisProps?: ChartOptionProps
  gridProps?: ChartOptionProps
  tickLine?: 'x' | 'y' | 'xy' | 'none'
  strokeDasharray?: string | number
  gridAxis?: 'x' | 'y' | 'xy' | 'none'
  unit?: string
  tooltipAnimationDuration?: number
  legendProps?: ChartOptionProps
  tooltipProps?: ChartOptionProps
  withLegend?: boolean
  withTooltip?: boolean
  textColor?: MantineColor
  gridColor?: MantineColor
  orientation?: 'horizontal' | 'vertical'
  valueFormatter?: (value: number) => string
  xAxisLabel?: string
  yAxisLabel?: string
  rightYAxisLabel?: string
  withRightYAxis?: boolean
}

export interface MantineChartDotProps extends ChartOptionProps {
  strokeWidth?: number
}

export interface ChartTooltipPayload {
  name?: string
  dataKey?: string
  value?: unknown
  color?: string
  unit?: string
  payload?: ChartDataItem
  [key: string]: unknown
}

export type ChartRenderable = VNodeChild | string | number | null | undefined
