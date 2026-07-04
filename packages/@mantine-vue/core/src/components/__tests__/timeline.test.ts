import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Timeline, TimelineItem } from '../../index'

function renderTimeline(props: Record<string, any> = {}) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(Timeline, props, () => [
          h(TimelineItem, { title: 'First', bullet: '1' }, () => 'First body'),
          h(TimelineItem, { title: 'Second', bullet: '2' }, () => 'Second body'),
          h(TimelineItem, { title: 'Third', bullet: '3' }, () => 'Third body'),
        ]),
      ),
  })
}

describe('@mantine-vue/core Timeline', () => {
  it('propagates active and line active states to items', () => {
    const wrapper = renderTimeline({ active: 1 })

    expect(wrapper.findAll('.mantine-Timeline-item[data-active]')).toHaveLength(2)
    expect(wrapper.findAll('.mantine-Timeline-item[data-line-active]')).toHaveLength(1)
  })

  it('supports reverse active state', () => {
    const wrapper = renderTimeline({ active: 1, reverseActive: true })

    expect(wrapper.findAll('.mantine-Timeline-item[data-active]')).toHaveLength(2)
    expect(wrapper.findAll('.mantine-Timeline-item[data-line-active]')).toHaveLength(2)
  })

  it('renders root variables, titles, bullets, and body content', () => {
    const wrapper = renderTimeline({ align: 'right', bulletSize: 24, lineWidth: 2, radius: 'sm' })
    const root = wrapper.find('.mantine-Timeline-root')

    expect(root.attributes('data-align')).toBe('right')
    expect(root.attributes('style')).toContain('--tl-bullet-size: 1.5rem')
    expect(root.attributes('style')).toContain('--tl-line-width: 0.125rem')
    expect(root.attributes('style')).toContain('--tl-radius: var(--mantine-radius-sm)')
    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('First body')
  })

  it('exposes static Item component', () => {
    expect(Timeline.Item).toBe(TimelineItem)
  })
})
