import { expandRect, type Rect } from './geometry'

export interface DiagramSvgExportOptions {
  /** World area to export, the content bounds by default */
  bounds?: Rect
  /** Padding around the bounds in world units, `20` by default */
  padding?: number
  /** Background color, transparent by default */
  background?: string
  /** Scale of the SVG size relative to world units, `1` by default */
  scale?: number
}

export interface DiagramImageExportOptions extends DiagramSvgExportOptions {
  /** Pixels per world unit, `devicePixelRatio` by default (at least 2) */
  pixelRatio?: number
  /** `'image/png'` by default */
  type?: 'image/png' | 'image/jpeg' | 'image/webp'
  /** Quality of lossy formats, 0–1 */
  quality?: number
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/** Presentation properties copied from computed styles, so CSS variables survive the export. */
const STYLE_PROPERTIES = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-opacity',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-decoration',
  'filter',
  'visibility',
  'display',
] as const

const DEFAULT_VALUES: Partial<Record<(typeof STYLE_PROPERTIES)[number], string>> = {
  opacity: '1',
  'fill-opacity': '1',
  'stroke-opacity': '1',
  visibility: 'visible',
  display: 'inline',
}

function inlineStyles(source: Element, target: Element) {
  const view = source.ownerDocument.defaultView

  if (view && typeof view.getComputedStyle === 'function') {
    const computed = view.getComputedStyle(source)
    const declarations: string[] = []

    for (const property of STYLE_PROPERTIES) {
      const value = computed.getPropertyValue(property)

      if (!value || (value === 'none' && property !== 'fill' && property !== 'stroke')) {
        continue
      }

      // Defaults only make files bigger.
      if (DEFAULT_VALUES[property] === value) {
        continue
      }

      declarations.push(`${property}:${value}`)
    }

    if (declarations.length > 0) {
      target.setAttribute('style', declarations.join(';'))
    }
  }

  target.removeAttribute('class')

  const sourceChildren = source.children
  const targetChildren = target.children

  for (let index = 0; index < sourceChildren.length; index += 1) {
    if (targetChildren[index]) {
      inlineStyles(sourceChildren[index], targetChildren[index])
    }
  }
}

/**
 * Serializes the content group of a rendered diagram to a standalone SVG document. Computed
 * styles are inlined, so the file looks the same outside of the page, theme colors included.
 * Interaction overlays are not part of the content group and never exported.
 */
export function exportSvg(
  content: SVGGElement,
  contentBounds: Rect | null,
  options: DiagramSvgExportOptions = {},
): string {
  const padding = options.padding ?? 20
  const scale = options.scale ?? 1
  const bounds = expandRect(
    options.bounds ?? contentBounds ?? { x: 0, y: 0, width: 0, height: 0 },
    padding,
  )
  const document = content.ownerDocument
  const svg = document.createElementNS(SVG_NS, 'svg')

  svg.setAttribute('xmlns', SVG_NS)
  svg.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`)
  svg.setAttribute('width', String(Math.round(bounds.width * scale)))
  svg.setAttribute('height', String(Math.round(bounds.height * scale)))

  if (options.background) {
    const background = document.createElementNS(SVG_NS, 'rect')
    background.setAttribute('x', String(bounds.x))
    background.setAttribute('y', String(bounds.y))
    background.setAttribute('width', String(bounds.width))
    background.setAttribute('height', String(bounds.height))
    background.setAttribute('fill', options.background)
    svg.appendChild(background)
  }

  const clone = content.cloneNode(true) as SVGGElement
  inlineStyles(content, clone)
  clone.removeAttribute('transform')
  clone.querySelectorAll('[data-export-ignore]').forEach((element) => element.remove())
  // Hit areas and accessibility attributes mean nothing in a file.
  clone.querySelectorAll('.mantine-diagram-edge-hit').forEach((element) => element.remove())
  clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
  svg.appendChild(clone)

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svg)}`
}

async function inlineImages(svgText: string): Promise<string> {
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml')

  if (parsed.querySelector('parsererror')) {
    throw new Error('[@mantine-vue/diagram] The exported SVG could not be parsed')
  }

  for (const image of parsed.querySelectorAll('image')) {
    const url = image.getAttribute('href') ?? image.getAttribute('xlink:href')

    if (!url || url.startsWith('data:') || url.startsWith('#')) {
      continue
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Image request failed with status ${response.status}`)
      }

      const blob = await response.blob()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(blob)
      })
      image.setAttribute('href', dataUrl)
      image.removeAttribute('xlink:href')
    } catch {
      // A remote image that cannot be embedded would taint the canvas, so omit it.
      image.remove()
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(parsed.documentElement)}`
}

/**
 * Renders an exported SVG to a raster image. External images are embedded first because
 * images referenced by URL are not drawn when an SVG is rasterized.
 */
export async function exportImage(
  content: SVGGElement,
  contentBounds: Rect | null,
  options: DiagramImageExportOptions = {},
): Promise<Blob> {
  const pixelRatio =
    options.pixelRatio ??
    Math.max(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)
  const type = options.type ?? 'image/png'
  const svgText = await inlineImages(
    exportSvg(content, contentBounds, {
      ...options,
      scale: 1,
      background: options.background ?? (type === 'image/png' ? undefined : '#ffffff'),
    }),
  )
  const width = Number(/width="(\d+)"/.exec(svgText)?.[1] ?? 0)
  const height = Number(/height="(\d+)"/.exec(svgText)?.[1] ?? 0)
  const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () =>
        reject(new Error('[@mantine-vue/diagram] The exported SVG could not be rendered'))
      image.src = url
    })

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * pixelRatio))
    canvas.height = Math.max(1, Math.round(height * pixelRatio))
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('[@mantine-vue/diagram] Canvas 2D is not available')
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('[@mantine-vue/diagram] Image encoding failed')),
        type,
        options.quality,
      ),
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Prints the diagram on its own, scaled to the page, from a hidden frame. Resolves after the
 * print dialog was opened.
 */
export function printSvg(
  svgText: string,
  options: { title?: string; landscape?: boolean } = {},
): Promise<void> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none'

    const markup = svgText.replace(/^<\?xml[^>]*>\s*/, '')
    const title = (options.title ?? 'Diagram').replace(/</g, '&lt;')

    frame.onload = () => {
      frame.contentWindow?.focus()
      frame.contentWindow?.print()
      setTimeout(() => frame.remove(), 1000)
      resolve()
    }

    frame.srcdoc =
      `<!doctype html><html><head><title>${title}</title>` +
      `<style>@page{size:${options.landscape === false ? 'portrait' : 'landscape'};margin:12mm}` +
      'html,body{margin:0;height:100%}svg{width:100%;height:100%;display:block}</style></head>' +
      `<body>${markup}</body></html>`
    document.body.appendChild(frame)
  })
}

/** Starts a download of a blob or text in the browser. */
export function downloadFile(
  data: Blob | string,
  fileName: string,
  type = 'application/octet-stream',
) {
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
