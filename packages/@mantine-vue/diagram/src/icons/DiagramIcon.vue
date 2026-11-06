<script setup lang="ts">
import { computed } from 'vue'
import { DIAGRAM_ICON_PATHS, type DiagramIconName } from './icon-paths'

defineOptions({ name: 'DiagramIcon' })

const props = withDefaults(
  defineProps<{
    /** Icon name, unknown names render the pointer icon */
    name: DiagramIconName | (string & {})
    /** Size in pixels */
    size?: number | string
    /** Stroke width */
    stroke?: number
  }>(),
  { size: 18, stroke: 1.75 },
)

const path = computed(
  () => DIAGRAM_ICON_PATHS[props.name as DiagramIconName] ?? DIAGRAM_ICON_PATHS.pointer,
)
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="props.stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="path" />
  </svg>
</template>
