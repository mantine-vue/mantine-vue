<script setup lang="ts">
import clsx from 'clsx'
import { Checkbox, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_FilterCheckBox.module.css'

defineOptions({ name: 'MVTFilterCheckbox', inheritAttrs: false })

const props = defineProps<{
  column: MVT_Column<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const checkboxProps = computed(() => {
  const context = { column: props.column, table: props.table }
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineFilterCheckboxProps, context),
    ...parseFromValuesOrFunc(props.column.columnDef.mantineFilterCheckboxProps, context),
    ...attrs,
  } as Record<string, any>
})

const label = computed(
  () =>
    checkboxProps.value.title ??
    props.table.options.localization.filterByColumn.replace(
      '{column}',
      String(props.column.columnDef.header),
    ),
)

const controlProps = computed(() => {
  const { column, table } = props
  const value = column.getFilterValue()

  return {
    checked: value === 'true',
    class: clsx('mvt-filter-checkbox', classes.root, checkboxProps.value.class),
    indeterminate: value === undefined,
    label: label.value,
    size: table.getState().density === 'xs' ? 'sm' : 'md',
    ...checkboxProps.value,
    title: undefined,
    onChange: (checked: boolean) => {
      column.setFilterValue(value === undefined ? 'true' : value === 'true' ? 'false' : undefined)
      checkboxProps.value.onChange?.(checked)
    },
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      checkboxProps.value.onClick?.(event)
    },
  }
})
</script>

<template>
  <Tooltip :label="label" :openDelay="1000" :withinPortal="true">
    <Checkbox v-bind="controlProps" />
  </Tooltip>
</template>
