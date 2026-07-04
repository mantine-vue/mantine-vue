/**
 * Uses a shared hidden <textarea> to measure row height and calculate
 * the height that fits the content within minRows / maxRows bounds.
 */
import { defineComponent, h, onMounted, onUnmounted, ref, watch, type PropType } from 'vue'

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

export const TextareaAutosize = defineComponent({
  name: 'TextareaAutosize',
  // inheritAttrs: false so we can intercept onInput and filter maxRows/minRows
  inheritAttrs: false,
  props: {
    // Consumed here; NOT forwarded to <textarea> (not valid HTML attrs)
    maxRows: { type: Number as PropType<number | undefined>, default: undefined },
    minRows: { type: Number as PropType<number | undefined>, default: undefined },
    // Declaring value as a prop lets us watch it for controlled-mode resizing
    value: { type: [String, Number] as PropType<string | number | undefined>, default: undefined },
  },
  setup(props, { attrs }) {
    const textareaRef = ref<HTMLTextAreaElement | null>(null)
    const heightRef = ref(0)
    const widthRef = ref(0)

    function resizeTextarea() {
      const node = textareaRef.value
      if (!node) return

      const sizingData = getSizingData(node)
      if (!sizingData) return

      const [height] = calculateNodeHeight(
        sizingData,
        node.value || node.placeholder || 'x',
        props.minRows,
        props.maxRows,
      )

      if (heightRef.value !== height) {
        heightRef.value = height
        node.style.setProperty('height', `${height}px`, 'important')
      }
    }

    const cleanupFns: Array<() => void> = []

    onMounted(() => {
      // Initial size
      resizeTextarea()

      // Window resize
      const onResize = () => resizeTextarea()
      window.addEventListener('resize', onResize)
      cleanupFns.push(() => window.removeEventListener('resize', onResize))

      // ResizeObserver — only fires when the textarea's WIDTH changes (column resize, etc.)
      const node = textareaRef.value
      if (node && typeof ResizeObserver !== 'undefined') {
        widthRef.value = node.offsetWidth
        const observer = new ResizeObserver(() => {
          if (textareaRef.value && textareaRef.value.offsetWidth !== widthRef.value) {
            widthRef.value = textareaRef.value.offsetWidth
            resizeTextarea()
          }
        })
        observer.observe(node)
        cleanupFns.push(() => observer.disconnect())
      }

      // Font loading can change line height
      const onFontsLoaded = () => resizeTextarea()
      document.fonts.addEventListener('loadingdone', onFontsLoaded)
      cleanupFns.push(() => document.fonts.removeEventListener('loadingdone', onFontsLoaded))

      // Form reset (uncontrolled mode only)
      const onReset = (event: Event) => {
        if (textareaRef.value?.form === event.target && props.value === undefined) {
          const before = textareaRef.value!.value
          requestAnimationFrame(() => {
            if (textareaRef.value && before !== textareaRef.value.value) {
              resizeTextarea()
            }
          })
        }
      }
      document.body.addEventListener('reset', onReset)
      cleanupFns.push(() => document.body.removeEventListener('reset', onReset))
    })

    onUnmounted(() => {
      cleanupFns.forEach((fn) => fn())
      cleanupFns.length = 0
    })

    watch(
      () => props.value,
      () => resizeTextarea(),
    )

    return () => {
      // Strip autosize-only attrs that are not valid on a real <textarea>
      const { maxRows: _mr, minRows: _mn, ...rest } = attrs as any

      return h('textarea', {
        ...rest,
        // value comes through attrs (or via the declared prop above for watching)
        value: props.value !== undefined ? props.value : rest.value,
        ref: textareaRef,
        onInput: (event: Event) => {
          // In uncontrolled mode the DOM value changed; resize immediately
          if (props.value === undefined) {
            resizeTextarea()
          }
          rest.onInput?.(event)
        },
      })
    }
  },
})
