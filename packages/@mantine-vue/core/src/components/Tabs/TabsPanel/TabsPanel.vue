<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../../core'
import { useTabsContext } from '../Tabs.context'
import type { TabsPanelOwnProps, TabsPanelSlots } from './TabsPanel.types'

defineOptions({ name: 'TabsPanel', inheritAttrs: false })

const props = withDefaults(defineProps<TabsPanelOwnProps>(), {
  keepMounted: false,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
})
defineSlots<TabsPanelSlots>()

const attrs = useAttrs()
const ctx = useTabsContext()
const active = computed(() => ctx.value === props.value)
const shouldRender = computed(() => ctx.keepMounted || props.keepMounted || active.value)
const panelStyles = computed(() => ({
  ...(attrs.style as Record<string, any>),
  display: !active.value ? 'none' : undefined,
}))
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('panel', {
        className: attrs.class,
        classNames: props.classNames,
        styles: props.styles,
        style: panelStyles,
        props,
      }),
    }"
    :mod="[{ orientation: ctx.orientation }, props.mod]"
    role="tabpanel"
    :id="ctx.getPanelId(props.value)"
    :aria-labelledby="ctx.getTabId(props.value)"
  >
    <slot v-if="shouldRender" />
  </Box>
</template>
