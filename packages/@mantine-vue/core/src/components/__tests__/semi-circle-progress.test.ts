import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, SemiCircleProgress } from '../../index'

function withProvider(props: Record<string, any>) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(SemiCircleProgress, props)),
  })
}

describe('@mantine-vue/core SemiCircleProgress', () => {
  it('renders label and svg geometry', () => {
    const wrapper = withProvider({
      value: 40,
      size: 240,
      thickness: 12,
      label: 'Loading',
      labelPosition: 'center',
    })
    const svg = wrapper.find('svg')
    const label = wrapper.find('.mantine-SemiCircleProgress-label')

    expect(label.text()).toBe('Loading')
    expect(label.attributes('data-position')).toBe('center')
    expect(svg.attributes('width')).toBe('240')
    expect(svg.attributes('height')).toBe('120')
    expect(svg.attributes('viewBox')).toBe('0 0 240 120')
  })

  it('clamps value between 0 and 100', () => {
    const wrapper = withProvider({ value: 150, size: 200, thickness: 12 })
    const filled = wrapper.findAll('circle')[1]
    const circumference = Math.PI * ((200 - 2 * 12) / 2)

    expect(filled.attributes('style')).toContain(`stroke-dashoffset: ${circumference}`)
  })

  it('sets orientation and fill direction variables', () => {
    const wrapper = withProvider({
      value: 20,
      orientation: 'down',
      fillDirection: 'right-to-left',
      transitionDuration: 150,
    })
    const root = wrapper.find('.mantine-SemiCircleProgress-root')

    expect(root.attributes('style')).toContain('--scp-rotation: rotate(180deg) rotateY(180deg)')
    expect(root.attributes('style')).toContain('--scp-transition-duration: 150ms')
  })
})
