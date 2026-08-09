/**
 * Uses a shared hidden <textarea> to measure row height and calculate
 * the height that fits the content within minRows / maxRows bounds.
 */

const SIZING_STYLE_KEYS = [
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'boxSizing',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'tabSize',
  'textIndent',
  'textRendering',
  'textTransform',
  'width',
  'wordBreak',
  'wordSpacing',
  'scrollbarGutter',
] as const

type SizingStyleKey = (typeof SIZING_STYLE_KEYS)[number]

interface SizingData {
  sizingStyle: Pick<CSSStyleDeclaration, Extract<SizingStyleKey, keyof CSSStyleDeclaration>>
  paddingSize: number
  borderSize: number
}

const HIDDEN_TEXTAREA_STYLE: Record<string, string> = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0',
  display: 'block',
}

function forceHiddenStyles(node: HTMLElement) {
  for (const key of Object.keys(HIDDEN_TEXTAREA_STYLE)) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], 'important')
  }
}

function getSizingData(node: HTMLElement): SizingData | null {
  const style = window.getComputedStyle(node)
  if (style === null) return null

  const sizingStyle = {} as SizingData['sizingStyle']
  for (const key of SIZING_STYLE_KEYS) {
    ;(sizingStyle as any)[key] = style[key as keyof CSSStyleDeclaration]
  }

  if ((sizingStyle as any).boxSizing === '') return null

  const paddingSize = parseFloat(sizingStyle.paddingBottom!) + parseFloat(sizingStyle.paddingTop!)
  const borderSize =
    parseFloat(sizingStyle.borderBottomWidth!) + parseFloat(sizingStyle.borderTopWidth!)

  return { sizingStyle, paddingSize, borderSize }
}

let hiddenTextarea: HTMLTextAreaElement | null = null

function calculateNodeHeight(
  sizingData: SizingData,
  value: string,
  minRows = 1,
  maxRows = Infinity,
): [number, number] {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    hiddenTextarea.setAttribute('tabindex', '-1')
    hiddenTextarea.setAttribute('aria-hidden', 'true')
    hiddenTextarea.setAttribute('aria-label', 'autosize measurement')
    forceHiddenStyles(hiddenTextarea)
  }

  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea)
  }

  const { paddingSize, borderSize, sizingStyle } = sizingData
  const { boxSizing } = sizingStyle as any

  for (const key of Object.keys(sizingStyle)) {
    ;(hiddenTextarea!.style as any)[key] = (sizingStyle as any)[key]
  }
  forceHiddenStyles(hiddenTextarea)

  // Double set to work around Firefox scrollHeight bug:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1795904
  hiddenTextarea.value = value
  let height =
    boxSizing === 'border-box'
      ? hiddenTextarea.scrollHeight + borderSize
      : hiddenTextarea.scrollHeight - paddingSize

  hiddenTextarea.value = value
  height =
    boxSizing === 'border-box'
      ? hiddenTextarea.scrollHeight + borderSize
      : hiddenTextarea.scrollHeight - paddingSize

  // Measure a single row for min/max clamping
  hiddenTextarea.value = 'x'
  const rowHeight = hiddenTextarea.scrollHeight - paddingSize

  let minHeight = rowHeight * minRows
  if (boxSizing === 'border-box') minHeight = minHeight + paddingSize + borderSize
  height = Math.max(minHeight, height)

  let maxHeight = rowHeight * maxRows
  if (boxSizing === 'border-box') maxHeight = maxHeight + paddingSize + borderSize
  height = Math.min(maxHeight, height)

  return [height, rowHeight]
}

export {
  HIDDEN_TEXTAREA_STYLE,
  SIZING_STYLE_KEYS,
  calculateNodeHeight,
  forceHiddenStyles,
  getSizingData,
}
export type { SizingData }
