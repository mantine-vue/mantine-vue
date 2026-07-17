import {
  computed,
  defineComponent,
  Fragment,
  h,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { hasNode, resolveNode, type MantineNode, type Primitive } from '../../core'
import { CheckIcon } from '../Checkbox'
import {
  Combobox,
  defaultOptionsFilter,
  getOptionsLockup,
  getParsedComboboxData,
  isEmptyComboboxData,
  isOptionsGroup,
  OptionsDropdown,
  useCombobox,
  type ComboboxData,
  type ComboboxItem,
  type ComboboxLikeRenderOptionInput,
  type ComboboxParsedItem,
  type ComboboxProps,
  type ComboboxStylesNames,
  type OptionsFilter,
} from '../Combobox'
import { ScrollAreaAutosize } from '../ScrollArea'
import { ComboboxPopoverTarget } from './ComboboxPopoverTarget'
import type { ComboboxPopoverValue } from './ComboboxPopover.types'
import comboboxClasses from '../Combobox/Combobox.module.css'

export type ComboboxPopoverStylesNames = ComboboxStylesNames

export interface ComboboxPopoverProps<
  Multiple extends boolean = false,
  Value extends Primitive = string,
> {
  /** If set, multiple items can be selected at the same time */
  multiple?: Multiple

  /** Controlled component value */
  value?: ComboboxPopoverValue<Multiple, Value>

  /** Uncontrolled component default value */
  defaultValue?: ComboboxPopoverValue<Multiple, Value>

  /** Called when value changes */
  onChange?: (value: ComboboxPopoverValue<Multiple, Value>) => void

  /** Data used to generate options */
  data?: ComboboxData<Value>

  /** Controlled dropdown opened state */
  dropdownOpened?: boolean

  /** Uncontrolled dropdown initial opened state */
  defaultDropdownOpened?: boolean

  /** Called when dropdown opens */
  onDropdownOpen?: () => void

  /** Called when dropdown closes */
  onDropdownClose?: () => void

  /** Called when option is submitted from dropdown with mouse click or Enter key */
  onOptionSubmit?: (value: Value) => void

  /** Props passed down to Combobox component */
  comboboxProps?: ComboboxProps

  /** Function based on which items are filtered and sorted */
  filter?: OptionsFilter<Value>

  /** Maximum number of options displayed at a time @default Infinity */
  limit?: number

  /** Determines whether the options should be wrapped with ScrollArea.AutoSize @default true */
  withScrollArea?: boolean

  /** max-height of the dropdown @default 250 */
  maxDropdownHeight?: number | string

  /** If set, the first option is selected when dropdown opens @default false */
  selectFirstOptionOnDropdownOpen?: boolean

  /** Displays check icon near the selected option label @default true */
  withCheckIcon?: boolean

  /** Aligns unchecked labels with the checked one @default false */
  withAlignedLabels?: boolean

  /** Position of the check icon relative to the option label @default 'left' */
  checkIconPosition?: 'left' | 'right'

  /** Message displayed when no options match the search query or when there is no data. Can also be provided via the `#nothingFound` slot */
  nothingFoundMessage?: MantineNode

  /** Allows searching through options @default false */
  searchable?: boolean

  /** Controlled search value */
  searchValue?: string

  /** Default search value */
  defaultSearchValue?: string

  /** Called when search changes */
  onSearchChange?: (value: string) => void

  /** Allows deselecting the selected option by clicking it (only for single mode) @default true */
  allowDeselect?: boolean

  /** A function to render content of the option, replaces the default content of the option. Can also be provided via the `#option` slot */
  renderOption?: (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild

  /** Props passed down to the underlying ScrollArea component in the dropdown */
  scrollAreaProps?: Record<string, any>

  /** Props passed down to the hidden input */
  hiddenInputProps?: Record<string, any>

  /** Hidden input name for form submission */
  name?: string

  /** Hidden input form for form submission */
  form?: string

  /** Divider used to separate values in the hidden input value attribute @default ',' */
  hiddenInputValuesDivider?: string

  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  [key: string]: any
}

export interface ComboboxPopoverSlots {
  /** Target element and any additional Combobox content */
  default?: () => VNodeChild
  /** Custom option content, alternative to the `renderOption` prop */
  option?: (input: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild
  /** Custom "nothing found" content, alternative to the `nothingFoundMessage` prop */
  nothingFound?: () => VNodeChild
}

const defaultProps = {
  withCheckIcon: true,
  allowDeselect: true,
  checkIconPosition: 'left',
  hiddenInputValuesDivider: ',',
}

function isValueChecked(
  value: Primitive | Primitive[] | undefined | null,
  optionValue: Primitive,
): boolean {
  return Array.isArray(value) ? value.includes(optionValue) : value === optionValue
}

interface RenderOptionOptions {
  value: Primitive | Primitive[] | null | undefined
  withCheckIcon: boolean | undefined
  withAlignedLabels: boolean | undefined
  checkIconPosition: 'left' | 'right' | undefined
  unstyled: boolean | undefined
  renderOption?: (input: ComboboxLikeRenderOptionInput<any>) => VNodeChild
}

function renderPopoverOption(
  data: ComboboxParsedItem<Primitive>,
  opts: RenderOptionOptions,
  index: number,
): VNodeChild {
  if (isOptionsGroup(data)) {
    return h(Combobox.Group, { label: data.group, key: `group-${data.group ?? index}` }, () =>
      data.items.map((item, i) => renderPopoverOption(item, opts, i)),
    )
  }

  const checked = isValueChecked(opts.value, data.value)
  const check =
    opts.withCheckIcon &&
    (checked
      ? h(CheckIcon, { class: comboboxClasses.optionsDropdownCheckIcon })
      : opts.withAlignedLabels
        ? h('div', { class: comboboxClasses.optionsDropdownCheckPlaceholder })
        : null)

  const content =
    typeof opts.renderOption === 'function'
      ? opts.renderOption({ option: data, checked })
      : [
          opts.checkIconPosition === 'left' && check,
          h('span', data.label),
          opts.checkIconPosition === 'right' && check,
        ]

  return h(
    Combobox.Option,
    {
      value: data.value,
      disabled: data.disabled,
      active: checked,
      key: String(data.value),
      class: !opts.unstyled ? comboboxClasses.optionsDropdownOption : undefined,
      'data-reverse': opts.checkIconPosition === 'right' || undefined,
      'data-checked': checked || undefined,
      'aria-selected': checked,
    },
    () => content,
  )
}

export const ComboboxPopoverBase = defineComponent({
  name: 'ComboboxPopover',
  inheritAttrs: false,
  slots: Object as SlotsType<ComboboxPopoverSlots>,
  props: {
    multiple: { type: Boolean, default: undefined },
    value: { type: null as unknown as PropType<any>, default: undefined },
    defaultValue: { type: null as unknown as PropType<any>, default: undefined },
    onChange: { type: Function as PropType<(value: any) => void>, default: undefined },
    data: { type: Array as unknown as PropType<ComboboxData<Primitive>>, default: undefined },
    dropdownOpened: { type: Boolean, default: undefined },
    defaultDropdownOpened: { type: Boolean, default: undefined },
    onDropdownOpen: { type: Function as PropType<() => void>, default: undefined },
    onDropdownClose: { type: Function as PropType<() => void>, default: undefined },
    onOptionSubmit: { type: Function as PropType<(value: any) => void>, default: undefined },
    comboboxProps: { type: Object as PropType<ComboboxProps>, default: undefined },
    filter: { type: Function as PropType<OptionsFilter<Primitive>>, default: undefined },
    limit: { type: Number, default: undefined },
    withScrollArea: { type: Boolean, default: undefined },
    maxDropdownHeight: { type: [Number, String], default: undefined },
    selectFirstOptionOnDropdownOpen: { type: Boolean, default: undefined },
    withCheckIcon: { type: Boolean, default: undefined },
    withAlignedLabels: { type: Boolean, default: undefined },
    checkIconPosition: {
      type: String as PropType<'left' | 'right'>,
      default: undefined,
    },
    nothingFoundMessage: { type: null as unknown as PropType<MantineNode>, default: undefined },
    searchable: { type: Boolean, default: undefined },
    searchValue: { type: String, default: undefined },
    defaultSearchValue: { type: String, default: undefined },
    onSearchChange: { type: Function as PropType<(value: string) => void>, default: undefined },
    allowDeselect: { type: Boolean, default: undefined },
    renderOption: {
      type: Function as PropType<(item: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild>,
      default: undefined,
    },
    scrollAreaProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    name: { type: String, default: undefined },
    form: { type: String, default: undefined },
    hiddenInputValuesDivider: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = new Proxy(rawProps, {
      get(target, key: string) {
        const value = (target as any)[key]
        return value === undefined && key in defaultProps ? (defaultProps as any)[key] : value
      },
    }) as typeof rawProps

    const parsedData = computed(() => getParsedComboboxData(props.data))
    const optionsLockup = computed(() => getOptionsLockup(parsedData.value))

    const [_value, setValue] = useUncontrolled<any>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: props.multiple ? [] : null,
      onChange: (val) => props.onChange?.(val),
    })

    const [_searchValue, setSearchValue] = useUncontrolled<string>({
      value: () => props.searchValue,
      defaultValue: props.defaultSearchValue,
      finalValue: '',
      onChange: (val) => props.onSearchChange?.(val),
    })

    const combobox = useCombobox({
      opened: () => props.dropdownOpened,
      defaultOpened: props.defaultDropdownOpened,
      onDropdownOpen: () => {
        props.onDropdownOpen?.()
        if (props.searchable) {
          combobox.focusSearchInput()
        }
        if (props.selectFirstOptionOnDropdownOpen) {
          combobox.selectFirstOption()
        }
      },
      onDropdownClose: () => {
        props.onDropdownClose?.()
        combobox.resetSelectedOption()
        if (props.searchable) {
          combobox.focusTarget()
        }
      },
    })

    const handleSearchChange = (val: string) => {
      setSearchValue(val)
      combobox.resetSelectedOption()
    }

    const handleOptionSubmit = (val: string) => {
      props.onOptionSubmit?.(val as any)
      const option = optionsLockup.value[val]

      if (props.multiple) {
        const currentValue = Array.isArray(_value.value) ? _value.value : []
        if (currentValue.includes(option.value)) {
          setValue(currentValue.filter((v: any) => v !== option.value))
        } else {
          setValue([...currentValue, option.value])
        }
        combobox.updateSelectedOptionIndex('selected')
      } else {
        const nextValue =
          props.allowDeselect && String(option.value) === String(_value.value) ? null : option.value
        setValue(nextValue)
        combobox.closeDropdown()
      }

      if (props.searchable) {
        handleSearchChange('')
      }
    }

    const resolveRenderOption = () =>
      (props.renderOption as
        | ((input: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild)
        | undefined) ??
      (slots.option
        ? (input: ComboboxLikeRenderOptionInput<ComboboxItem>) => slots.option!(input)
        : undefined)

    const resolveNothingFound = (): VNodeChild =>
      resolveNode(props.nothingFoundMessage, slots.nothingFound)

    const renderSearchableDropdown = () => {
      const filteredData = (props.filter || defaultOptionsFilter)({
        options: parsedData.value as ComboboxParsedItem<Primitive>[],
        search: _searchValue.value,
        limit: props.limit ?? Infinity,
      })
      const isEmpty = isEmptyComboboxData(filteredData)
      const nothingFound = resolveNothingFound()
      const optionOpts: RenderOptionOptions = {
        value: _value.value,
        withCheckIcon: props.withCheckIcon,
        withAlignedLabels: props.withAlignedLabels,
        checkIconPosition: props.checkIconPosition,
        unstyled: props.unstyled,
        renderOption: resolveRenderOption(),
      }
      const options = filteredData.map((item, index) =>
        renderPopoverOption(item, optionOpts, index),
      )

      return h(Combobox.Dropdown, { 'data-composed': true }, () => [
        h(Combobox.Search, {
          value: _searchValue.value,
          placeholder: 'Search...',
          onInput: (event: Event) => {
            handleSearchChange((event.target as HTMLInputElement).value)
          },
        }),
        h(Combobox.Options, null, () => [
          props.withScrollArea === false
            ? options
            : h(
                ScrollAreaAutosize,
                {
                  mah: props.maxDropdownHeight ?? 220,
                  type: 'scroll',
                  scrollbarSize: 'var(--combobox-padding)',
                  offsetScrollbars: 'y',
                  ...props.scrollAreaProps,
                },
                () => options,
              ),
          isEmpty && hasNode(nothingFound) ? h(Combobox.Empty, null, () => nothingFound) : null,
        ]),
      ])
    }

    return () =>
      h(Fragment, null, [
        h(
          Combobox,
          {
            store: combobox,
            __staticSelector: 'ComboboxPopover',
            classNames: props.classNames,
            styles: props.styles,
            unstyled: props.unstyled,
            onOptionSubmit: handleOptionSubmit,
            ...props.comboboxProps,
            ...attrs,
          },
          () => {
            const nothingFound = resolveNothingFound()
            return [
              slots.default?.(),
              props.searchable
                ? renderSearchableDropdown()
                : h(OptionsDropdown, {
                    data: parsedData.value as any,
                    filter: props.filter as OptionsFilter<Primitive> | undefined,
                    search: undefined,
                    limit: props.limit,
                    hiddenWhenEmpty: !hasNode(nothingFound),
                    withScrollArea: props.withScrollArea,
                    maxDropdownHeight: props.maxDropdownHeight,
                    filterOptions: false,
                    value: _value.value,
                    checkIconPosition: props.checkIconPosition,
                    withCheckIcon: props.withCheckIcon,
                    withAlignedLabels: props.withAlignedLabels,
                    nothingFoundMessage: nothingFound,
                    unstyled: props.unstyled,
                    renderOption: resolveRenderOption() as any,
                    scrollAreaProps: props.scrollAreaProps,
                  }),
            ]
          },
        ),
        h(Combobox.HiddenInput, {
          name: props.name,
          value: _value.value,
          form: props.form,
          valuesDivider: props.hiddenInputValuesDivider,
          ...props.hiddenInputProps,
        }),
      ])
  },
})

export const ComboboxPopover = Object.assign(ComboboxPopoverBase, {
  classes: Combobox.classes,
  Target: ComboboxPopoverTarget,
})
