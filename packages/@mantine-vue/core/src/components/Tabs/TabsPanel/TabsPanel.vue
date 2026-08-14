<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useTabsContext } from '../Tabs.context'
import type { TabsPanelOwnProps, TabsPanelSlots } from './TabsPanel.types'

defineOptions({ name: 'TabsPanel', inheritAttrs: false })

const props = withDefaults(defineProps<TabsPanelOwnProps>(), {
  rootRef: undefined,
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
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
