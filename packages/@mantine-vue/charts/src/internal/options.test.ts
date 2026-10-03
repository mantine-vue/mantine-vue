// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { candlestickOption, cartesianOption, radialOption, scatterOption } from './options'

const grid = (option: ReturnType<typeof cartesianOption>) => option.grid as Record<string, unknown>

describe('@mantine-vue/charts grid options', () => {
  it.each([
    ['cartesian', cartesianOption({ data: [], series: [] }, 'line')],
    ['scatter', scatterOption({ data: [], series: [] })],
    ['candlestick', candlestickOption({ data: [] })],
  ])('uses the ECharts 6 label bounds configuration for %s charts', (_name, option) => {
    expect(grid(option)).toMatchObject({
      outerBoundsMode: 'same',
      outerBoundsContain: 'axisLabel',
    })
    expect(grid(option)).not.toHaveProperty('containLabel')
  })

  it('allows gridProps to override the default label bounds configuration', () => {
    const option = cartesianOption(
      {
        data: [],
        series: [],
        gridProps: { outerBoundsMode: 'none' },
      },
      'line',
    )

    expect(grid(option).outerBoundsMode).toBe('none')
  })
})

const pieSeries = (option: ReturnType<typeof radialOption>) =>
  (option.series as Record<string, unknown>[])[0]

describe('@mantine-vue/charts radial options', () => {
  it('does not enable the legend when only labels are enabled', () => {
    const option = radialOption({ data: [], withLabels: true }, true)

    expect(option.legend).toMatchObject({ show: false })
  })

  it('configures outside labels and lines to avoid overlap', () => {
    const option = radialOption(
      { data: [], withLabels: true, withLabelsLine: true, labelsPosition: 'outside' },
      true,
    )

    expect(pieSeries(option)).toMatchObject({
      avoidLabelOverlap: true,
      label: {
        show: true,
        position: 'outside',
        bleedMargin: 5,
        edgeDistance: '8%',
      },
      labelLine: { show: true },
      labelLayout: { hideOverlap: true },
    })
  })

  it('reserves space when outside labels and the legend are enabled', () => {
    const option = radialOption(
      { data: [], withLabels: true, labelsPosition: 'outside', withLegend: true },
      true,
    )

    expect(option.legend).toMatchObject({ show: true, type: 'scroll', bottom: 8 })
    expect(pieSeries(option)).toMatchObject({
      bottom: 56,
      center: ['50%', '50%'],
      radius: ['40%', '65%'],
    })
  })

  it('maps label type, position, end angle and pieProps to ECharts options', () => {
    const option = radialOption({
      data: [],
      withLabels: true,
      labelsPosition: 'inside',
      labelsType: 'percent',
      endAngle: 270,
      pieProps: { clockwise: false },
    })

    expect(pieSeries(option)).toMatchObject({
      endAngle: 270,
      clockwise: false,
      label: { position: 'inside', formatter: '{d}%' },
    })
  })
})
