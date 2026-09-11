import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { MantineProvider } from '@mantine-vue/core'
import { QRCode, useQRCodeDownload } from '../index'

function renderQRCode(props: Record<string, unknown> = {}) {
  return mount(MantineProvider, {
    props: { env: 'test' },
    slots: {
      default: () => h(QRCode, { value: 'https://mantine-vue.dev', ...props }),
    },
  })
}

describe('@mantine-vue/qr-code', () => {
  it('renders an accessible SVG with QR data and three finder patterns', () => {
    const wrapper = renderQRCode()
    const svg = wrapper.get('svg')

    expect(svg.attributes('viewBox')).toBeTruthy()
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('QR Code: https://mantine-vue.dev')
    expect(svg.find('rect').exists()).toBe(true)
    expect(svg.findAll('path').length).toBeGreaterThan(0)
    expect(svg.findAll('g')).toHaveLength(3)
  })

  it('renders an empty SVG for an empty or unencodable value', () => {
    const wrapper = renderQRCode({ value: '' })
    expect(wrapper.get('svg').attributes('viewBox')).toBeUndefined()

    const oversized = renderQRCode({ value: 'a'.repeat(10000) })
    expect(oversized.get('svg').attributes('viewBox')).toBeUndefined()
  })

  it.each(['square', 'rounded', 'dots'] as const)(
    'renders the %s dot and corner styles',
    (style) => {
      const wrapper = renderQRCode({ dotStyle: style, cornerStyle: style })
      expect(wrapper.get('path').attributes('d')).toBeTruthy()
      expect(wrapper.get('g').exists()).toBe(true)
    },
  )

  it.each(['L', 'M', 'Q', 'H'] as const)('supports %s error correction', (level) => {
    const wrapper = renderQRCode({ errorCorrectionLevel: level })
    expect(wrapper.get('svg').attributes('viewBox')).toBeTruthy()
  })

  it('renders and configures a center image', () => {
    const wrapper = renderQRCode({
      image: 'logo.png',
      imageSize: 0.3,
      imageRadius: 'md',
      errorCorrectionLevel: 'H',
    })
    const image = wrapper.get('image')

    expect(image.attributes('href')).toBe('logo.png')
    expect(image.attributes('preserveAspectRatio')).toBe('xMidYMid slice')
    expect(image.attributes('clip-path')).toContain('var(--mantine-radius-md)')
  })

  it('supports Styles API, polymorphic roots, attrs, and root refs', () => {
    const rootRef = vi.fn()
    const wrapper = renderQRCode({
      component: 'section',
      rootRef,
      classNames: { svg: 'custom-svg' },
      'data-testid': 'qr-root',
    })

    expect(wrapper.get('[data-testid="qr-root"]').element.tagName).toBe('SECTION')
    expect(wrapper.get('svg').classes()).toContain('custom-svg')
    expect(rootRef).toHaveBeenCalledWith(expect.any(HTMLElement))
  })

  it('updates output reactively when props change', async () => {
    const currentValue = ref('https://mantine-vue.dev')
    const dotStyle = ref<'square' | 'dots'>('square')
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () => h(QRCode, { value: currentValue.value, dotStyle: dotStyle.value }),
      },
    })
    const initialPath = wrapper.get('path').attributes('d')
    currentValue.value = 'new value'
    dotStyle.value = 'dots'
    await nextTick()
    expect(wrapper.get('path').attributes('d')).not.toBe(initialPath)
    expect(wrapper.get('svg').attributes('aria-label')).toBe('QR Code: new value')
  })

  it('exposes SVG data URLs and errors before a root ref is attached', async () => {
    const detached = useQRCodeDownload({ format: 'svg' })
    await expect(detached.getDataUrl()).rejects.toThrow('QRCode SVG element not found')

    const download = useQRCodeDownload({ format: 'svg' })
    const wrapper = renderQRCode({ rootRef: download.ref })
    const dataUrl = await download.getDataUrl()
    expect(dataUrl).toMatch(/^data:image\/svg\+xml;base64,/)
    expect(atob(dataUrl.split(',')[1])).toContain('<svg')
    wrapper.unmount()
  })
})
