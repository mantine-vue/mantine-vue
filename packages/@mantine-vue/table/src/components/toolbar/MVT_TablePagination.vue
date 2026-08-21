<script lang="ts">
const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100].map(String)
</script>

<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Box, Group, Pagination, Select, Text } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_TablePagination.module.css'

defineOptions({ name: 'MVTTablePagination', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    position?: 'bottom' | 'top'
    table: MVT_TableInstance<MVT_RowData>
  }>(),
  { position: 'bottom' },
)

const attrs = useAttrs()

const localization = computed(() => props.table.options.localization)
const icons = computed(() => props.table.options.icons)

const pageIndex = computed(() => props.table.getState().pagination.pageIndex ?? 0)
const pageSize = computed(() => props.table.getState().pagination.pageSize ?? 10)

const totalRowCount = computed(
  () => props.table.options.rowCount ?? props.table.getPrePaginationRowModel().rows.length,
)
const numberOfPages = computed(() => Math.ceil(totalRowCount.value / pageSize.value))
const firstRowIndex = computed(() => pageIndex.value * pageSize.value)
const lastRowIndex = computed(() =>
  Math.min(firstRowIndex.value + pageSize.value, totalRowCount.value),
)

const paginationProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantinePaginationProps, { table: props.table }),
      ...attrs,
    }) as Record<string, any>,
)

const rowsPerPageOptions = computed(
  () => paginationProps.value.rowsPerPageOptions ?? defaultRowsPerPage,
)
const showRowsPerPage = computed(() => paginationProps.value.showRowsPerPage ?? true)
const withEdges = computed(() => paginationProps.value.withEdges ?? numberOfPages.value > 2)

const restPaginationProps = computed(() => {
  const {
    rowsPerPageOptions: _options,
    showRowsPerPage: _show,
    withEdges: _edges,
    ...rest
  } = paginationProps.value
  return rest
})

const displayMode = computed(() => props.table.options.paginationDisplayMode)

const paginationControlProps = computed(() => ({
  total: numberOfPages.value,
  modelValue: pageIndex.value + 1,
  withEdges: withEdges.value,
  ...restPaginationProps.value,
  'onUpdate:modelValue': (page: number) => props.table.setPageIndex(page - 1),
}))

const rangeLabel = computed(
  () =>
    `${lastRowIndex.value === 0 ? 0 : (firstRowIndex.value + 1).toLocaleString()}-${lastRowIndex.value.toLocaleString()} ${localization.value.of} ${totalRowCount.value.toLocaleString()}`,
)

const isFirstPage = computed(() => pageIndex.value <= 0)
const isLastPage = computed(() => lastRowIndex.value >= totalRowCount.value)

const pageSizeSelectProps = computed(() => ({
  allowDeselect: false,
  'aria-labelledby': 'rpp-label',
  class: classes.pagesize,
  data: rowsPerPageOptions.value,
  modelValue: pageSize.value.toString(),
  'onUpdate:modelValue': (value: null | string) => value && props.table.setPageSize(+value),
}))

const rootClass = computed(() =>
  clsx(
    'mvt-table-pagination',
    classes.root,
    props.position === 'top' &&
      props.table.options.enableToolbarInternalActions &&
      !props.table.getState().showGlobalFilter &&
      classes['with-top-margin'],
  ),
)
</script>

<template>
  <Box :class="rootClass">
    <Group v-if="showRowsPerPage" gap="xs">
      <Text id="rpp-label">{{ localization.rowsPerPage }}</Text>
      <Select v-bind="pageSizeSelectProps" />
    </Group>
    <Pagination v-if="displayMode === 'pages'" v-bind="paginationControlProps" />
    <template v-else-if="displayMode === 'default'">
      <Text>{{ rangeLabel }}</Text>
      <Group :gap="6">
        <ActionIcon
          v-if="withEdges"
          :aria-label="localization.goToFirstPage"
          color="gray"
          :disabled="isFirstPage"
          variant="subtle"
          @click="table.setPageIndex(0)"
        >
          <component :is="icons.IconChevronLeftPipe" />
        </ActionIcon>
        <ActionIcon
          :aria-label="localization.goToPreviousPage"
          color="gray"
          :disabled="isFirstPage"
          variant="subtle"
          @click="table.setPageIndex(pageIndex - 1)"
        >
          <component :is="icons.IconChevronLeft" />
        </ActionIcon>
        <ActionIcon
          :aria-label="localization.goToNextPage"
          color="gray"
          :disabled="isLastPage"
          variant="subtle"
          @click="table.setPageIndex(pageIndex + 1)"
        >
          <component :is="icons.IconChevronRight" />
        </ActionIcon>
        <ActionIcon
          v-if="withEdges"
          :aria-label="localization.goToLastPage"
          color="gray"
          :disabled="isLastPage"
          variant="subtle"
          @click="table.setPageIndex(Math.max(0, numberOfPages - 1))"
        >
          <component :is="icons.IconChevronRightPipe" />
        </ActionIcon>
      </Group>
    </template>
  </Box>
</template>
