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
    expect(col.attributes('style')).toContain(
      '--col-flex-basis: calc(50% - 0.5 * var(--grid-column-gap))',
    )
    expect(col.attributes('style')).toContain(
      '--col-offset: calc(25% + 0.25 * var(--grid-column-gap))',
    )
  })

  it('does not render component-specific inline styles for scalar columns', () => {
    const wrapper = withProvider({}, () =>
      Array.from({ length: 100 }, (_, index) => h(GridCol, { key: index, span: 6 })),
    )
    const styles = wrapper.findAll('style[data-mantine-inline-styles="true"]')

    expect(styles).toHaveLength(1)
    expect(styles[0].text()).not.toContain('--col-flex-basis')
    expect(wrapper.find('.mantine-Grid-col').attributes('style')).toContain(
      '--col-flex-basis: calc(50% - 0.5 * var(--grid-column-gap))',
    )
  })

  it('renders responsive column media styles only when a breakpoint value is present', () => {
    const baseOnly = withProvider({}, () => h(GridCol, { span: { base: 6 } }))
    expect(baseOnly.findAll('style[data-mantine-inline-styles="true"]')).toHaveLength(1)

    const responsive = withProvider({}, () =>
      h(GridCol, { span: { base: 12, sm: 6 }, order: { md: 2 } }),
    )
    const styles = responsive
      .findAll('style[data-mantine-inline-styles="true"]')
      .map((item) => item.text())
      .join('\n')

    expect(responsive.findAll('style[data-mantine-inline-styles="true"]')).toHaveLength(2)
    expect(styles).toContain('@media (min-width: 48em)')
    expect(styles).toContain('--col-flex-basis: calc(50% - 0.5 * var(--grid-column-gap))')
    expect(styles).toContain('@media (min-width: 62em)')
    expect(styles).toContain('--col-order: 2')
  })

  it('keeps Styles API and native style overrides above generated base variables', () => {
    const fromStylesApi = withProvider({ styles: { col: { '--col-flex-basis': '40%' } } }, () =>
      h(GridCol, { span: 6 }),
    )
    expect(fromStylesApi.find('.mantine-Grid-col').attributes('style')).toContain(
      '--col-flex-basis: 40%',
    )

    const fromNativeStyle = withProvider({ styles: { col: { '--col-flex-basis': '40%' } } }, () =>
      h(GridCol, { span: 6, style: { '--col-flex-basis': '30%' } }),
    )
    expect(fromNativeStyle.find('.mantine-Grid-col').attributes('style')).toContain(
      '--col-flex-basis: 30%',
    )
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
