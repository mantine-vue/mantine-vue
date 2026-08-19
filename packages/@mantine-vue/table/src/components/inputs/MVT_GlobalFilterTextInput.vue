<script setup lang="ts">
import clsx from 'clsx'
import { ActionIcon, Collapse, Menu, TextInput, Tooltip } from '@mantine-vue/core'
import { useDebouncedValue } from '@mantine-vue/hooks'
import { computed, h, ref, useAttrs, watch } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_FilterOptionMenu from '../menus/MVT_FilterOptionMenu.vue'
import classes from './MVT_GlobalFilterTextInput.module.css'

defineOptions({ name: 'MVTGlobalFilterTextInput', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

const searchValue = ref(props.table.getState().globalFilter ?? '')
const [debounced] = useDebouncedValue(searchValue, props.table.options.manualFiltering ? 500 : 250)

watch(debounced, (value) => props.table.setGlobalFilter(value || undefined))
watch(
  () => props.table.getState().globalFilter,
  (value) => {
    searchValue.value = value ?? ''
  },
)

const clear = () => {
  searchValue.value = ''
  props.table.setGlobalFilter(undefined)
}

const isExpanded = computed(() => props.table.getState().showGlobalFilter)

const setSearchInputRef = (el: any) => {
  const node = (el?.$el?.querySelector?.('input') ?? el?.$el ?? el) as HTMLInputElement
  const { searchInputRef } = props.table.refs
  if (node) searchInputRef.value = node
}

/**
 * `leftSection` / `rightSection` are Mantine props rather than slots, so they
 * carry vnodes. Rebuilt each render rather than cached in a `computed`, which
 * would hand the same vnode to a second patch.
 */
const inputProps = () => {
  const { table } = props
  const { enableGlobalFilterModes, icons, localization, positionGlobalFilter } = table.options

  const searchTextInputProps = {
    ...parseFromValuesOrFunc(table.options.mantineSearchTextInputProps, { table }),
    ...attrs,
  } as Record<string, any>

  return {
    leftSection: !enableGlobalFilterModes ? h(icons.IconSearch) : undefined,
    mt: 0,
    mx: positionGlobalFilter !== 'left' ? 'mx' : undefined,
    placeholder: localization.search,
    value: searchValue.value,
    variant: 'filled',
    ...searchTextInputProps,
    class: clsx('mvt-global-filter-text-input', classes.root, searchTextInputProps.class),
    onInput: (event: Event | string) => {
      searchValue.value =
        typeof event === 'string' ? event : (event.target as HTMLInputElement).value
      searchTextInputProps.onChange?.(event)
    },
    rightSection: h(
      ActionIcon<'button'>,
      {
        'aria-label': localization.clearSearch,
        color: 'gray',
        disabled: !searchValue.value.length,
        hidden: !searchValue.value,
        size: 'sm',
        style: { visibility: !searchValue.value ? 'hidden' : undefined },
        variant: 'transparent',
        onClick: clear,
      },
      () =>
        h(Tooltip, { label: localization.clearSearch, withinPortal: true }, () => h(icons.IconX)),
    ),
    ref: setSearchInputRef,
  }
}
</script>

<template>
  <Collapse :class="classes.collapse" :expanded="isExpanded">
    <Menu v-if="table.options.enableGlobalFilterModes" :withinPortal="true">
      <Menu.Target>
        <ActionIcon
          :aria-label="table.options.localization.changeSearchMode"
          color="gray"
          size="sm"
          variant="transparent"
        >
          <component :is="table.options.icons.IconSearch" />
        </ActionIcon>
      </Menu.Target>
      <MVT_FilterOptionMenu :table="table" :onSelect="clear" />
    </Menu>
    <TextInput v-bind="inputProps()" />
  </Collapse>
</template>
