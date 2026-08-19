<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Flex, Tooltip } from '@mantine-vue/core'
import { computed } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_ColumnPinningButtons.module.css'

defineOptions({ name: 'MVTColumnPinningButtons' })

const props = defineProps<{
  column: MVT_Column<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const buttons = computed(() => {
  const { localization: l, icons } = props.table.options
  return props.column.getIsPinned()
    ? [{ icon: icons.IconPinnedOff, iconClass: undefined, label: l.unpin, side: false as const }]
    : [
        {
          icon: icons.IconPinned,
          iconClass: classes.left,
          label: l.pinToLeft,
          side: 'left' as const,
        },
        {
          icon: icons.IconPinned,
          iconClass: classes.right,
          label: l.pinToRight,
          side: 'right' as const,
        },
      ]
})
</script>

<template>
  <Flex :class="clsx('mvt-column-pinning-buttons', classes.root)">
    <Tooltip
      v-for="button in buttons"
      :key="String(button.side)"
      :label="button.label"
      :withinPortal="true"
    >
      <ActionIcon
        :aria-label="button.label"
        color="gray"
        size="md"
        variant="subtle"
        @click="column.pin(button.side)"
      >
        <component :is="button.icon" :class="button.iconClass" />
      </ActionIcon>
    </Tooltip>
  </Flex>
</template>
