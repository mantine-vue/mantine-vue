<script setup lang="ts">
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, ref, useAttrs } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'

defineOptions({ name: 'MVTRowPinButton', inheritAttrs: false })

const props = defineProps<{
  pinningPosition: 'bottom' | 'top'
  row: MVT_Row<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()
const opened = ref(false)

const isPinned = computed(() => props.row.getIsPinned())

const label = computed(() => {
  const { localization } = props.table.options
  return isPinned.value ? localization.unpin : localization.pin
})

const actionIconProps = computed<any>(() => ({
  'aria-label': props.table.options.localization.pin,
  color: 'gray',
  size: 'xs',
  style: { height: '24px', width: '24px' },
  variant: 'subtle',
  ...attrs,
  onMouseenter: () => {
    opened.value = true
  },
  onMouseleave: () => {
    opened.value = false
  },
  onClick: (event: MouseEvent) => {
    opened.value = false
    event.stopPropagation()
    props.row.pin(isPinned.value ? false : props.pinningPosition)
  },
}))

const pinIconStyle = computed(() => {
  const rotation =
    props.table.options.rowPinningDisplayMode === 'sticky'
      ? 135
      : props.pinningPosition === 'top'
        ? 180
        : 0
  return { transform: `rotate(${rotation}deg)` }
})
</script>

<template>
  <Tooltip :label="label" :openDelay="1000" :opened="opened">
    <ActionIcon v-bind="actionIconProps">
      <component :is="table.options.icons.IconX" v-if="isPinned" />
      <component :is="table.options.icons.IconPinned" v-else :style="pinIconStyle" />
    </ActionIcon>
  </Tooltip>
</template>
