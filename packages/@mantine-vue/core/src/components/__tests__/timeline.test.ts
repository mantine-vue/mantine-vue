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

  describe('item child order', () => {
    function itemChildren(timelineProps: Record<string, any>, itemProps: Record<string, any> = {}) {
      const wrapper = mount({
        render: () =>
          h(MantineProvider, { env: 'test' }, () =>
            h(Timeline, timelineProps, () => [
              h(TimelineItem, { bullet: 'B', opposite: 'OPP', ...itemProps }, () => 'BODY'),
            ]),
          ),
      })

      const item = wrapper.find('.mantine-Timeline-item').element
      return Array.from(item.children).map((child) => (child.textContent || '').trim())
    }

    it('places opposite before the bullet for align="left" without alternate', () => {
      expect(itemChildren({ align: 'left' })).toEqual(['OPP', 'B', 'BODY'])
    })

    it('places body before the bullet for align="left" with alternate', () => {
      expect(itemChildren({ align: 'left' }, { alternate: true })).toEqual(['BODY', 'B', 'OPP'])
    })

    it('places body before the bullet for align="right" without alternate', () => {
      expect(itemChildren({ align: 'right' })).toEqual(['BODY', 'B', 'OPP'])
    })

    it('places opposite before the bullet for align="right" with alternate', () => {
      expect(itemChildren({ align: 'right' }, { alternate: true })).toEqual(['OPP', 'B', 'BODY'])
    })
  })
})
