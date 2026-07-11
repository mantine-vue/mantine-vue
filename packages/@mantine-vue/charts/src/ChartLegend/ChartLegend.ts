import { defineComponent, h, type PropType } from 'vue'
import type { ChartSeries } from '../types'
import { resolveColor } from '../internal/colors'

export interface ChartLegendPayload {
  dataKey?: string
  name?: string
  color?: string
  [key: string]: unknown
}
export interface ChartLegendProps {
  payload?: readonly ChartLegendPayload[]
  onHighlight: (area: string | null) => void
  legendPosition: 'top' | 'bottom' | 'middle'
  series?: ChartSeries[]
  showColor?: boolean
  centered?: boolean
}

export const ChartLegend = defineComponent({
  name: 'MantineChartLegend',
  props: {
    payload: Array as PropType<readonly ChartLegendPayload[]>,
    onHighlight: { type: Function as PropType<(area: string | null) => void>, required: true },
    legendPosition: {
      type: String as PropType<ChartLegendProps['legendPosition']>,
      required: true,
    },
    series: Array as PropType<ChartSeries[]>,
    showColor: { type: Boolean, default: true },
    centered: Boolean,
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: 'mantine-ChartLegend-legend',
          'data-position': props.legendPosition,
          'data-centered': props.centered || undefined,
          onMouseleave: () => props.onHighlight(null),
        },
        props.payload?.map((item) => {
          const key = item.dataKey ?? item.name ?? ''
          const label = props.series?.find((s) => s.name === key)?.label ?? key
          return h(
            'div',
            { class: 'mantine-ChartLegend-legendItem', onMouseenter: () => props.onHighlight(key) },
            [
              props.showColor
                ? h('span', {
                    class: 'mantine-ChartLegend-legendItemColor',
                    style: { background: resolveColor(item.color) },
                  })
                : null,
              h('span', { class: 'mantine-ChartLegend-legendItemName' }, label),
            ],
          )
        }),
      )
  },
})
