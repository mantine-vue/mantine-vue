import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { LoadingOverlay, MantineProvider } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  return mount(
    {
      render: () => h(MantineProvider, { env: 'test' }, () => h(LoadingOverlay, props)),
    },
    {
      global: {
        stubs: {
          transition: false,
          Transition: false,
        },
      },
    },
  )
}

describe('@mantine-vue/core LoadingOverlay', () => {
  it('renders only when visible', () => {
    expect(withProvider({ visible: false }).find('.mantine-LoadingOverlay-root').exists()).toBe(
      false,
    )
    expect(withProvider({ visible: true }).find('.mantine-LoadingOverlay-root').exists()).toBe(true)
  })

  it('passes loader and overlay props through component boundaries', () => {
    const wrapper = withProvider({
      visible: true,
      zIndex: 500,
      loaderProps: { 'data-testid': 'test-loader', type: 'bars' },
      overlayProps: { 'data-testid': 'test-overlay', backgroundOpacity: 0.5, blur: 2 },
    })
    const root = wrapper.find('.mantine-LoadingOverlay-root')

    expect(root.attributes('style')).toContain('--lo-z-index: 500')
    expect(wrapper.find('[data-testid="test-loader"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="test-overlay"]')).toHaveLength(2)
    expect(wrapper.findAll('.mantine-LoadingOverlay-overlay')).toHaveLength(2)
  })
})
