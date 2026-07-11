import type { ChartSeries } from '../../types'
export function getSeriesLabels(series: ChartSeries[] | undefined): Record<string, string> {
  return Object.fromEntries((series ?? []).map((item) => [item.name, item.label ?? item.name]))
}
