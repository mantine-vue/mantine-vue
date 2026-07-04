import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Pagination, PaginationControl, PaginationRoot } from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core Pagination', () => {
  it('renders pages, dots, and controls', () => {
    const wrapper = withProvider(() => h(Pagination, { total: 10, withEdges: true }))
    const buttons = wrapper.findAll('button')

    expect(wrapper.find('.mantine-Pagination-root').exists()).toBe(true)
    expect(buttons.some((button) => button.text() === '1')).toBe(true)
    expect(buttons.some((button) => button.text() === '10')).toBe(true)
    expect(wrapper.find('.mantine-Pagination-dots').exists()).toBe(true)
    expect(wrapper.findAll('[aria-label="Next page"]')).toHaveLength(1)
    expect(wrapper.findAll('[aria-label="First page"]')).toHaveLength(1)
  })

  it('changes uncontrolled page when item is clicked', async () => {
    const onChange = vi.fn()
    const wrapper = withProvider(() => h(Pagination, { total: 10, onChange }))
    const pageFour = wrapper.findAll('button').find((button) => button.text() === '4')!

    await pageFour.trigger('click')
    await nextTick()

    expect(onChange).toHaveBeenCalledWith(4)
    const active = wrapper.find('[aria-current="page"]')
    expect(active.text()).toBe('4')
    expect(active.attributes('data-active')).toBe('true')
  })

  it('supports controlled value and getItemProps', () => {
    const wrapper = withProvider(() =>
      h(Pagination, {
        total: 5,
        value: 3,
        getItemProps: (page: number) => ({ 'data-page': page, children: `Page ${page}` }),
      }),
    )

    const active = wrapper.find('[data-active]')
    expect(active.text()).toBe('Page 3')
    expect(active.attributes('data-page')).toBe('3')
  })

  it('does not render when total is not positive or hideWithOnePage is enabled', () => {
    expect(
      withProvider(() => h(Pagination, { total: 0 }))
        .find('.mantine-Pagination-root')
        .exists(),
    ).toBe(false)
    expect(
      withProvider(() => h(Pagination, { total: 1, hideWithOnePage: true }))
        .find('.mantine-Pagination-root')
        .exists(),
    ).toBe(false)
  })

  it('exposes compound root and control components', () => {
    const wrapper = withProvider(() =>
      h(PaginationRoot, { total: 3 }, () => h(PaginationControl, { active: true }, () => 'Custom')),
    )

    expect(wrapper.find('button').text()).toBe('Custom')
    expect(wrapper.find('button').attributes('data-active')).toBe('true')
  })
})
