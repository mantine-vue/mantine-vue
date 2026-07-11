import type { EChartsOption, SeriesOption } from 'echarts'
import type { ChartDataItem, ChartReferenceLineProps, ChartSeries } from '../types'
import { resolveColor } from './colors'

type Props = Record<string, unknown>

const bool = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback)
const num = (value: unknown, fallback: number) => (typeof value === 'number' ? value : fallback)
const obj = (value: unknown) => (value && typeof value === 'object' ? value : {})
const list = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])
const formatter = (props: Props) =>
  typeof props.valueFormatter === 'function'
    ? (props.valueFormatter as (value: number) => string)
    : undefined

function tooltip(props: Props): EChartsOption['tooltip'] {
  if (!bool(props.withTooltip, true)) return { show: false }
  const format = formatter(props)
  return {
    trigger: 'axis',
    transitionDuration: num(props.tooltipAnimationDuration, 0) / 1000,
    valueFormatter: format ? (value) => format(Number(value)) : undefined,
    ...obj(props.tooltipProps),
  }
}

function markLine(referenceLines: ChartReferenceLineProps[] | undefined) {
  if (!referenceLines?.length) return undefined
  return {
    silent: true,
    symbol: 'none',
    data: referenceLines.map((line) => ({
      xAxis: line.x,
      yAxis: line.y,
      label: typeof line.label === 'string' ? { formatter: line.label } : line.label,
      lineStyle: {
        color: resolveColor(line.color, '#868e96'),
        type: line.strokeDasharray ? 'dashed' : 'solid',
      },
    })),
  }
}

export function cartesianOption(
  props: Props,
  kind: 'line' | 'area' | 'bar' | 'composite',
): EChartsOption {
  const data = list<ChartDataItem>(props.data)
  const series = list<
    ChartSeries & {
      type?: string
      stackId?: string
      strokeDasharray?: string | number
      curveType?: string
    }
  >(props.series)
  const dataKey = String(props.dataKey ?? 'name')
  const horizontal = props.orientation !== 'vertical'
  const chartType = String(props.type ?? 'default')
  const category = data.map((item) => item[dataKey] as string | number)
  const commonAxis = { axisLabel: { color: resolveColor(props.textColor, '#868e96') } }
  const categoryAxis = { type: 'category' as const, data: category, ...commonAxis }
  const valueAxis = { type: 'value' as const, name: props.yAxisLabel as string, ...commonAxis }
  const mapped = series.map((item, index) => {
    const itemKind = kind === 'composite' ? (item.type ?? 'line') : kind === 'area' ? 'line' : kind
    const color = resolveColor(item.color, resolveColor(`blue.${6 + (index % 3)}`))
    const stack = chartType === 'stacked' || chartType === 'percent' ? 'stack' : item.stackId
    const base = {
      name: item.label ?? item.name,
      data: data.map((entry) => entry[item.name] as number | null),
      yAxisIndex: item.yAxisId ? 1 : 0,
      stack,
      markLine:
        index === 0
          ? markLine(props.referenceLines as ChartReferenceLineProps[] | undefined)
          : undefined,
    }
    if (itemKind === 'bar') {
      return {
        ...base,
        type: 'bar',
        barMaxWidth: props.maxBarWidth as number,
        barMinHeight: num(props.minBarSize, 0),
        itemStyle: { color, opacity: num(props.fillOpacity, 1) },
        label: {
          show: bool(props.withBarValueLabel, false),
          position: horizontal ? 'top' : 'right',
        },
      }
    }
    return {
      ...base,
      type: 'line',
      smooth: !['linear', 'step', 'stepBefore', 'stepAfter'].includes(
        String(props.curveType ?? item.curveType ?? 'monotone'),
      ),
      step: String(props.curveType).startsWith('step') ? 'middle' : false,
      connectNulls: bool(props.connectNulls, true),
      showSymbol: bool(props.withDots, true),
      symbolSize: 6,
      lineStyle: {
        color,
        width: num(props.strokeWidth, 2),
        type: item.strokeDasharray ? 'dashed' : 'solid',
      },
      itemStyle: { color, opacity: num(props.fillOpacity, 1) },
      areaStyle: itemKind === 'area' ? { color, opacity: num(props.fillOpacity, 0.2) } : undefined,
      label: { show: bool(props.withPointLabels, false), position: 'top' },
    }
  }) as unknown as SeriesOption[]

  return {
    animationDurationUpdate: num(props.tooltipAnimationDuration, 0),
    color: series.map((item) => resolveColor(item.color)),
    grid: {
      left: 48,
      right: bool(props.withRightYAxis, false) ? 48 : 16,
      top: bool(props.withLegend, false) ? 44 : 16,
      bottom: 38,
      containLabel: true,
      ...obj(props.gridProps),
    },
    legend: { show: bool(props.withLegend, false), ...obj(props.legendProps) },
    tooltip: tooltip(props),
    xAxis: horizontal
      ? {
          ...categoryAxis,
          show: bool(props.withXAxis, true),
          name: props.xAxisLabel as string,
          ...obj(props.xAxisProps),
        }
      : { ...valueAxis, show: bool(props.withXAxis, true), ...obj(props.xAxisProps) },
    yAxis: horizontal
      ? [
          { ...valueAxis, show: bool(props.withYAxis, true), ...obj(props.yAxisProps) },
          {
            ...valueAxis,
            show: bool(props.withRightYAxis, false),
            position: 'right',
            name: props.rightYAxisLabel as string,
            ...obj(props.rightYAxisProps),
          },
        ]
      : { ...categoryAxis, show: bool(props.withYAxis, true), ...obj(props.yAxisProps) },
    series: mapped,
  }
}

export function radialOption(props: Props, donut = false): EChartsOption {
  const data = list<{ name: string; value: number; color?: string }>(props.data)
  return {
    color: data.map((item) => resolveColor(item.color)),
    legend: {
      show: bool(props.withLabels, false) || bool(props.withLegend, false),
      ...obj(props.legendProps),
    },
    tooltip: { trigger: 'item', show: bool(props.withTooltip, true), ...obj(props.tooltipProps) },
    series: [
      {
        type: 'pie',
        radius: donut ? [`${num(props.thickness, 40)}%`, '75%'] : ['0%', '75%'],
        startAngle: num(props.startAngle, 90),
        minAngle: num(props.minAngle, 0),
        padAngle: num(props.paddingAngle, 0),
        roseType:
          props.type === 'pie'
            ? undefined
            : props.type === 'donut'
              ? undefined
              : (props.type as 'radius' | 'area'),
        label: {
          show: bool(props.withLabels, false),
          formatter: props.withLabelsLine ? '{b}: {d}%' : '{b}',
        },
        labelLine: { show: bool(props.withLabelsLine, false) },
        data: data.map((item) => ({ ...item, itemStyle: { color: resolveColor(item.color) } })),
      },
    ],
    graphic: props.chartLabel
      ? [
          {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: String(props.chartLabel),
              fill: resolveColor(props.chartLabelColor, '#212529'),
              fontSize: num(props.chartLabelFontSize, 18),
            },
          },
        ]
      : undefined,
  }
}

export function scatterOption(props: Props, bubble = false): EChartsOption {
  const data = list<ChartDataItem>(props.data)
  const series = list<ChartSeries>(props.series)
  const xKey = String(props.dataKey ?? props.xAxisKey ?? 'x')
  const yKey = String(props.yAxisKey ?? 'y')
  const zKey = String(props.zAxisKey ?? 'z')
  return {
    grid: { containLabel: true, ...obj(props.gridProps) },
    legend: { show: bool(props.withLegend, false), ...obj(props.legendProps) },
    tooltip: { trigger: 'item', show: bool(props.withTooltip, true), ...obj(props.tooltipProps) },
    xAxis: { type: 'value', show: bool(props.withXAxis, true), ...obj(props.xAxisProps) },
    yAxis: { type: 'value', show: bool(props.withYAxis, true), ...obj(props.yAxisProps) },
    series: (series.length
      ? series
      : [{ name: String(props.name ?? 'value'), color: props.color as string }]
    ).map((item) => ({
      type: 'scatter',
      name: item.label ?? item.name,
      data: data
        .filter((entry) => !entry.name || entry.name === item.name)
        .map((entry) => [entry[xKey], entry[yKey], entry[zKey], entry]),
      symbolSize: bubble
        ? (value: unknown[]) => Math.max(4, Math.sqrt(Number(value[2] ?? 1)) * num(props.range, 4))
        : num(props.size, 10),
      itemStyle: { color: resolveColor(item.color) },
    })) as unknown as SeriesOption[],
  }
}

export function sparklineOption(props: Props): EChartsOption {
  const data = list<number | null>(props.data)
  const trend = props.trendColors as
    | { positive?: string; negative?: string; neutral?: string }
    | undefined
  const color = trend
    ? resolveColor(
        data.at(-1)! > data[0]!
          ? trend.positive
          : data.at(-1)! < data[0]!
            ? trend.negative
            : trend.neutral,
      )
    : resolveColor(props.color)
  return {
    grid: { left: 0, right: 0, top: 1, bottom: 1 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false, scale: true },
    series: [
      {
        type: 'line',
        data,
        showSymbol: false,
        connectNulls: bool(props.connectNulls, true),
        smooth: props.curveType !== 'linear',
        lineStyle: { color, width: num(props.strokeWidth, 2) },
        areaStyle: bool(props.withGradient, true)
          ? { color, opacity: num(props.fillOpacity, 0.6) }
          : undefined,
      },
    ],
  }
}

export function radarOption(props: Props): EChartsOption {
  const data = list<ChartDataItem>(props.data)
  const series = list<ChartSeries>(props.series)
  const key = String(props.dataKey ?? 'name')
  const max = num(
    props.maxValue,
    Math.max(1, ...data.flatMap((row) => series.map((s) => Number(row[s.name] ?? 0)))),
  )
  return {
    legend: { show: bool(props.withLegend, false) },
    tooltip: { show: bool(props.withTooltip, true) },
    radar: {
      indicator: data.map((row) => ({ name: String(row[key]), max })),
      shape: props.shape === 'circle' ? 'circle' : 'polygon',
    },
    series: [
      {
        type: 'radar',
        data: series.map((s) => ({
          name: s.label ?? s.name,
          value: data.map((row) => Number(row[s.name] ?? 0)),
          lineStyle: { color: resolveColor(s.color) },
          itemStyle: { color: resolveColor(s.color) },
          areaStyle: bool(props.withPolarGrid, false) ? {} : undefined,
        })),
      },
    ],
  }
}

export function simpleOption(type: 'funnel' | 'treemap' | 'sankey', props: Props): EChartsOption {
  const data = list<Record<string, unknown>>(props.data)
  if (type === 'sankey')
    return {
      tooltip: { show: bool(props.withTooltip, true) },
      series: [
        {
          type,
          data: list(props.nodes ?? data),
          links: list(props.links),
          emphasis: { focus: 'adjacency' },
          ...obj(props.sankeyProps),
        },
      ],
    }
  return {
    tooltip: { show: bool(props.withTooltip, true) },
    legend: { show: bool(props.withLegend, false) },
    series: [
      {
        type,
        data: data.map((item) => ({ ...item, itemStyle: { color: resolveColor(item.color) } })),
        ...obj(props[`${type}Props`]),
      },
    ],
  }
}

export function radialBarOption(props: Props): EChartsOption {
  const data = list<{ name: string; value: number; color?: string }>(props.data)
  return {
    legend: { show: bool(props.withLegend, false) },
    tooltip: { show: bool(props.withTooltip, true) },
    polar: {},
    angleAxis: { max: num(props.maxValue, 100), show: false },
    radiusAxis: {
      type: 'category',
      data: data.map((i) => i.name),
      show: bool(props.withLabels, true),
    },
    series: [
      {
        type: 'bar',
        coordinateSystem: 'polar',
        roundCap: true,
        data: data.map((i) => ({ value: i.value, itemStyle: { color: resolveColor(i.color) } })),
      },
    ],
  }
}

export function heatmapOption(props: Props): EChartsOption {
  const input =
    props.data && typeof props.data === 'object' ? (props.data as Record<string, number>) : {}
  const data = Object.entries(input).map(([date, value]) => [date, value])
  const values = Object.values(input)
  const date = (value: unknown, fallback: string) =>
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : typeof value === 'string'
        ? value
        : fallback
  const start = date(props.startDate, String(data[0]?.[0] ?? new Date().toISOString().slice(0, 10)))
  const end = date(props.endDate, String(data.at(-1)?.[0] ?? start))
  return {
    tooltip: { show: bool(props.withTooltip, false) },
    visualMap: {
      show: bool(props.withLegend, false),
      min: (props.domain as number[] | undefined)?.[0] ?? Math.min(0, ...values),
      max: (props.domain as number[] | undefined)?.[1] ?? Math.max(1, ...values),
      inRange: {
        color: list<string>(props.colors).length
          ? list<string>(props.colors).map((color) => resolveColor(color))
          : ['#ebfbee', '#2f9e44'],
      },
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
    },
    calendar: {
      range: [start, end],
      cellSize: num(props.rectSize, 10) + num(props.gap, 1),
      dayLabel: {
        show: bool(props.withWeekdayLabels, false),
        firstDay: num(props.firstDayOfWeek, 1),
      },
      monthLabel: { show: bool(props.withMonthLabels, false) },
      itemStyle: {
        borderWidth: num(props.gap, 1),
        borderColor: 'transparent',
        borderRadius: num(props.rectRadius, 2),
      },
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data }],
  }
}
