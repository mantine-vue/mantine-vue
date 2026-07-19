import clsx from 'clsx'
import { ActionIcon, Collapse, Menu, TextInput, Tooltip } from '@mantine-vue/core'
import { useDebouncedValue } from '@mantine-vue/hooks'
import { defineComponent, h, ref, watch, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_FilterOptionMenu } from '../menus/MVT_FilterOptionMenu'
import classes from './MVT_GlobalFilterTextInput.module.css'

export const MVT_GlobalFilterTextInput = defineComponent({
  name: 'MVTGlobalFilterTextInput',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    const searchValue = ref(props.table.getState().globalFilter ?? '')
    const [debounced] = useDebouncedValue(
      searchValue,
      props.table.options.manualFiltering ? 500 : 250,
    )
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
    return () => {
      const { table } = props
      const o = table.options
      const inputProps = {
        ...parseFromValuesOrFunc(o.mantineSearchTextInputProps, { table }),
        ...attrs,
      } as Record<string, any>

      return h(
        Collapse,
        { class: classes.collapse, expanded: table.getState().showGlobalFilter } as any,
        () => [
          o.enableGlobalFilterModes &&
            h(Menu, { withinPortal: true }, () => [
              h(Menu.Target, null, () =>
                h(
                  ActionIcon,
                  {
                    'aria-label': o.localization.changeSearchMode,
                    color: 'gray',
                    size: 'sm',
                    variant: 'transparent',
                  },
                  () => h(o.icons.IconSearch),
                ),
              ),
              h(MVT_FilterOptionMenu, { table, onSelect: clear }),
            ]),
          h(TextInput, {
            leftSection: !o.enableGlobalFilterModes ? h(o.icons.IconSearch) : undefined,
            mt: 0,
            mx: o.positionGlobalFilter !== 'left' ? 'mx' : undefined,
            placeholder: o.localization.search,
            value: searchValue.value,
            variant: 'filled',
            ...inputProps,
            class: clsx('mvt-global-filter-text-input', classes.root, inputProps.class),
            onInput: (event: Event | string) => {
              searchValue.value =
                typeof event === 'string' ? event : (event.target as HTMLInputElement).value
              inputProps.onChange?.(event)
            },
            rightSection: h(
              ActionIcon,
              {
                'aria-label': o.localization.clearSearch,
                color: 'gray',
                disabled: !searchValue.value.length,
                hidden: !searchValue.value,
                size: 'sm',
                style: { visibility: !searchValue.value ? 'hidden' : undefined },
                variant: 'transparent',
                onClick: clear,
              },
              () =>
                h(Tooltip, { label: o.localization.clearSearch, withinPortal: true }, () =>
                  h(o.icons.IconX),
                ),
            ),
            ref: (el: any) => {
              const node = (el?.$el?.querySelector?.('input') ?? el?.$el ?? el) as HTMLInputElement
              if (node) table.refs.searchInputRef.value = node
            },
          } as any),
        ],
      )
    }
  },
})
