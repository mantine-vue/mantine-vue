<script setup lang="ts">
import { useDiagramContext } from '../../vue/context'
import type { DiagramPanelPosition } from '../../vue/types'

defineOptions({ name: 'DiagramPanel' })

const props = withDefaults(
  defineProps<{
    /** Corner or edge of the canvas the panel is attached to */
    position?: DiagramPanelPosition
  }>(),
  { position: 'top-left' },
)

defineSlots<{ default?: () => any }>()

const { getStyles } = useDiagramContext()
</script>

<template>
  <div v-bind="getStyles('panel')" :data-position="props.position">
    <slot />
  </div>
</template>
