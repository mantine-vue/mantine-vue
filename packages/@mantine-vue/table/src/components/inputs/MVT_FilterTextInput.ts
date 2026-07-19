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
import { defineComponent, h, ref, watch, type PropType } from 'vue'
import { localizedFilterOption } from '../../fns/filterFns'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_FilterTextInput.module.css'

export const MVT_FilterTextInput = defineComponent({
  name: 'MVTFilterTextInput',
  inheritAttrs: false,
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, required: true },
    rangeFilterIndex: { type: Number, default: undefined },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    const { column } = props.header
    const { filterInputRefs } = props.table.refs
    const def = column.columnDef
    const isRange =
      def.filterVariant === 'range' ||
      def.filterVariant === 'date-range' ||
      props.rangeFilterIndex !== undefined
    const isMulti = def.filterVariant === 'multi-select'
    const read = () =>
      isMulti
        ? ((column.getFilterValue() as unknown[]) ?? [])
        : isRange
          ? ((column.getFilterValue() as [unknown, unknown])?.[props.rangeFilterIndex!] ?? '')
          : (column.getFilterValue() ?? '')
    const filterValue = ref<any>(read())
    const [debounced] = useDebouncedValue(
      filterValue,
      props.table.options.manualFiltering ? 400 : 200,
    )
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
    return () => {
      const { table } = props
      const o = table.options
      const arg = { column, rangeFilterIndex: props.rangeFilterIndex, table }
      const textProps = {
        ...parseFromValuesOrFunc(o.mantineFilterTextInputProps, arg),
        ...parseFromValuesOrFunc(def.mantineFilterTextInputProps, arg),
        ...attrs,
      } as Record<string, any>
      const selectProps = {
        ...parseFromValuesOrFunc(o.mantineFilterSelectProps, arg),
        ...parseFromValuesOrFunc(def.mantineFilterSelectProps, arg),
      } as Record<string, any>
      const multiProps = {
        clearable: true,
        ...parseFromValuesOrFunc(o.mantineFilterMultiSelectProps, arg),
        ...parseFromValuesOrFunc(def.mantineFilterMultiSelectProps, arg),
      } as Record<string, any>
      const dateProps = {
        ...parseFromValuesOrFunc(o.mantineFilterDateInputProps, arg),
        ...parseFromValuesOrFunc(def.mantineFilterDateInputProps, arg),
      } as Record<string, any>
      const autoProps = {
        ...parseFromValuesOrFunc(o.mantineFilterAutocompleteProps, arg),
        ...parseFromValuesOrFunc(def.mantineFilterAutocompleteProps, arg),
      } as Record<string, any>
      const isSelect = def.filterVariant === 'select'
      const isDate = def.filterVariant === 'date' || def.filterVariant === 'date-range'
      const isAuto = def.filterVariant === 'autocomplete'
      const modeLabel = ['empty', 'notEmpty'].includes(def._filterFn)
        ? localizedFilterOption(o.localization, def._filterFn)
        : ''
      const placeholder = !isRange
        ? (textProps.placeholder ??
          o.localization.filterByColumn.replace('{column}', String(def.header)))
        : props.rangeFilterIndex === 0
          ? o.localization.min
          : o.localization.max
      const provided = autoProps.data ?? selectProps.data ?? multiProps.data
      const faceted = column.getFacetedUniqueValues()
      const options = (
        provided ??
        ((isAuto || isSelect || isMulti) && faceted
          ? Array.from(faceted.keys())
              .filter((v) => v != null)
              .sort((a, b) => String(a).localeCompare(String(b)))
          : [])
      ).filter((v: unknown) => v != null)
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
      const clearButton = filterValue.value
        ? h(
            ActionIcon,
            {
              'aria-label': o.localization.clearFilter,
              color: 'var(--mantine-color-gray-7)',
              size: 'sm',
              title: o.localization.clearFilter,
              variant: 'transparent',
              onClick: clear,
            },
            () => h(o.icons.IconX),
          )
        : null
      const className = clsx(
        'mvt-filter-text-input',
        classes.root,
        isDate
          ? classes['date-filter']
          : isRange
            ? classes['range-filter']
            : !modeLabel && classes['not-filter-chip'],
      )
      const common: Record<string, any> = {
        'aria-label': placeholder,
        disabled: !!modeLabel,
        placeholder,
        title: placeholder,
        value: isMulti && !Array.isArray(filterValue.value) ? [] : filterValue.value,
        variant: 'unstyled',
        onClick: (e: MouseEvent) => e.stopPropagation(),
      }
      const custom =
        slots.default?.({
          column,
          header: props.header,
          rangeFilterIndex: props.rangeFilterIndex,
          table,
        }) ??
        def.Filter?.({
          column,
          header: props.header,
          rangeFilterIndex: props.rangeFilterIndex,
          table,
        })
      if (custom) return custom
      if (modeLabel)
        return h(Box, null, () =>
          h(
            Badge,
            {
              class: classes['filter-chip-badge'],
              rightSection: clearButton,
              size: 'lg',
              onClick: () => {
                clear()
                table.setColumnFilterFns((old) => ({
                  ...old,
                  [props.header.id]:
                    (def.columnFilterModeOptions ?? o.columnFilterModeOptions)?.[0] ?? 'fuzzy',
                }))
              },
            },
            () => modeLabel,
          ),
        )
      if (isMulti)
        return h(MultiSelect, {
          ...common,
          searchable: true,
          ...multiProps,
          class: clsx(className, multiProps.class, multiProps.className),
          data: options,
          rightSection:
            filterValue.value?.toString()?.length && multiProps.clearable ? clearButton : undefined,
          onChange: (value: unknown[]) => {
            filterValue.value = value
            multiProps.onChange?.(value)
          },
          ref: assignRef,
        } as any)
      if (isSelect)
        return h(Select, {
          ...common,
          clearable: true,
          searchable: true,
          ...selectProps,
          class: clsx(className, selectProps.class, selectProps.className),
          clearButtonProps: { size: 'md' },
          data: options,
          onChange: (value: unknown, option: unknown) => {
            filterValue.value = value
            selectProps.onChange?.(value, option)
          },
          ref: assignRef,
        } as any)
      if (isDate)
        return h(DateInput, {
          ...common,
          allowDeselect: true,
          clearable: true,
          popoverProps: { withinPortal: o.columnFilterDisplayMode !== 'popover' },
          ...dateProps,
          class: clsx(className, dateProps.class, dateProps.className),
          onChange: (value: unknown) => {
            filterValue.value = value ?? ''
            dateProps.onChange?.(value)
          },
          ref: assignRef,
        } as any)
      if (isAuto)
        return h(Autocomplete, {
          ...common,
          ...autoProps,
          class: clsx(className, autoProps.class, autoProps.className),
          data: options,
          rightSection: filterValue.value?.toString()?.length ? clearButton : undefined,
          onChange: (value: string) => {
            filterValue.value = value
            autoProps.onChange?.(value)
          },
          ref: assignRef,
        } as any)
      return h(TextInput, {
        ...common,
        ...textProps,
        class: clsx(className, textProps.class, textProps.className),
        mt: 0,
        rightSection: filterValue.value?.toString()?.length ? clearButton : undefined,
        onInput: (event: Event | string) => {
          const value = typeof event === 'string' ? event : (event.target as HTMLInputElement).value
          filterValue.value = value
          textProps.onChange?.(event)
        },
        ref: assignRef,
      } as any)
    }
  },
})
