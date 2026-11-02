import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'

const parseStylePropsSpy = vi.hoisted(() => vi.fn())

vi.mock('../Box/style-props', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../Box/style-props')>()
  parseStylePropsSpy.mockImplementation(actual.parseStyleProps)
  return { ...actual, parseStyleProps: parseStylePropsSpy }
})

import { Box, MantineProvider } from '../../index'

describe('@mantine-vue/core Box style parsing', () => {
  it('does not invoke the style parser when no Mantine style props are supplied', () => {
    parseStylePropsSpy.mockClear()
    mount({ render: () => h(MantineProvider, { env: 'test' }, () => h(Box, { id: 'box' })) })

    expect(parseStylePropsSpy).not.toHaveBeenCalled()
  })

  it('does not reparse unchanged style props after an unrelated update', async () => {
    parseStylePropsSpy.mockClear()
    const unrelated = ref('first')
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Box, { p: 'sm', 'data-unrelated': unrelated.value }),
        ),
    })

    expect(parseStylePropsSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-unrelated]').attributes('style')).toContain(
      'padding: var(--mantine-spacing-sm)',
    )

    unrelated.value = 'second'
    await nextTick()

    expect(parseStylePropsSpy).toHaveBeenCalledTimes(1)
  })

  it('reacts to scalar and responsive style prop changes', async () => {
    parseStylePropsSpy.mockClear()
    const padding = ref<any>('sm')
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(Box, { p: padding.value }, () => 'Box')),
    })

    expect(wrapper.find('div').attributes('style')).toContain('padding: var(--mantine-spacing-sm)')

    padding.value = 'lg'
    await nextTick()
    expect(wrapper.find('div').attributes('style')).toContain('padding: var(--mantine-spacing-lg)')

    padding.value = { base: 'xs', md: 'xl' }
    await nextTick()
    const style = wrapper.find('style[data-mantine-inline-styles="true"]').html()
    expect(style).toContain('padding: var(--mantine-spacing-xs)')
    expect(style).toContain('@media (min-width: 62em)')
    expect(style).toContain('padding: var(--mantine-spacing-xl)')
  })

  it('reacts when a previously omitted style prop is added', async () => {
    parseStylePropsSpy.mockClear()
    const styleProps = ref<Record<string, any>>({})
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () => h(Box, styleProps.value, () => 'Box')),
    })

    expect(parseStylePropsSpy).not.toHaveBeenCalled()
    styleProps.value = { m: 'md' }
    await nextTick()

    expect(parseStylePropsSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.find('div').attributes('style')).toContain('margin: var(--mantine-spacing-md)')
  })

  it('invalidates parsed styles when the theme changes', async () => {
    parseStylePropsSpy.mockClear()
    const theme = reactive<any>({ colors: { brand: ['#111111'] } })
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test', theme, withCssVariables: false }, () =>
          h(Box, { c: 'brand.0' }, () => 'Box'),
        ),
    })

    expect(wrapper.find('div').attributes('style')).toContain('color: var(--mantine-color-brand-0)')
    expect(parseStylePropsSpy).toHaveBeenCalledTimes(1)

    theme.colors.brand = ['#222222']
    await nextTick()

    expect(parseStylePropsSpy).toHaveBeenCalledTimes(2)
    expect(wrapper.find('div').attributes('style')).toContain('color: var(--mantine-color-brand-0)')
  })
})
