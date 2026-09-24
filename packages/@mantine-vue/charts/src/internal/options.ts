import type { EChartsOption, SeriesOption } from 'echarts'
import type {
  ChartDataItem,
  ChartReferenceAreaProps,
  ChartReferenceDotProps,
  ChartReferenceLineProps,
  ChartSeries,
} from '../types'
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

function markArea(referenceAreas: ChartReferenceAreaProps[] | undefined) {
  if (!referenceAreas?.length) return undefined
  return {
    silent: true,
    data: referenceAreas.map((area) => [
      {
        xAxis: area.x1,
        yAxis: area.y1,
        itemStyle: { color: resolveColor(area.color, '#868e96'), opacity: 0.15 },
        label: typeof area.label === 'string' ? { formatter: area.label } : area.label,
      },
      { xAxis: area.x2, yAxis: area.y2 },
    ]),
  }
}

function markPoint(referenceDots: ChartReferenceDotProps[] | undefined) {
  if (!referenceDots?.length) return undefined
  return {
    silent: true,
    data: referenceDots.map((dot) => ({
      coord: [dot.x, dot.y],
      symbolSize: (dot.r ?? 6) * 2,
      itemStyle: { color: resolveColor(dot.color, '#868e96') },
      label: typeof dot.label === 'string' ? { formatter: dot.label } : dot.label,
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
    const stack =
      chartType === 'stacked' || chartType === 'percent' || chartType === 'stream'
        ? 'stack'
        : item.stackId
    const base = {
      name: item.label ?? item.name,
      data: data.map((entry) => entry[item.name] as number | null),
      yAxisIndex: item.yAxisId ? 1 : 0,
      stack,
      markLine:
        index === 0
          ? markLine(props.referenceLines as ChartReferenceLineProps[] | undefined)
          : undefined,
      markArea:
        index === 0
          ? markArea(props.referenceAreas as ChartReferenceAreaProps[] | undefined)
          : undefined,
      markPoint:
        index === 0
          ? markPoint(props.referenceDots as ChartReferenceDotProps[] | undefined)
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
        width: chartType === 'stream' ? 0 : num(props.strokeWidth, 2),
        type: item.strokeDasharray ? 'dashed' : 'solid',
      },
      itemStyle: { color, opacity: num(props.fillOpacity, 1) },
      areaStyle: itemKind === 'area' ? { color, opacity: num(props.fillOpacity, 0.2) } : undefined,
      label: { show: bool(props.withPointLabels, false), position: 'top' },
    }
  }) as unknown as SeriesOption[]

  if (kind === 'area' && chartType === 'stream') {
    mapped.unshift({
      type: 'line',
      stack: 'stack',
      silent: true,
      symbol: 'none',
      data: data.map(
        (entry) =>
          -series.reduce((total, item) => {
            const value = entry[item.name]
            return total + (typeof value === 'number' && Number.isFinite(value) ? value : 0)
          }, 0) / 2,
      ),
      lineStyle: { opacity: 0 },
      areaStyle: { opacity: 0 },
      tooltip: { show: false },
    } as SeriesOption)
  }

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
          {
            ...valueAxis,
            show: chartType === 'stream' ? false : bool(props.withYAxis, true),
            ...obj(props.yAxisProps),
          },
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
    yAxis: props.withRightYAxis
      ? [
          {
            type: 'value',
            show: bool(props.withYAxis, true),
            name: props.yAxisLabel as string,
            ...obj(props.yAxisProps),
          },
          {
            type: 'value',
            show: true,
            position: 'right',
            name: props.rightYAxisLabel as string,
            ...obj(props.rightYAxisProps),
          },
        ]
      : {
          type: 'value',
          show: bool(props.withYAxis, true),
          name: props.yAxisLabel as string,
          ...obj(props.yAxisProps),
        },
    series: (series.length
      ? series
      : [{ name: String(props.name ?? 'value'), color: props.color as string }]
    ).map((item, index) => ({
      type: 'scatter',
      name: item.label ?? item.name,
      yAxisIndex: item.yAxisId === 'right' ? 1 : 0,
      data: data
        .filter((entry) => !entry.name || entry.name === item.name)
        .map((entry) => [entry[xKey], entry[yKey], entry[zKey], entry]),
      symbolSize: bubble
        ? (value: unknown[]) => Math.max(4, Math.sqrt(Number(value[2] ?? 1)) * num(props.range, 4))
        : num(props.size, 10),
      itemStyle: { color: resolveColor(item.color) },
      markLine:
        index === 0
          ? markLine(props.referenceLines as ChartReferenceLineProps[] | undefined)
          : undefined,
      markArea:
        index === 0
          ? markArea(props.referenceAreas as ChartReferenceAreaProps[] | undefined)
          : undefined,
      markPoint:
        index === 0
          ? markPoint(props.referenceDots as ChartReferenceDotProps[] | undefined)
          : undefined,
    })) as unknown as SeriesOption[],
  }
}

export function gaugeOption(props: Props): EChartsOption {
  const min = num(props.min, 0)
  const max = num(props.max, 100)
  const value = num(props.value, min)
  const sections = list<{ value: number; color: string }>(props.sections)
  const range = max - min || 1
  const axisColors: [number, string][] = sections.length
    ? sections.map((section) => [
        Math.max(0, Math.min(1, (section.value - min) / range)),
        resolveColor(section.color),
      ])
    : [[1, resolveColor(props.trackColor, '#e9ecef')]]
  const format =
    typeof props.valueFormatter === 'function'
      ? (props.valueFormatter as (input: number) => string)
      : (input: number) => String(input)

  return {
    series: [
      {
        type: 'gauge',
        min,
        max,
        startAngle: 90 - num(props.startAngle, -120),
        endAngle: 90 - num(props.endAngle, 120),
        radius: '90%',
        axisLine: {
          roundCap: bool(props.roundCaps, false),
          lineStyle: {
            width: num(props.thickness, 12),
            color: axisColors,
          },
        },
        progress: sections.length
          ? { show: false }
          : {
              show: true,
              width: num(props.thickness, 12),
              roundCap: bool(props.roundCaps, false),
              itemStyle: { color: resolveColor(props.filledColor) },
            },
        pointer:
          typeof props.target === 'number'
            ? {
                show: true,
                width: num(props.targetSize, 2),
                length: '85%',
                itemStyle: { color: resolveColor(props.targetColor, '#212529') },
              }
            : { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          show: props.label !== null,
          formatter: typeof props.label === 'string' ? props.label : format(value),
          color: 'inherit',
        },
        data: [{ value: typeof props.target === 'number' ? props.target : value }],
      },
    ] as unknown as SeriesOption[],
  }
}

function normalizeSegmentValue(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

export function waffleOption(props: Props): EChartsOption {
  const rows = Math.max(1, num(props.rows, 10))
  const columns = Math.max(1, num(props.columns, 10))
  const cellCount = rows * columns
  const data = list<{ name: string; value: number; color: string; key?: string | number }>(
    props.data,
  )
  const values = data.map((item) => normalizeSegmentValue(item.value))
  const sum = values.reduce((total, value) => total + value, 0)
  const denominator = props.total == null ? sum : Math.max(num(props.total, sum), sum)
  const filledTarget = denominator ? Math.round((sum / denominator) * cellCount) : 0
  const allocated = values.map((value) => (sum ? Math.floor((value / sum) * filledTarget) : 0))
  let remainder = filledTarget - allocated.reduce((total, value) => total + value, 0)
  const fractions = values
    .map((value, index) => ({
      index,
      fraction: sum ? (value / sum) * filledTarget - allocated[index] : 0,
    }))
    .sort((a, b) => b.fraction - a.fraction)

  for (let index = 0; index < fractions.length && remainder > 0; index += 1, remainder -= 1) {
    allocated[fractions[index].index] += 1
  }

  const cells = data.flatMap((_, segmentIndex) =>
    Array.from({ length: allocated[segmentIndex] }, () => segmentIndex),
  )
  while (cells.length < cellCount) cells.push(-1)

  const direction = String(props.fillDirection ?? 'left-to-right')
  const points = cells.map((segmentIndex, index) => {
    let x = index % columns
    let y = Math.floor(index / columns)
    if (direction === 'right-to-left') x = columns - 1 - x
    if (direction === 'top-to-bottom' || direction === 'bottom-to-top') {
      x = Math.floor(index / rows)
      y = index % rows
      if (direction === 'bottom-to-top') y = rows - 1 - y
    }
    const item = data[segmentIndex]
    return {
      value: [x, y, segmentIndex],
      name: item?.name,
      itemStyle: {
        color: item ? resolveColor(item.color) : resolveColor(props.emptyColor, '#e9ecef'),
      },
    }
  })

  return {
    grid: { left: 0, right: 0, top: 0, bottom: bool(props.withLegend, true) ? 36 : 0 },
    xAxis: { type: 'value', min: -0.5, max: columns - 0.5, show: false },
    yAxis: { type: 'value', min: -0.5, max: rows - 0.5, inverse: true, show: false },
    legend: {
      show: bool(props.withLegend, true),
      data: data.map((item) => item.name),
      top: props.legendPosition === 'top' ? 0 : undefined,
      bottom: props.legendPosition === 'bottom' ? 0 : undefined,
      left: props.legendPosition === 'left' ? 0 : undefined,
      right: props.legendPosition === 'right' ? 0 : undefined,
    },
    tooltip: {
      show: bool(props.withTooltip, false),
      formatter: (params: any) => {
        const item = data[params.value?.[2]]
        if (!item) return ''
        return typeof props.getTooltipLabel === 'function'
          ? String(
              (props.getTooltipLabel as (input: Record<string, unknown>) => unknown)({
                ...item,
                count: allocated[params.value[2]],
              }),
            )
          : `${item.name}: ${item.value}`
      },
    },
    series: [
      { type: 'scatter', symbol: 'roundRect', symbolSize: num(props.cellSize, 20), data: points },
    ],
  }
}

export function matrixOption(props: Props): EChartsOption {
  const data = list<{ x: string; y: string; value: number | null }>(props.data)
  const xLabels = list<string>(props.xLabels).length
    ? list<string>(props.xLabels)
    : [...new Set(data.map((cell) => cell.x))]
  const yLabels = list<string>(props.yLabels).length
    ? list<string>(props.yLabels)
    : [...new Set(data.map((cell) => cell.y))]
  const values = data.flatMap((cell) => (typeof cell.value === 'number' ? [cell.value] : []))
  const domain =
    (props.domain as [number, number] | undefined) ??
    ([Math.min(0, ...values), Math.max(1, ...values)] as [number, number])
  const colors = list<string>(props.colors).length
    ? list<string>(props.colors).map((color) => resolveColor(color))
    : ['#ebfbee', '#8ce99a', '#40c057', '#2b8a3e']

  return {
    grid: {
      left: bool(props.withYLabels, false) ? num(props.yLabelsWidth, 60) : 0,
      right: 0,
      top:
        props.xLabelsPosition === 'top' && bool(props.withXLabels, false)
          ? num(props.xLabelsHeight, 60)
          : 0,
      bottom:
        props.xLabelsPosition !== 'top' && bool(props.withXLabels, false)
          ? num(props.xLabelsHeight, 60)
          : bool(props.withLegend, false)
            ? 30
            : 0,
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      position: props.xLabelsPosition === 'top' ? 'top' : 'bottom',
      show: bool(props.withXLabels, false),
      axisLabel: { rotate: num(props.xLabelsRotation, -90), fontSize: num(props.fontSize, 12) },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      inverse: true,
      show: bool(props.withYLabels, false),
      axisLabel: { fontSize: num(props.fontSize, 12) },
    },
    visualMap: {
      show: bool(props.withLegend, false),
      min: domain[0],
      max: domain[1],
      inRange: { color: colors },
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      text: (props.legendLabels as string[] | undefined) ?? ['More', 'Less'],
    },
    tooltip: {
      show: bool(props.withTooltip, false) && typeof props.getTooltipLabel === 'function',
      formatter: (params: any) => {
        const cell = data[params.dataIndex]
        return String(
          (props.getTooltipLabel as ((input: typeof cell) => unknown) | undefined)?.(cell) ?? '',
        )
      },
      ...obj(props.tooltipProps),
    },
    series: [
      {
        type: 'heatmap',
        data: data.map((cell) => {
          const extra =
            typeof props.getCellProps === 'function'
              ? (props.getCellProps as (input: typeof cell) => Record<string, unknown>)(cell)
              : {}
          const empty = cell.value === null || !Number.isFinite(cell.value)
          return {
            value: [xLabels.indexOf(cell.x), yLabels.indexOf(cell.y), cell.value, cell],
            ...extra,
            itemStyle: {
              ...(empty && props.emptyColor
                ? { color: resolveColor(props.emptyColor as string) }
                : {}),
              ...obj(extra.itemStyle),
            },
          }
        }),
        itemStyle: {
          borderWidth: num(props.gap, 1),
          borderColor: 'transparent',
          borderRadius: num(props.cellRadius, 2),
        },
      },
    ] as unknown as SeriesOption[],
  }
}

export function candlestickOption(props: Props): EChartsOption {
  const data = list<Record<string, unknown>>(props.data)
  const keys = {
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    ...obj(props.dataKeys),
  } as Record<string, string>
  const dataKey = String(props.dataKey ?? 'date')

  return {
    grid: {
      left: 48,
      right: 16,
      top: 16,
      bottom: 38,
      containLabel: true,
      ...obj(props.gridProps),
    },
    tooltip: { trigger: 'axis', show: bool(props.withTooltip, true), ...obj(props.tooltipProps) },
    xAxis: {
      type: 'category',
      data: data.map((item) => String(item[dataKey] ?? '')),
      show: bool(props.withXAxis, true),
      name: props.xAxisLabel as string,
      ...obj(props.xAxisProps),
    },
    yAxis: {
      type: 'value',
      scale: true,
      show: bool(props.withYAxis, true),
      name: props.yAxisLabel as string,
      ...obj(props.yAxisProps),
    },
    series: [
      {
        type: 'candlestick',
        data: data.map((item) => [
          item[keys.open],
          item[keys.close],
          item[keys.low],
          item[keys.high],
        ]),
        barMaxWidth: props.maxCandleWidth as number,
        itemStyle: {
          color: resolveColor(props.upColor, '#12b886'),
          color0: resolveColor(props.downColor, '#fa5252'),
          borderColor: resolveColor(props.upColor, '#12b886'),
          borderColor0: resolveColor(props.downColor, '#fa5252'),
          borderWidth: num(props.candleStrokeWidth, 1),
        },
        markLine: markLine(props.referenceLines as ChartReferenceLineProps[] | undefined),
        markArea: markArea(props.referenceAreas as ChartReferenceAreaProps[] | undefined),
        markPoint: markPoint(props.referenceDots as ChartReferenceDotProps[] | undefined),
      },
    ] as unknown as SeriesOption[],
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
