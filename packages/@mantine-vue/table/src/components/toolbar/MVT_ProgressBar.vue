<script setup lang="ts">
import clsx from 'clsx'
import { Collapse, Progress } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_ProgressBar.module.css'

defineOptions({ name: 'MVTProgressBar', inheritAttrs: false })

const props = defineProps<{
  isTopToolbar: boolean
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const isExpanded = computed(() => {
  const { isSaving, showProgressBars } = props.table.getState()
  return Boolean(isSaving || showProgressBars)
})

const progressProps = computed<any>(() => ({
  animated: true,
  'aria-busy': 'true',
  'aria-label': 'Loading',
  radius: 0,
  value: 100,
  ...parseFromValuesOrFunc(props.table.options.mantineProgressProps, {
    isTopToolbar: props.isTopToolbar,
    table: props.table,
  }),
  ...attrs,
}))
</script>

<template>
  <Collapse
    :class="clsx(classes.collapse, isTopToolbar && classes['collapse-top'])"
    :expanded="isExpanded"
  >
    <Progress v-bind="progressProps" />
  </Collapse>
</template>
