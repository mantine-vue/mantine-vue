import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { Grid, GridCol, MantineProvider } from '../../index'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(Grid, props, children)),
  })
}

describe('@mantine-vue/core Grid', () => {
  it('renders grid variables and column variables', () => {
    const wrapper = withProvider(
      {
        justify: 'center',
        align: 'flex-end',
        overflow: 'hidden',
        gap: { base: 'sm', md: 'lg' },
        columns: 12,
      },
      () => h(GridCol, { span: 6, offset: 3, order: 2, align: 'center' }, () => 'Column'),
    )
    const root = wrapper.find('.mantine-Grid-root')
    const col = wrapper.find('.mantine-Grid-col')
    const styles = wrapper
      .findAll('style[data-mantine-inline-styles="true"]')
      .map((item) => item.html())
      .join('\n')

    expect(root.attributes('style')).toContain('--grid-justify: center')
    expect(root.attributes('style')).toContain('--grid-align: flex-end')
    expect(root.attributes('style')).toContain('--grid-overflow: hidden')
    expect(col.text()).toBe('Column')
    expect(styles).toContain('--grid-gap: var(--mantine-spacing-sm)')
    expect(styles).toContain('@media (min-width: 62em)')
    expect(styles).toContain('--grid-gap: var(--mantine-spacing-lg)')
    expect(styles).toContain('--col-flex-basis: calc(50% - 0.5 * var(--grid-column-gap))')
    expect(styles).toContain('--col-offset: calc(25% + 0.25 * var(--grid-column-gap))')
  })

  it('renders container wrapper only with container type and breakpoints', () => {
    const noBreakpoints = withProvider({ type: 'container' }, () => h(GridCol, null, () => 'A'))
    expect(noBreakpoints.find('.mantine-Grid-container').exists()).toBe(false)

    const wrapper = withProvider(
      {
        type: 'container',
        breakpoints: { xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' },
      },
      () => h(GridCol, { span: { base: 12, sm: 6 } }, () => 'A'),
    )
    const styles = wrapper
      .findAll('style[data-mantine-inline-styles="true"]')
      .map((item) => item.html())
      .join('\n')

    expect(wrapper.find('.mantine-Grid-container').exists()).toBe(true)
    expect(styles).toContain('@container mantine-grid (min-width: 200px)')
    expect(styles).toContain('--col-flex-basis: calc(50% - 0.5 * var(--grid-column-gap))')
  })

  it('exposes static Col component', () => {
    expect(Grid.Col).toBe(GridCol)
  })
})
