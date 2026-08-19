<script setup lang="ts">
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, ref, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'

defineOptions({ name: 'MVTToggleFullScreenButton', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()
const tooltipOpened = ref(false)

const title = computed(
  () => (attrs.title as string | undefined) ?? props.table.options.localization.toggleFullScreen,
)

const icon = computed(() => {
  const { IconMaximize, IconMinimize } = props.table.options.icons
  return props.table.getState().isFullScreen ? IconMinimize : IconMaximize
})

const actionIconProps = computed<any>(() => ({
  'aria-label': title.value,
  color: 'gray',
  size: 'lg',
  variant: 'subtle',
  ...attrs,
  onMouseenter: () => {
    tooltipOpened.value = true
  },
  onMouseleave: () => {
    tooltipOpened.value = false
  },
  onClick: () => {
    tooltipOpened.value = false
    props.table.setIsFullScreen((current) => !current)
  },
}))
</script>

<template>
  <Tooltip :label="title" :opened="tooltipOpened" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps">
      <component :is="icon" />
    </ActionIcon>
  </Tooltip>
</template>
