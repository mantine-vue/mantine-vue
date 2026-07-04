import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, RingProgress } from '../../index'

function withProvider(props: Record<string, any>, slots?: Record<string, any>) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(RingProgress, props, slots)),
  })
}

describe('@mantine-vue/core RingProgress', () => {
  it('renders label and svg geometry', () => {
    const wrapper = withProvider({
      size: 100,
      thickness: 10,
      label: 'Progress label',
      sections: [{ value: 20, color: 'orange' }],
    })

    expect(wrapper.find('.mantine-RingProgress-label').text()).toBe('Progress label')
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 100 100')
    expect(wrapper.find('.mantine-RingProgress-root').attributes('style')).toContain(
      '--rp-size: 6.25rem',
    )
  })

  it('clamps thickness to size / 4', () => {
    const wrapper = withProvider({
      sections: [{ value: 50, color: 'blue' }],
      size: 100,
      thickness: 50,
    })

    wrapper.findAll('circle').forEach((circle) => {
      expect(Number(circle.attributes('stroke-width'))).toBeLessThanOrEqual(25)
    })
  })

  it('handles sections summing to more than 100', () => {
    const wrapper = withProvider({
      sections: [
        { value: 60, color: 'blue' },
        { value: 60, color: 'red' },
      ],
    })

    expect(wrapper.findAll('circle')).toHaveLength(3)
  })

  it('forwards section event handlers', async () => {
    const onClick = vi.fn()
    const wrapper = withProvider({
      sections: [{ value: 50, color: 'blue', onClick }],
    })

    await wrapper.findAll('circle')[1].trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies round caps to edge curves', () => {
    const wrapper = withProvider({
      sections: [
        { value: 40, color: 'blue' },
        { value: 30, color: 'red' },
      ],
      roundCaps: true,
    })

    const roundCaps = wrapper
      .findAll('circle')
      .filter((circle) => circle.attributes('stroke-linecap') === 'round')

    expect(roundCaps.length).toBeGreaterThan(0)
  })

  it('applies transition duration, start angle, and section gaps', () => {
    const wrapper = withProvider({
      sections: [{ value: 50, color: 'blue' }],
      transitionDuration: 150,
      startAngle: 180,
      sectionGap: 36,
    })

    const root = wrapper.find('.mantine-RingProgress-root')
    const svg = wrapper.find('.mantine-RingProgress-svg')
    const section = wrapper.findAll('circle')[1]

    expect(root.attributes('style')).toContain('--rp-transition-duration: 150ms')
    expect(svg.attributes('style')).toContain('--rp-start-angle: 180deg')
    expect(section.attributes('stroke-dasharray')).toContain('40')
  })
})
