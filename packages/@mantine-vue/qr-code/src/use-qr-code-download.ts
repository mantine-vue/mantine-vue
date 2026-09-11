import { shallowRef } from 'vue'

export type QRCodeDownloadFormat = 'svg' | 'png' | 'jpeg' | 'webp'

export interface UseQRCodeDownloadOptions {
  /** Default download format. @default 'png' */
  format?: QRCodeDownloadFormat
  /** Default file name without an extension. @default 'qrcode' */
  fileName?: string
  /** Raster output scale. @default 4 */
  scale?: number
}

export interface QRCodeDownloadOptions {
  format?: QRCodeDownloadFormat
  fileName?: string
  scale?: number
}

export interface UseQRCodeDownloadReturn {
  /** Callback ref to pass to `QRCode` as `root-ref`. */
  ref: (element: Element | null) => void
  /** Downloads the current QR code. */
  download: (options?: QRCodeDownloadOptions) => Promise<void>
  /** Returns a data URL for the current QR code. */
  getDataUrl: (options?: Omit<QRCodeDownloadOptions, 'fileName'>) => Promise<string>
}

function serializeSvg(svgElement: SVGSVGElement): string {
  const clone = svgElement.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }

  const computedStyle = getComputedStyle(svgElement)
  const background = computedStyle.getPropertyValue('--qr-code-background').trim() || '#ffffff'
  const foreground = computedStyle.getPropertyValue('--qr-code-color').trim() || '#000000'
  clone.querySelector('rect')?.setAttribute('fill', background)
  clone.querySelectorAll('path').forEach((path) => {
    const fill = path.getAttribute('fill')
    if (!fill || fill === 'currentColor') {
      path.setAttribute('fill', foreground)
    }
  })

  return new XMLSerializer().serializeToString(clone)
}

function createSvgBlob(svg: string) {
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
}

async function svgToCanvas(svgElement: SVGSVGElement, scale: number) {
  const url = URL.createObjectURL(createSvgBlob(serializeSvg(svgElement)))
  const viewBox = svgElement.viewBox.baseVal
  const width = (viewBox.width || svgElement.clientWidth) * scale
  const height = (viewBox.height || svgElement.clientHeight) * scale

  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) {
        URL.revokeObjectURL(url)
        reject(new Error('Unable to create a canvas rendering context'))
        return
      }
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      context.drawImage(image, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG as image'))
    }
    image.src = url
  })
}

function mimeType(format: QRCodeDownloadFormat) {
  return format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** Provides SVG and high-resolution raster export for a `QRCode` root element. */
export function useQRCodeDownload(options: UseQRCodeDownloadOptions = {}): UseQRCodeDownloadReturn {
  const defaultFormat = options.format ?? 'png'
  const defaultFileName = options.fileName ?? 'qrcode'
  const defaultScale = options.scale ?? 4
  const element = shallowRef<Element | null>(null)
  const ref = (node: Element | null) => {
    element.value = node
  }

  const getSvgElement = () => element.value?.querySelector('svg') ?? null

  const getDataUrl: UseQRCodeDownloadReturn['getDataUrl'] = async (overrides = {}) => {
    const svgElement = getSvgElement()
    if (!svgElement) {
      throw new Error('QRCode SVG element not found')
    }

    const format = overrides.format ?? defaultFormat
    if (format === 'svg') {
      const bytes = new TextEncoder().encode(serializeSvg(svgElement))
      let binary = ''
      bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
      return `data:image/svg+xml;base64,${btoa(binary)}`
    }

    const canvas = await svgToCanvas(svgElement, overrides.scale ?? defaultScale)
    return canvas.toDataURL(mimeType(format), 1)
  }

  const download: UseQRCodeDownloadReturn['download'] = async (overrides = {}) => {
    const svgElement = getSvgElement()
    if (!svgElement) {
      throw new Error('QRCode SVG element not found')
    }

    const format = overrides.format ?? defaultFormat
    const fileName = `${overrides.fileName ?? defaultFileName}.${format}`
    if (format === 'svg') {
      triggerDownload(createSvgBlob(serializeSvg(svgElement)), fileName)
      return
    }

    const canvas = await svgToCanvas(svgElement, overrides.scale ?? defaultScale)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mimeType(format), 1),
    )
    if (blob) {
      triggerDownload(blob, fileName)
    }
  }

  return { ref, download, getDataUrl }
}
