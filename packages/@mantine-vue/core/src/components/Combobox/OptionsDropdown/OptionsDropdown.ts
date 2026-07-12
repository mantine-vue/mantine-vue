import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import type { Primitive } from '../../../core'
import { CheckIcon } from '../../Checkbox'
import { ScrollAreaAutosize } from '../../ScrollArea'
import { Combobox } from '../Combobox'
import { useComboboxContext } from '../Combobox.context'
import type {
  ComboboxLikeRenderOptionInput,
  ComboboxParsedItem,
  OptionsFilter,
} from '../Combobox.types'
import {
  defaultOptionsFilter,
  isEmptyComboboxData,
  isOptionsGroup,
  validateOptions,
} from '../data-utils'
import classes from '../Combobox.module.css'

export type OptionsData = ComboboxParsedItem<Primitive>[]
export interface OptionsDropdownProps {
  data: OptionsData
  filter?: OptionsFilter<Primitive>
  search?: string
  limit?: number
  withScrollArea?: boolean
  maxDropdownHeight?: number | string
  floatingHeight?: 'viewport'
  hidden?: boolean
  hiddenWhenEmpty?: boolean
  filterOptions?: boolean
  withCheckIcon?: boolean
  withAlignedLabels?: boolean
  value?: Primitive | Primitive[] | null
  checkIconPosition?: 'left' | 'right'
  nothingFoundMessage?: any
  unstyled?: boolean
  labelId?: string
  'aria-label'?: string
  renderOption?: (input: ComboboxLikeRenderOptionInput<any>) => any
  scrollAreaProps?: Record<string, any>
}

export interface OptionsDropdownSlots {
  renderOption?: (input: ComboboxLikeRenderOptionInput<any>) => VNodeChild
  nothingFound?: () => VNodeChild
}
const checked = (value: Primitive | Primitive[] | null | undefined, option: Primitive) =>
  Array.isArray(value) ? value.includes(option) : value === option
function renderItem(item: ComboboxParsedItem<Primitive>, props: OptionsDropdownProps): any {
  if (isOptionsGroup(item))
    return h(Combobox.Group, { label: item.group }, () =>
      item.items.map((child) => renderItem(child, props)),
    )
  const isChecked = checked(props.value, item.value)
  const check = props.withCheckIcon
    ? isChecked
      ? h(CheckIcon, { class: classes.optionsDropdownCheckIcon })
      : props.withAlignedLabels
        ? h('span', { class: classes.optionsDropdownCheckPlaceholder })
        : null
    : null
  const content = props.renderOption?.({ option: item, checked: isChecked }) ?? [
    props.checkIconPosition === 'left' && check,
    h('span', item.label),
    props.checkIconPosition !== 'left' && check,
  ]
  return h(
    Combobox.Option,
    {
      value: item.value,
      disabled: item.disabled,
      active: isChecked,
      class: !props.unstyled && classes.optionsDropdownOption,
      'data-reverse': props.checkIconPosition === 'right' || undefined,
      'data-checked': isChecked || undefined,
      'aria-selected': isChecked,
    },
    () => content,
  )
}
export const OptionsDropdown = defineComponent({
  name: 'OptionsDropdown',
  inheritAttrs: false,
  slots: Object as SlotsType<OptionsDropdownSlots>,
  props: {
    data: { type: Array as PropType<OptionsData>, required: true },
    filter: Function as PropType<OptionsFilter<Primitive>>,
    search: String,
    limit: Number,
    withScrollArea: { type: Boolean, default: true },
    maxDropdownHeight: [Number, String],
    floatingHeight: String as PropType<'viewport'>,
    hidden: Boolean,
    hiddenWhenEmpty: Boolean,
    filterOptions: { type: Boolean, default: true },
    withCheckIcon: Boolean,
    withAlignedLabels: Boolean,
    value: { type: [String, Number, Boolean, Array] as PropType<any>, default: null },
    checkIconPosition: { type: String as PropType<'left' | 'right'>, default: 'left' },
    nothingFoundMessage: { type: null as unknown as PropType<any>, default: undefined },
    unstyled: Boolean,
    labelId: String,
    ariaLabel: String,
    renderOption: Function as PropType<any>,
    scrollAreaProps: Object,
  },
  setup(props, { slots }) {
    const ctx = useComboboxContext()

    return () => {
      validateOptions(props.data)
      const renderOption =
        props.renderOption ??
        (slots.renderOption ? (input: any) => slots.renderOption!(input) : undefined)
      const nothingFound =
        props.nothingFoundMessage ?? (slots.nothingFound ? slots.nothingFound() : undefined)
      const data =
        typeof props.search === 'string'
          ? (props.filter || defaultOptionsFilter)({
              options: props.data,
              search: props.filterOptions ? props.search : '',
              limit: props.limit ?? Infinity,
            })
          : props.data
      const empty = isEmptyComboboxData(data)
      const options = data.map((item) => renderItem(item, { ...props, renderOption } as any))
      const content = props.withScrollArea
        ? h(
            ScrollAreaAutosize,
            {
              mah:
                (props.floatingHeight ?? ctx.floatingHeight) === 'viewport'
                  ? 'var(--combobox-floating-options-max-height)'
                  : (props.maxDropdownHeight ?? 220),
              type: 'scroll',
              scrollbarSize: 'var(--combobox-padding)',
              offsetScrollbars: 'y',
              ...props.scrollAreaProps,
            },
            () => options,
          )
        : options
      return h(
        Combobox.Dropdown,
        { hidden: props.hidden || (props.hiddenWhenEmpty && empty), 'data-composed': '' },
        () =>
          h(Combobox.Options, { labelledBy: props.labelId, 'aria-label': props.ariaLabel }, () => [
            content,
            empty && nothingFound != null && h(Combobox.Empty, null, () => nothingFound),
          ]),
      )
    }
  },
})
