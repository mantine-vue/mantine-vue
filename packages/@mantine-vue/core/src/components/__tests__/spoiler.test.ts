import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, Spoiler } from '../../index'

function withProvider(props: Record<string, any> = {}) {
  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        h(Spoiler, { showLabel: 'Show more', hideLabel: 'Hide', maxHeight: 20, ...props }, () =>
          h('div', 'Hidden content'),
        ),
      ),
  })
}

describe('@mantine-vue/core Spoiler', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders content region with collapsed max height', () => {
    const wrapper = withProvider()
    const content = wrapper.find('.mantine-Spoiler-content')

    expect(content.attributes('role')).toBe('region')
    expect(content.attributes('style')).toContain('max-height: 1.25rem')
    expect(wrapper.text()).toContain('Hidden content')
  })

  it('shows control when measured content exceeds maxHeight and toggles state', async () => {
    let resizeCallback: ResizeObserverCallback | undefined
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(function ResizeObserverMock(this: ResizeObserver, callback: ResizeObserverCallback) {
        resizeCallback = callback
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
        }
      }),
    )

    const wrapper = withProvider()
    resizeCallback?.(
      [{ contentRect: { width: 200, height: 120 } } as ResizeObserverEntry],
      {} as ResizeObserver,
    )
    await nextTick()

    const control = wrapper.find('button')
    expect(control.exists()).toBe(true)
    expect(control.text()).toBe('Show more')

    await control.trigger('click')
    expect(wrapper.find('button').text()).toBe('Hide')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('supports controlled expanded state', () => {
    const wrapper = withProvider({ expanded: true })
    expect(wrapper.find('.mantine-Spoiler-content').attributes('style') ?? '').not.toContain(
      'max-height: 1.25rem',
    )
  })
})
