import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { BackgroundImage, ColorSwatch, Image, MantineProvider, Skeleton } from '../../index'

function withProvider(component: any, props: Record<string, any> = {}, children?: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, children)),
  })
}

describe('@mantine-vue/core visual primitives', () => {
  it('renders Image with radius, fit and fallback source', async () => {
    const wrapper = withProvider(Image, {
      src: 'bad.png',
      fallbackSrc: 'fallback.png',
      radius: 'md',
      fit: 'contain',
    })
    const image = wrapper.find('img.mantine-Image-root')

    expect(image.attributes('src')).toBe('bad.png')
    expect(image.attributes('style')).toContain('--image-radius: var(--mantine-radius-md)')
    expect(image.attributes('style')).toContain('--image-object-fit: contain')

    await image.trigger('error')
    await nextTick()

    expect(wrapper.find('img').attributes('src')).toBe('fallback.png')
    expect(wrapper.find('img').attributes('data-fallback')).toBe('true')
  })

  it('renders BackgroundImage with background style and radius variable', () => {
    const wrapper = withProvider(BackgroundImage, { src: '/hero.png', radius: 'lg' }, () => 'Hero')
    const node = wrapper.find('.mantine-BackgroundImage-root')

    expect(node.text()).toBe('Hero')
    expect(node.attributes('style')).toContain('--bi-radius: var(--mantine-radius-lg)')
    expect(node.attributes('style')).toContain('background-image: url("/hero.png")')
  })

  it('renders Skeleton modifiers and dimensions', () => {
    const wrapper = withProvider(Skeleton, {
      height: 24,
      width: '50%',
      visible: true,
      animate: true,
      radius: 'sm',
    })
    const node = wrapper.find('.mantine-Skeleton-root')

    expect(node.attributes('data-visible')).toBe('true')
    expect(node.attributes('data-animate')).toBe('true')
    expect(node.attributes('style')).toContain('--skeleton-height: 1.5rem')
    expect(node.attributes('style')).toContain('--skeleton-width: 50%')
    expect(node.attributes('style')).toContain('--skeleton-radius: var(--mantine-radius-sm)')
  })

  it('renders ColorSwatch overlays and variables', () => {
    const wrapper = withProvider(ColorSwatch, { color: 'rgba(0, 0, 0, 0.5)', size: 32 }, () =>
      h('span', { id: 'check' }, 'ok'),
    )
    const node = wrapper.find('.mantine-ColorSwatch-root')

    expect(node.attributes('style')).toContain('--cs-size: 2rem')
    expect(wrapper.findAll('span').length).toBe(5)
    expect(wrapper.find('#check').text()).toBe('ok')
  })
})
