import { computed, defineComponent, h, type PropType } from 'vue'
import type { ChartRenderable, ChartSeries, ChartTooltipPayload } from '../types'
import { resolveColor } from '../internal/colors'

export interface ChartTooltipProps {
  label?: ChartRenderable
  payload?: readonly ChartTooltipPayload[]
  unit?: string
  type?: 'area' | 'radial' | 'scatter'
  segmentId?: string
  series?: ChartSeries[]
  valueFormatter?: (value: number) => ChartRenderable
  showColor?: boolean
}

export const ChartTooltip = defineComponent({
  name: 'MantineChartTooltip',
  props: {
    label: null,
    payload: Array as PropType<readonly ChartTooltipPayload[]>,
    unit: String,
    type: { type: String as PropType<ChartTooltipProps['type']>, default: 'area' },
    segmentId: String,
    series: Array as PropType<ChartSeries[]>,
    valueFormatter: Function as PropType<(value: number) => ChartRenderable>,
    showColor: { type: Boolean, default: true },
  },
  setup(props) {
    const labels = computed(() =>
      Object.fromEntries((props.series ?? []).map((item) => [item.name, item.label ?? item.name])),
    )
    return () => {
      const payload = props.segmentId
        ? props.payload?.filter(
            (item) => item.name === props.segmentId || item.dataKey === props.segmentId,
          )
        : props.payload
      if (!payload?.length) return null
      return h('div', { class: 'mantine-ChartTooltip-tooltip', 'data-type': props.type }, [
        props.label != null
          ? h('div', { class: 'mantine-ChartTooltip-tooltipLabel' }, [props.label])
          : null,
        h(
          'div',
          { class: 'mantine-ChartTooltip-tooltipBody' },
          payload.map((item) =>
            h('div', { class: 'mantine-ChartTooltip-tooltipItem' }, [
              h('div', { class: 'mantine-ChartTooltip-tooltipItemBody' }, [
                props.showColor
                  ? h('span', {
                      class: 'mantine-ChartTooltip-tooltipItemColor',
                      style: { background: resolveColor(item.color) },
                    })
                  : null,
                h(
                  'span',
                  { class: 'mantine-ChartTooltip-tooltipItemName' },
                  labels.value[item.name ?? ''] ?? item.name,
                ),
              ]),
              h(
                'span',
                { class: 'mantine-ChartTooltip-tooltipItemData' },
                `${props.valueFormatter ? props.valueFormatter(Number(item.value)) : (item.value ?? '')}${props.unit ?? item.unit ?? ''}`,
              ),
            ]),
          ),
        ),
      ])
    }
  },
})
