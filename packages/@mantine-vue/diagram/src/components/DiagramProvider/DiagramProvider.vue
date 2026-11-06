<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { useStyles, type MantineColor } from '@mantine-vue/core'
import { mergeDiagramLabels, type DiagramLabelsOverride } from '../../labels'
import { createElements, provideDiagramContext, useColorResolver } from '../../vue/context'
import type { DiagramController } from '../../vue/use-diagram'
import { varsResolver } from '../Diagram/Diagram.vue'
import classes from '../Diagram/Diagram.module.css'

defineOptions({ name: 'DiagramProvider', inheritAttrs: false })

const props = defineProps<{
  /** Controller shared by the parts rendered inside, usually from `useDiagram` */
  controller: DiagramController
  /** Overrides of user facing texts */
  labels?: DiagramLabelsOverride
  /** Accent color of the parts */
  color?: MantineColor
}>()

defineSlots<{ default?: () => any }>()

const attrs = useAttrs()

const getStyles = useStyles({
  name: 'Diagram',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  varsResolver,
  rootSelector: 'provider',
} as any)

const labels = computed(() => mergeDiagramLabels(props.labels))
const instance = useId()

provideDiagramContext({
  controller: props.controller,
  labels,
  getStyles: getStyles as any,
  resolveColor: useColorResolver(),
  elements: createElements(),
  domId: (id) => `mantine-diagram-${instance}-${id}`,
  openContextMenu: () => {},
  inCanvas: false,
})
</script>

<template>
  <div v-bind="getStyles('provider')">
    <slot />
  </div>
</template>
