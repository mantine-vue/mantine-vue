<script setup lang="ts">
import clsx from 'clsx'
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Box,
  MultiSelect,
  Select,
  TextInput,
} from '@mantine-vue/core'
import { DateInput } from '@mantine-vue/dates'
import { useDebouncedValue } from '@mantine-vue/hooks'
import { computed, h, ref, useAttrs, useSlots, watch, type VNodeChild } from 'vue'
import { localizedFilterOption } from '../../fns/filterFns'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_FilterTextInput.module.css'
import { MVT_RenderNode } from '../../utils/renderable'

defineOptions({ name: 'MVTFilterTextInput', inheritAttrs: false })

const props = defineProps<{
  header: MVT_Header<MVT_RowData>
  rangeFilterIndex?: number
  table: MVT_TableInstance<MVT_RowData>
}>()

defineSlots<{
  default?: (arg: {
    column: MVT_Header<MVT_RowData>['column']
    header: MVT_Header<MVT_RowData>
    rangeFilterIndex?: number
    table: MVT_TableInstance<MVT_RowData>
  }) => any
}>()

const attrs = useAttrs()
const slots = useSlots()

const { column } = props.header
const { filterInputRefs } = props.table.refs
const def = column.columnDef

const isRange =
  def.filterVariant === 'range' ||
  def.filterVariant === 'date-range' ||
  props.rangeFilterIndex !== undefined
const isMulti = def.filterVariant === 'multi-select'
const isSelect = def.filterVariant === 'select'
const isDate = def.filterVariant === 'date' || def.filterVariant === 'date-range'
const isAuto = def.filterVariant === 'autocomplete'

const readFilterValue = () =>
  isMulti
    ? ((column.getFilterValue() as unknown[]) ?? [])
    : isRange
      ? ((column.getFilterValue() as [unknown, unknown])?.[props.rangeFilterIndex!] ?? '')
      : (column.getFilterValue() ?? '')

const filterValue = ref<any>(readFilterValue())
const [debounced] = useDebouncedValue(filterValue, props.table.options.manualFiltering ? 400 : 200)

watch(debounced, (value) => {
  if (isRange)
    column.setFilterValue((old: [unknown, unknown]) => {
      const next = Array.isArray(old) ? [...old] : ['', '']
      next[props.rangeFilterIndex!] = value
      return next
    })
  else column.setFilterValue(value ?? undefined)
})

watch(
  () => column.getFilterValue(),
  (value) => {
    filterValue.value =
      value === undefined
        ? isMulti
          ? []
          : ''
        : isRange
          ? ((value as any[])?.[props.rangeFilterIndex!] ?? '')
          : value
  },
)

const assignRef = (el: any) => {
  const node = (el?.$el?.querySelector?.('input') ?? el?.$el ?? el) as HTMLInputElement
  if (node) filterInputRefs.value[`${column.id}-${props.rangeFilterIndex ?? 0}`] = node
}

const filterContext = computed(() => ({
  column,
  rangeFilterIndex: props.rangeFilterIndex,
  table: props.table,
}))

const textProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(
        props.table.options.mantineFilterTextInputProps,
        filterContext.value,
      ),
      ...parseFromValuesOrFunc(def.mantineFilterTextInputProps, filterContext.value),
      ...attrs,
    }) as Record<string, any>,
)

const selectProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(props.table.options.mantineFilterSelectProps, filterContext.value),
      ...parseFromValuesOrFunc(def.mantineFilterSelectProps, filterContext.value),
    }) as Record<string, any>,
)

const multiProps = computed(
  () =>
    ({
      clearable: true,
      ...parseFromValuesOrFunc(
        props.table.options.mantineFilterMultiSelectProps,
        filterContext.value,
      ),
      ...parseFromValuesOrFunc(def.mantineFilterMultiSelectProps, filterContext.value),
    }) as Record<string, any>,
)

const dateProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(
        props.table.options.mantineFilterDateInputProps,
        filterContext.value,
      ),
      ...parseFromValuesOrFunc(def.mantineFilterDateInputProps, filterContext.value),
    }) as Record<string, any>,
)

const autoProps = computed(
  () =>
    ({
      ...parseFromValuesOrFunc(
        props.table.options.mantineFilterAutocompleteProps,
        filterContext.value,
      ),
      ...parseFromValuesOrFunc(def.mantineFilterAutocompleteProps, filterContext.value),
    }) as Record<string, any>,
)

const modeLabel = computed(() =>
  ['empty', 'notEmpty'].includes(def._filterFn)
    ? localizedFilterOption(props.table.options.localization, def._filterFn)
    : '',
)

const placeholder = computed(() => {
  const { localization } = props.table.options
  return !isRange
    ? (textProps.value.placeholder ??
        localization.filterByColumn.replace('{column}', String(def.header)))
    : props.rangeFilterIndex === 0
      ? localization.min
      : localization.max
})

const options = computed(() => {
  const provided = autoProps.value.data ?? selectProps.value.data ?? multiProps.value.data
  const faceted = column.getFacetedUniqueValues()
  return (
    provided ??
    ((isAuto || isSelect || isMulti) && faceted
      ? Array.from(faceted.keys())
          .filter((value) => value != null)
          .sort((a, b) => String(a).localeCompare(String(b)))
      : [])
  ).filter((value: unknown) => value != null)
})

const clear = () => {
  if (isMulti) {
    filterValue.value = []
    column.setFilterValue([])
  } else if (isRange) {
    filterValue.value = ''
    column.setFilterValue((old: any[]) => {
      const next = Array.isArray(old) ? [...old] : ['', '']
      next[props.rangeFilterIndex!] = undefined
      return next
    })
  } else if (isSelect) {
    filterValue.value = null
    column.setFilterValue(null)
  } else {
    filterValue.value = ''
    column.setFilterValue(undefined)
  }
}

const resetFilterMode = () => {
  clear()
  props.table.setColumnFilterFns((old) => ({
    ...old,
    [props.header.id]:
      (def.columnFilterModeOptions ?? props.table.options.columnFilterModeOptions)?.[0] ?? 'fuzzy',
  }))
}

/**
 * Mantine takes the clear affordance as a `rightSection` *value*, so it has to
 * be a vnode. Built fresh on every render — a cached vnode would be re-inserted
 * into a second tree.
 */
const clearButton = () => {
  if (!filterValue.value) return null
  const { icons, localization } = props.table.options
  return h(
    ActionIcon,
    {
      'aria-label': localization.clearFilter,
      color: 'var(--mantine-color-gray-7)',
      size: 'sm',
      title: localization.clearFilter,
      variant: 'transparent',
      onClick: clear,
    },
    () => h(icons.IconX),
  )
}

const className = computed(() =>
  clsx(
    'mvt-filter-text-input',
    classes.root,
    isDate
      ? classes['date-filter']
      : isRange
        ? classes['range-filter']
        : !modeLabel.value && classes['not-filter-chip'],
  ),
)

const commonProps = (): Record<string, any> => ({
  'aria-label': placeholder.value,
  disabled: !!modeLabel.value,
  placeholder: placeholder.value,
  title: placeholder.value,
  value: isMulti && !Array.isArray(filterValue.value) ? [] : filterValue.value,
  variant: 'unstyled',
  onClick: (event: MouseEvent) => event.stopPropagation(),
})

const multiSelectFieldProps = () => ({
  ...commonProps(),
  searchable: true,
  ...multiProps.value,
  class: clsx(className.value, multiProps.value.class, multiProps.value.className),
  data: options.value,
  rightSection:
    filterValue.value?.toString()?.length && multiProps.value.clearable ? clearButton() : undefined,
  onChange: (value: unknown[]) => {
    filterValue.value = value
    multiProps.value.onChange?.(value)
  },
  ref: assignRef,
})

const selectFieldProps = () => ({
  ...commonProps(),
  clearable: true,
  searchable: true,
  ...selectProps.value,
  class: clsx(className.value, selectProps.value.class, selectProps.value.className),
  clearButtonProps: { size: 'md' },
  data: options.value,
  onChange: (value: unknown, option: unknown) => {
    filterValue.value = value
    selectProps.value.onChange?.(value, option)
  },
  ref: assignRef,
})

const dateFieldProps = () => ({
  ...commonProps(),
  allowDeselect: true,
  clearable: true,
  popoverProps: { withinPortal: props.table.options.columnFilterDisplayMode !== 'popover' },
  ...dateProps.value,
  class: clsx(className.value, dateProps.value.class, dateProps.value.className),
  onChange: (value: unknown) => {
    filterValue.value = value ?? ''
    dateProps.value.onChange?.(value)
  },
  ref: assignRef,
})

const autocompleteFieldProps = () => ({
  ...commonProps(),
  ...autoProps.value,
  class: clsx(className.value, autoProps.value.class, autoProps.value.className),
  data: options.value,
  rightSection: filterValue.value?.toString()?.length ? clearButton() : undefined,
  onChange: (value: string) => {
    filterValue.value = value
    autoProps.value.onChange?.(value)
  },
  ref: assignRef,
})

const textFieldProps = () => ({
  ...commonProps(),
  ...textProps.value,
  class: clsx(className.value, textProps.value.class, textProps.value.className),
  mt: 0,
  rightSection: filterValue.value?.toString()?.length ? clearButton() : undefined,
  onInput: (event: Event | string) => {
    const value = typeof event === 'string' ? event : (event.target as HTMLInputElement).value
    filterValue.value = value
    textProps.value.onChange?.(event)
  },
  ref: assignRef,
})

/**
 * A `default` slot or column-def `Filter` replaces the built-in input, but only
 * when it returns a node. Resolved as the template branches so the callback
 * runs exactly once per render.
 */
let customFilter: VNodeChild
const hasCustomFilter = () => {
  const context = {
    column,
    header: props.header,
    rangeFilterIndex: props.rangeFilterIndex,
    table: props.table,
  }
  customFilter = slots.default?.(context) ?? def.Filter?.(context)
  return !!customFilter
}
const renderCustomFilter = () => customFilter
</script>

<template>
  <MVT_RenderNode v-if="hasCustomFilter()" :node="renderCustomFilter()" />
  <Box v-else-if="modeLabel">
    <Badge
      :class="classes['filter-chip-badge']"
      :rightSection="clearButton()"
      size="lg"
      @click="resetFilterMode"
    >
      {{ modeLabel }}
    </Badge>
  </Box>
  <MultiSelect v-else-if="isMulti" v-bind="multiSelectFieldProps()" />
  <Select v-else-if="isSelect" v-bind="selectFieldProps()" />
  <DateInput v-else-if="isDate" v-bind="dateFieldProps()" />
  <Autocomplete v-else-if="isAuto" v-bind="autocompleteFieldProps()" />
  <TextInput v-else v-bind="textFieldProps()" />
</template>
