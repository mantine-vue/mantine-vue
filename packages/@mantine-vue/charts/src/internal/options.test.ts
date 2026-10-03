// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { candlestickOption, cartesianOption, scatterOption } from './options'

const grid = (option: ReturnType<typeof cartesianOption>) =>
  option.grid as Record<string, unknown>

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
