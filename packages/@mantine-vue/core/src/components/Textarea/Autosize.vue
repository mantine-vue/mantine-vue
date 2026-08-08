<script lang="ts">
/** Props of `TextareaAutosize`. This component is internal to `Textarea`. */
export interface TextareaAutosizeProps {
  /** Maximum number of rows the textarea grows to. Unbounded when not set. */
  maxRows?: number

  /** Minimum number of rows the textarea shrinks to. */
  minRows?: number

  /**
   * Value of the textarea. Declared so it can be watched: in controlled mode the DOM
   * value changes without an `input` event on this element.
   */
  value?: string | number
}
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue'
import { calculateNodeHeight, getSizingData } from './autosize-utils'

defineOptions({
  name: 'TextareaAutosize',
  // inheritAttrs: false so we can intercept onInput and filter maxRows/minRows
  inheritAttrs: false,
})

const props = defineProps<TextareaAutosizeProps>()

const attrs = useAttrs()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

/** Last applied height and width, so a resize is only written when it really changed. */
const heightRef = ref(0)
const widthRef = ref(0)

function resizeTextarea() {
  const node = textareaRef.value

  if (!node) {
    return
  }

  const sizingData = getSizingData(node)

  if (!sizingData) {
    return
  }

  // An empty textarea still has to be one row tall, hence the `'x'` fallback.
  const [height] = calculateNodeHeight(
    sizingData,
    node.value || node.placeholder || 'x',
    props.minRows,
    props.maxRows,
  )

  if (heightRef.value !== height) {
    heightRef.value = height
    // `important` so a stylesheet cannot fight the measured height.
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
      // A height change is our own doing, so only a width change is worth reacting to.
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

      // The reset has not been applied yet when the event fires.
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

/**
 * `maxRows` and `minRows` are consumed here and are not valid textarea attributes, and
 * the input handler is chained explicitly below.
 */
const textareaAttrs = computed(() => {
  const { maxRows: _maxRows, minRows: _minRows, onInput: _onInput, ...rest } = attrs as any
  return rest
})

/** The declared prop wins; otherwise the value arrives through the attributes. */
const value = computed(() => (props.value !== undefined ? props.value : (attrs as any).value))

function onInput(event: Event) {
  // In uncontrolled mode the DOM value changed; resize immediately
  if (props.value === undefined) {
    resizeTextarea()
  }

  ;(attrs as any).onInput?.(event)
}
</script>

<template>
  <textarea ref="textareaRef" v-bind="textareaAttrs" :value="value" @input="onInput" />
</template>
