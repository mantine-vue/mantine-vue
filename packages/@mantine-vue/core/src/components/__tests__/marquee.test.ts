import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Marquee } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Marquee, props, () => 'Item')),
  })
}

describe('@mantine-vue/core Marquee', () => {
  it('renders repeated groups', () => {
    const wrapper = withProvider({ repeat: 3 })
    const groups = wrapper.findAll('.mantine-Marquee-group')

    expect(groups).toHaveLength(3)
    expect(groups.map((group) => group.text())).toEqual(['Item', 'Item', 'Item'])
  })

  it('sets orientation and motion attributes', () => {
    const wrapper = withProvider({
      orientation: 'vertical',
      reverse: true,
      pauseOnHover: true,
      fadeEdges: false,
    })
    const root = wrapper.find('.mantine-Marquee-root')

    expect(root.attributes('data-orientation')).toBe('vertical')
    expect(root.attributes('data-reverse')).toBe('true')
    expect(root.attributes('data-pause-on-hover')).toBe('true')
    expect(root.attributes('data-fade-edges')).toBeUndefined()
  })

  it('sets animation and fade variables', () => {
    const wrapper = withProvider({
      duration: 10000,
      gap: 'xl',
      fadeEdgeColor: 'red',
      fadeEdgeSize: '10%',
    })
    const root = wrapper.find('.mantine-Marquee-root')

    expect(root.attributes('style')).toContain('--marquee-duration: 10000ms')
    expect(root.attributes('style')).toContain('--marquee-gap: var(--mantine-spacing-xl)')
    expect(root.attributes('style')).toContain('--marquee-fade-color: red')
    expect(root.attributes('style')).toContain('--marquee-fade-size: 10%')
  })
})
