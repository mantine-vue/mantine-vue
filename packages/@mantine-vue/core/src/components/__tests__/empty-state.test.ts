import { describe, expect, it } from 'vitest'
import { Fragment, h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIndicator,
  EmptyStateTitle,
  MantineProvider,
} from '../../index'

function render(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(EmptyState, props, children)),
  })
}

describe('@mantine-vue/core EmptyState', () => {
  it('exposes sub-components as static properties', () => {
    expect(EmptyState.Indicator).toBe(EmptyStateIndicator)
    expect(EmptyState.Title).toBe(EmptyStateTitle)
    expect(EmptyState.Description).toBe(EmptyStateDescription)
    expect(EmptyState.Actions).toBe(EmptyStateActions)
  })

  it('renders content from shorthand props', () => {
    const wrapper = render({
      icon: h('svg', { 'data-testid': 'icon' }),
      title: 'No results found',
      description: 'Try adjusting your filters.',
    })

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('No results found')
    expect(wrapper.text()).toContain('Try adjusting your filters.')
  })

  it('does not render shorthand parts when corresponding prop is not set', () => {
    const wrapper = render({ title: 'Only title' })
    expect(wrapper.find('.mantine-EmptyState-indicator').exists()).toBe(false)
    expect(wrapper.find('.mantine-EmptyState-description').exists()).toBe(false)
    expect(wrapper.text()).toContain('Only title')
  })

  it('renders shorthand content before children', () => {
    const wrapper = render({ title: 'Shorthand title' }, () =>
      h(EmptyStateTitle, null, () => 'Compound title'),
    )
    const titles = wrapper.findAll('.mantine-EmptyState-title')
    expect(titles).toHaveLength(2)
    expect(titles[0].text()).toBe('Shorthand title')
    expect(titles[1].text()).toBe('Compound title')
  })

  it('renders title as a div by default', () => {
    const wrapper = render({ title: 'Title' })
    expect(wrapper.find('.mantine-EmptyState-title').element.tagName).toBe('DIV')
  })

  it('renders title as a heading when order is set', () => {
    const wrapper = render({}, () => h(EmptyStateTitle, { order: 2 }, () => 'Heading title'))
    const heading = wrapper.find('h2')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('Heading title')
  })

  it('sets data-with-background on indicator when withIndicatorBackground is set', () => {
    const wrapper = render({ withIndicatorBackground: true, icon: h('svg') })
    expect(
      wrapper.find('.mantine-EmptyState-indicator').attributes('data-with-background'),
    ).toBeDefined()

    const plain = render({ icon: h('svg') })
    expect(
      plain.find('.mantine-EmptyState-indicator').attributes('data-with-background'),
    ).toBeUndefined()
  })

  it('sets data-align attribute on root', () => {
    expect(
      render({ title: 'Title' }).find('.mantine-EmptyState-root').attributes('data-align'),
    ).toBe('center')
    expect(
      render({ title: 'Title', align: 'left' })
        .find('.mantine-EmptyState-root')
        .attributes('data-align'),
    ).toBe('left')
    expect(
      render({ title: 'Title', align: 'right' })
        .find('.mantine-EmptyState-root')
        .attributes('data-align'),
    ).toBe('right')
  })

  it('extracts the indicator from children wrapped in a fragment', () => {
    const wrapper = render({}, () =>
      h(Fragment, null, [
        h(EmptyStateIndicator, null, () => h('svg', { 'data-testid': 'icon' })),
        h(EmptyStateTitle, null, () => 'Title'),
      ]),
    )
    const indicator = wrapper.find('.mantine-EmptyState-indicator')
    const body = wrapper.find('.mantine-EmptyState-body')
    expect(indicator.exists()).toBe(true)
    expect(body.element.contains(indicator.element)).toBe(false)
    expect(body.find('.mantine-EmptyState-title').exists()).toBe(true)
  })

  it('does not render the body element when there is no body content', () => {
    expect(
      render({ icon: h('svg') })
        .find('.mantine-EmptyState-body')
        .exists(),
    ).toBe(false)
    expect(
      render({ icon: h('svg'), title: 'Title' })
        .find('.mantine-EmptyState-body')
        .exists(),
    ).toBe(true)
  })

  it('sets data-variant on root and forces indicator background when variant is set', () => {
    const wrapper = render({ variant: 'filled', color: 'red', icon: h('svg') })
    expect(wrapper.find('.mantine-EmptyState-root').attributes('data-variant')).toBe('filled')
    expect(
      wrapper.find('.mantine-EmptyState-indicator').attributes('data-with-background'),
    ).toBeDefined()
  })

  it('renders actions content', () => {
    const wrapper = render({}, () =>
      h(EmptyStateActions, null, () => h('button', { type: 'button' }, 'Reset')),
    )
    expect(wrapper.find('.mantine-EmptyState-actions').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Reset')
  })
})
