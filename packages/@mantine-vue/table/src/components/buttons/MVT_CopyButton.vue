<script setup lang="ts">
import { ref, useAttrs } from 'vue'

import { Tooltip, UnstyledButton } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Cell, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_CopyButton.module.css'

defineOptions({ name: 'MVTCopyButton', inheritAttrs: false })

const props = defineProps<{
  cell: MVT_Cell<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{ default?: () => any }>()

const attrs = useAttrs()
const copied = ref(false)

const handleCopy = () => {
  navigator?.clipboard?.writeText(props.cell.getValue<any>()?.toString())
  copied.value = true
  setTimeout(() => (copied.value = false), 4000)
}

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const buttonProps = () => {
  const { cell, table } = props
  const { column, row } = cell
  const context = { cell, column, row, table }

  const copyButtonProps = {
    ...parseFromValuesOrFunc(table.options.mantineCopyButtonProps, context),
    ...parseFromValuesOrFunc(column.columnDef.mantineCopyButtonProps, context),
    ...attrs,
  } as Record<string, any>

  return {
    ...copyButtonProps,
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      handleCopy()
      copyButtonProps.onClick?.(event)
    },
    class: clsx(classes.root, copyButtonProps.class),
  }
}
</script>

<template>
  <Tooltip
    :color="copied ? 'teal' : undefined"
    :label="
      copied ? table.options.localization.copiedToClipboard : table.options.localization.clickToCopy
    "
    :openDelay="1000"
    :withinPortal="true"
  >
    <UnstyledButton v-bind="buttonProps()">
      <slot />
    </UnstyledButton>
  </Tooltip>
</template>
