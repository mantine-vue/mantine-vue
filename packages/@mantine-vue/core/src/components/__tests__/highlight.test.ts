import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Highlight, MantineProvider, highlighter } from '../../index'

function withProvider(props: Record<string, any>, text: string) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Highlight, props, () => text)),
  })
}

describe('@mantine-vue/core Highlight', () => {
  it('highlights correct value', () => {
    const wrapper = withProvider({ highlight: 'he' }, 'Hello')
    expect(wrapper.find('mark').text()).toBe('He')
    expect(wrapper.find('mark').attributes('data-highlight')).toBe('He')
  })

  it('supports per-term colors and whole word matching', () => {
    const wrapper = withProvider(
      {
        highlight: [
          { text: 'error', color: 'red' },
          { text: 'warning', color: 'yellow' },
        ],
        wholeWord: true,
      },
      'error warning errored',
    )
    const marks = wrapper.findAll('mark')

    expect(marks.map((mark) => mark.text())).toEqual(['error', 'warning'])
    expect(marks[0].attributes('style')).toContain('--mark-bg-light: var(--mantine-color-red-2)')
  })

  it('exports highlighter utility with accent-insensitive matching', () => {
    expect(highlighter('cafe cafe', 'cafe')).toEqual([
      { chunk: 'cafe', highlighted: true },
      { chunk: ' ', highlighted: false },
      { chunk: 'cafe', highlighted: true },
    ])
  })
})
