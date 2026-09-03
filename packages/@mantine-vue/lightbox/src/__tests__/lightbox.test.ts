import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import { Lightbox } from '../Lightbox'

const slides = [
  { src: 'first.jpg', alt: 'First image', caption: 'First caption' },
  { src: 'second.jpg', alt: 'Second image' },
]

function renderLightbox(props: Record<string, unknown> = {}) {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  }
  if (!globalThis.IntersectionObserver) {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
      },
    )
  }
  if (!globalThis.ResizeObserver) {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
      },
    )
  }
  return mount(MantineProvider, {
    props: { env: 'test' },
    slots: {
      default: () =>
        h(Lightbox, {
          opened: true,
          slides,
          withinPortal: false,
          ...props,
        }),
    },
    attachTo: document.body,
  })
}

describe('@mantine-vue/lightbox', () => {
  it('renders accessible slides, captions and compound components', () => {
    const wrapper = renderLightbox()

    expect(Lightbox.Root).toBeTruthy()
    expect(Lightbox.Provider).toBeTruthy()
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('Gallery')
    expect(wrapper.get('img[alt="First image"]').attributes('loading')).toBe('eager')
    expect(wrapper.text()).toContain('First caption')
    expect(wrapper.text()).toContain('1 / 2')

    wrapper.unmount()
  })

  it('supports keyboard navigation and Vue close events', async () => {
    const onIndexChange = vi.fn()
    const onClose = vi.fn()
    const onUpdateOpened = vi.fn()
    const wrapper = renderLightbox({ onIndexChange, onClose, 'onUpdate:opened': onUpdateOpened })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await nextTick()
    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(wrapper.text()).toContain('2 / 2')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onUpdateOpened).toHaveBeenCalledWith(false)

    wrapper.unmount()
  })

  it('supports active-image click and wheel zoom without changing slides while panning', async () => {
    const onIndexChange = vi.fn()
    const wrapper = renderLightbox({ withZoom: true, onIndexChange })
    const images = wrapper.findAll('img')

    expect(images[0].attributes('data-zoom-enabled')).toBe('true')
    expect(images[1].attributes('data-zoom-enabled')).toBeUndefined()

    await images[0].trigger('click')
    expect(images[0].attributes('data-zoomed')).toBe('true')
    expect(images[0].attributes('style')).toContain('scale(2)')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await nextTick()
    expect(onIndexChange).not.toHaveBeenCalled()

    await images[0].trigger('click')
    images[0].element.dispatchEvent(
      new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }),
    )
    await nextTick()
    expect(images[0].attributes('data-zoomed')).toBe('true')

    wrapper.unmount()
  })

  it('renders image thumbnails for slides without an explicit image type and toggles the strip', async () => {
    const wrapper = renderLightbox({ withThumbnails: true })

    expect(wrapper.get('[aria-label="Go to slide 1"] img').attributes('src')).toBe('first.jpg')
    expect(wrapper.get('[aria-label="Go to slide 1"]').attributes('aria-current')).toBe('true')

    await wrapper.get('[aria-label="Hide thumbnails"]').trigger('click')
    await nextTick()
    expect(wrapper.find('[aria-label="Show thumbnails"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Show thumbnails"]').trigger('click')
    await nextTick()
    expect(wrapper.get('[aria-label="Go to slide 1"] img').attributes('src')).toBe('first.jpg')

    wrapper.unmount()
  })

  it('uses upstream-sized navigation icons and closes from empty slide space', async () => {
    const onClose = vi.fn()
    const wrapper = renderLightbox({ closeOnClickOutside: true, onClose })

    expect(wrapper.get('[aria-label="Next slide"] svg').attributes('width')).toBe('36')
    await wrapper.get('[data-lightbox-slide]').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('opens cross-origin downloads in a new tab', async () => {
    const clickedLinks: HTMLAnchorElement[] = []
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        clickedLinks.push(this.cloneNode(true) as HTMLAnchorElement)
      })
    const wrapper = renderLightbox({
      withDownload: true,
      slides: [{ src: 'https://example.com/photo.jpg', alt: 'Photo' }],
    })

    await wrapper.get('[aria-label="Download"]').trigger('click')
    expect(clickedLinks[0].target).toBe('_blank')
    expect(clickedLinks[0].rel).toBe('noopener noreferrer')

    click.mockRestore()
    wrapper.unmount()
  })
})
