import { computed, defineComponent, h, ref, type Component, type PropType } from 'vue'
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'
import { registerECharts } from './echarts'

registerECharts()

export type OptionBuilder = (props: Record<string, unknown>) => EChartsOption

export function createChartComponent(name: string, buildOption: OptionBuilder): Component {
  return defineComponent({
    name: `Mantine${name}`,
    inheritAttrs: false,
    props: {
      option: Object as PropType<EChartsOption>,
      height: { type: [Number, String], default: 300 },
      width: { type: [Number, String], default: '100%' },
      loading: Boolean,
      autoresize: { type: Boolean, default: true },
      renderer: { type: String as PropType<'canvas' | 'svg'>, default: 'canvas' },
      initOptions: Object as PropType<Record<string, unknown>>,
    },
    emits: ['click', 'dblclick', 'mouseover', 'mouseout', 'legendselectchanged', 'datazoom'],
    setup(props, { attrs, emit, expose }) {
      const chart = ref<InstanceType<typeof VChart>>()
      const option = computed(() => ({ ...buildOption(attrs), ...props.option }))
      expose({
        getEchartsInstance: () => chart.value?.chart,
        resize: () => chart.value?.resize(),
        setOption: (next: EChartsOption) => chart.value?.setOption(next),
      })
      const size = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)
      const rootAttributes = computed(() =>
        Object.fromEntries(
          Object.entries(attrs).filter(
            ([key]) =>
              ['id', 'dir', 'role', 'tabindex', 'title'].includes(key) ||
              key.startsWith('aria-') ||
              (key.startsWith('data-') && key !== 'data'),
          ),
        ),
      )
      return () =>
        h(
          'div',
          {
            ...rootAttributes.value,
            class: ['mantine-Chart-root', `mantine-${name}-root`, attrs.class],
            style: [{ width: size(props.width), height: size(props.height) }, attrs.style],
          },
          [
            h(VChart, {
              ref: chart,
              option: option.value,
              autoresize: props.autoresize,
              loading: props.loading,
              initOptions: { ...props.initOptions, renderer: props.renderer },
              class: 'mantine-Chart-container',
              onClick: (event: unknown) => emit('click', event),
              onDblclick: (event: unknown) => emit('dblclick', event),
              onMouseover: (event: unknown) => emit('mouseover', event),
              onMouseout: (event: unknown) => emit('mouseout', event),
              onLegendselectchanged: (event: unknown) => emit('legendselectchanged', event),
              onDatazoom: (event: unknown) => emit('datazoom', event),
            }),
          ],
        )
    },
  })
}
