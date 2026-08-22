<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { WHATSAPP_ICON_PATHS, type WhatsAppIconName } from './icon-paths'

defineOptions({ name: 'WhatsAppIcon', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Which built-in glyph to render. */
    name: WhatsAppIconName

    /** Any valid CSS length. Numbers are treated as pixels. */
    size?: string | number

    /** Stroke width on the 24x24 grid. */
    strokeWidth?: number

    /** Filled glyphs (`play`) look better without a stroke. */
    filled?: boolean
  }>(),
  { size: '1em', strokeWidth: 2, filled: false },
)

const attrs = useAttrs()

const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const paths = computed(() => WHATSAPP_ICON_PATHS[props.name])
</script>

<template>
  <svg
    v-bind="attrs"
    :width="dimension"
    :height="dimension"
    viewBox="0 0 24 24"
    :fill="props.filled ? 'currentColor' : 'none'"
    :stroke="props.filled ? 'none' : 'currentColor'"
    :stroke-width="props.strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>
