import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, ScrollArea } from '../../index'

function withProvider(props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(ScrollArea, props, children)),
  })
}

function setViewportOverflow(
  viewport: HTMLDivElement,
  { x = false, y = false }: { x?: boolean; y?: boolean },
) {
  Object.defineProperty(viewport, 'offsetWidth', { value: 100, configurable: true })
  Object.defineProperty(viewport, 'offsetHeight', { value: 100, configurable: true })
  Object.defineProperty(viewport, 'scrollWidth', { value: x ? 200 : 100, configurable: true })
  Object.defineProperty(viewport, 'scrollHeight', { value: y ? 200 : 100, configurable: true })
}

describe('@mantine-vue/core ScrollArea', () => {
  it('sets scrollbar and thumb css variables from measured dimensions', async () => {
    const resizeCallbacks: ResizeObserverCallback[] = []
    const animationFrameCallbacks: FrameRequestCallback[] = []

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      animationFrameCallbacks.push(callback)
      return animationFrameCallbacks.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(function ResizeObserverMock(this: ResizeObserver, callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback)
        this.observe = vi.fn()
        this.unobserve = vi.fn()
        this.disconnect = vi.fn()
      }),
    )

    const wrapper = withProvider({ type: 'always', scrollbars: 'y' }, () =>
      h('div', { style: { height: '400px' } }, 'Content'),
    )
    const viewport = wrapper.find('.mantine-ScrollArea-viewport').element as HTMLDivElement
    const scrollbar = wrapper.find('.mantine-ScrollArea-scrollbar').element as HTMLDivElement

    Object.defineProperty(viewport, 'scrollHeight', { value: 400, configurable: true })
    Object.defineProperty(viewport, 'offsetHeight', { value: 100, configurable: true })
    Object.defineProperty(scrollbar, 'clientHeight', { value: 100, configurable: true })
    resizeCallbacks.forEach((callback) =>
      callback([] as unknown as ResizeObserverEntry[], {} as ResizeObserver),
    )
    animationFrameCallbacks.splice(0).forEach((callback) => callback(0))
    await nextTick()
    await nextTick()

    const thumb = wrapper.find('.mantine-ScrollArea-thumb')
    expect(wrapper.find('.mantine-ScrollArea-scrollbar').attributes('style')).toContain(
      '--sa-thumb-height: 25px',
    )
    expect(thumb.exists()).toBe(true)
    expect(thumb.attributes('style')).toContain('--thumb-opacity: 1')

    vi.unstubAllGlobals()
  })

  it('renders viewport, content, scrollbars, and children', () => {
    const wrapper = withProvider({ type: 'always', scrollbars: 'xy' }, () => h('div', 'Content'))

    expect(wrapper.find('.mantine-ScrollArea-root').exists()).toBe(true)
    expect(wrapper.find('.mantine-ScrollArea-viewport').exists()).toBe(true)
    expect(wrapper.find('.mantine-ScrollArea-content').text()).toBe('Content')
    expect(wrapper.findAll('.mantine-ScrollArea-scrollbar')).toHaveLength(2)
    expect(wrapper.find('.mantine-ScrollArea-scrollbar').attributes('style')).toContain(
      'position: absolute',
    )
    expect(wrapper.find('.mantine-ScrollArea-scrollbar').attributes('data-mantine-scrollbar')).toBe(
      'true',
    )
    expect(wrapper.find('.mantine-ScrollArea-root').attributes('style')).toContain(
      '--sa-corner-width: 0px',
    )
    expect(wrapper.find('.mantine-ScrollArea-root').attributes('style')).toContain(
      '--sa-corner-height: 0px',
    )
  })

  it('calls scroll position and boundary callbacks', async () => {
    const onScrollPositionChange = vi.fn()
    const onBottomReached = vi.fn()
    const onRightReached = vi.fn()
    const wrapper = withProvider({ onScrollPositionChange, onBottomReached, onRightReached }, () =>
      h('div', { style: { width: '500px', height: '500px' } }, 'Content'),
    )
    const viewport = wrapper.find('.mantine-ScrollArea-viewport').element as HTMLDivElement

    Object.defineProperty(viewport, 'scrollTop', { value: 400, configurable: true })
    Object.defineProperty(viewport, 'scrollLeft', { value: 400, configurable: true })
    Object.defineProperty(viewport, 'scrollHeight', { value: 500, configurable: true })
    Object.defineProperty(viewport, 'scrollWidth', { value: 500, configurable: true })
    Object.defineProperty(viewport, 'clientHeight', { value: 100, configurable: true })
    Object.defineProperty(viewport, 'clientWidth', { value: 100, configurable: true })

    await wrapper.find('.mantine-ScrollArea-viewport').trigger('scroll')

    expect(onScrollPositionChange).toHaveBeenCalledWith({ x: 400, y: 400 })
    expect(onBottomReached).toHaveBeenCalledTimes(1)
    expect(onRightReached).toHaveBeenCalledTimes(1)
  })

  it('scrolls to startScrollPosition on mount', async () => {
    const scrollTo = vi.fn()
    const original = Element.prototype.scrollTo
    Element.prototype.scrollTo = scrollTo

    withProvider({ startScrollPosition: { x: 10, y: 20 } }, () => 'Content')
    await nextTick()
    await nextTick()

    expect(scrollTo).toHaveBeenCalledWith({ left: 10, top: 20 })
    Element.prototype.scrollTo = original
  })

  it('shows scrollbars according to type prop', async () => {
    vi.useFakeTimers()

    const always = withProvider({ type: 'always', scrollbars: 'xy' }, () => 'Content')
    expect(
      always.findAll('.mantine-ScrollArea-scrollbar').map((node) => node.attributes('data-state')),
    ).toEqual(['visible', 'visible'])

    const never = withProvider({ type: 'never', scrollbars: 'xy' }, () => 'Content')
    expect(
      never
        .findAll('.mantine-ScrollArea-scrollbar')
        .every((node) => node.attributes('data-hidden') === 'true'),
    ).toBe(true)

    const auto = withProvider({ type: 'auto', scrollbars: 'xy' }, () => 'Content')
    const autoViewport = auto.find('.mantine-ScrollArea-viewport').element as HTMLDivElement
    setViewportOverflow(autoViewport, { y: true })
    await auto.find('.mantine-ScrollArea-viewport').trigger('scroll')
    expect(
      auto.findAll('.mantine-ScrollArea-scrollbar').map((node) => node.attributes('data-state')),
    ).toEqual(['hidden', 'visible'])

    const hover = withProvider({ type: 'hover', scrollbars: 'y' }, () => 'Content')
    const hoverViewport = hover.find('.mantine-ScrollArea-viewport').element as HTMLDivElement
    setViewportOverflow(hoverViewport, { y: true })
    await hover.find('.mantine-ScrollArea-viewport').trigger('scroll')
    expect(hover.find('.mantine-ScrollArea-scrollbar').attributes('data-state')).toBe('hidden')
    await hover.find('.mantine-ScrollArea-root').trigger('pointerenter')
    expect(hover.find('.mantine-ScrollArea-scrollbar').attributes('data-state')).toBe('visible')

    const scroll = withProvider({ type: 'scroll', scrollHideDelay: 100, scrollbars: 'y' }, () =>
      h('div', 'Content'),
    )
    const scrollViewport = scroll.find('.mantine-ScrollArea-viewport').element as HTMLDivElement
    setViewportOverflow(scrollViewport, { y: true })
    Object.defineProperty(scrollViewport, 'scrollTop', { value: 10, configurable: true })
    await scroll.find('.mantine-ScrollArea-viewport').trigger('scroll')
    expect(scroll.find('.mantine-ScrollArea-scrollbar').attributes('data-state')).toBe('visible')
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(scroll.find('.mantine-ScrollArea-scrollbar').attributes('data-state')).toBe('hidden')

    vi.useRealTimers()
  })

  it('exposes Autosize component', () => {
    expect(ScrollArea.Autosize).toBeTruthy()
  })
})
