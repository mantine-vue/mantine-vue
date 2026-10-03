import { createApp, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createChartComponent, normalizeChartProps } from './component'
import { cartesianOption } from './options'

vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChartStub',
    props: ['option'],
    render: () => null,
  },
}))

describe('@mantine-vue/charts normalizeChartProps', () => {
  it.each([
    ['data-key', 'dataKey'],
    ['x-axis-key', 'xAxisKey'],
    ['with-legend', 'withLegend'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeChartProps({ [input]: 'value' })).toEqual({ [expected]: 'value' })
  })

  it('preserves camelCase props', () => {
    expect(normalizeChartProps({ dataKey: 'date' })).toEqual({ dataKey: 'date' })
  })

  it('generates the same x-axis for kebab-case and camelCase dataKey', () => {
    const props = {
      data: [{ date: '2026-10-03', value: 10 }],
      series: [{ name: 'value' }],
    }
    const kebabCase = cartesianOption(normalizeChartProps({ ...props, 'data-key': 'date' }), 'line')
    const camelCase = cartesianOption(normalizeChartProps({ ...props, dataKey: 'date' }), 'line')

    expect(kebabCase.xAxis).toEqual(camelCase.xAxis)
    expect(kebabCase.xAxis).toMatchObject({ data: ['2026-10-03'] })
  })

  it.each(['data-key', 'dataKey'])('passes %s to the option builder as dataKey', (key) => {
    const buildOption = vi.fn(() => ({}))
    const Chart = createChartComponent('TestChart', buildOption)
    const app = createApp({ render: () => h(Chart, { [key]: 'date' }) })

    app.mount(document.createElement('div'))

    expect(buildOption).toHaveBeenCalledWith(expect.objectContaining({ dataKey: 'date' }))
    app.unmount()
  })
})
