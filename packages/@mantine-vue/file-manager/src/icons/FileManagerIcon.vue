<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { FILE_MANAGER_ICON_PATHS, type FileManagerIconName } from './icon-paths'

defineOptions({ name: 'FileManagerIcon', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Which built-in glyph to render. */
    name: FileManagerIconName

    /** Any valid CSS length. Numbers are treated as pixels. */
    size?: string | number

    /** Stroke width on the 24x24 grid. */
    strokeWidth?: number
  }>(),
  { size: '1em', strokeWidth: 1.75 },
)

const attrs = useAttrs()

const dimension = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const paths = computed(() => FILE_MANAGER_ICON_PATHS[props.name])
</script>

<template>
  <svg
    v-bind="attrs"
    :width="dimension"
    :height="dimension"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="props.strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>
