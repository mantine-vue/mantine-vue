import { computed, defineComponent, h, nextTick, ref, watch, type PropType } from 'vue'
import type { Primitive } from '../../core'
import { useId } from '@mantine-vue/hooks'
import {
  Combobox,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
  type ComboboxData,
  type ComboboxItem,
  type OptionsFilter,
} from '../Combobox'
import { InputBase } from '../InputBase'

export interface SelectProps<Value extends Primitive = string> {
  modelValue?: Value | null
  value?: Value | null
  defaultValue?: Value | null
  onChange?: (value: Value | null, option: ComboboxItem<Value> | null) => void
  data?: ComboboxData<Value>
  searchable?: boolean
  searchValue?: string
  defaultSearchValue?: string
  onSearchChange?: (value: string) => void
  allowDeselect?: boolean
  clearable?: boolean
  onClear?: () => void
  withCheckIcon?: boolean
  withAlignedLabels?: boolean
  checkIconPosition?: 'left' | 'right'
  nothingFoundMessage?: any
  filter?: OptionsFilter<Value>
  limit?: number
  dropdownOpened?: boolean
  defaultDropdownOpened?: boolean
  onDropdownOpen?: () => void
  onDropdownClose?: () => void
  selectFirstOptionOnChange?: boolean
  selectFirstOptionOnDropdownOpen?: boolean
  onOptionSubmit?: (value: Value) => void
  withScrollArea?: boolean
  maxDropdownHeight?: number | string
  comboboxProps?: Record<string, any>
  hiddenInputProps?: Record<string, any>
  renderOption?: (input: any) => any
  scrollAreaProps?: Record<string, any>
  autoSelectOnBlur?: boolean
  openOnFocus?: boolean
  clearSectionMode?: 'both' | 'rightSection' | 'clear'
  chevronColor?: string
  [key: string]: any
}
export type SelectStylesNames = string

export const Select = defineComponent({
  name: 'Select',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as any, default: undefined },
    value: { type: null as any, default: undefined },
    defaultValue: { type: null as any, default: null },
    onChange: Function as PropType<(value: any, option: any) => void>,
    data: { type: Array as PropType<ComboboxData<any>>, default: () => [] },
    searchable: Boolean,
    searchValue: { type: String, default: undefined },
    defaultSearchValue: String,
    onSearchChange: Function as PropType<(value: string) => void>,
    allowDeselect: { type: Boolean, default: true },
    clearable: Boolean,
    onClear: Function as PropType<() => void>,
    withCheckIcon: { type: Boolean, default: true },
    withAlignedLabels: Boolean,
    checkIconPosition: { type: String as PropType<'left' | 'right'>, default: 'left' },
    nothingFoundMessage: { default: undefined },
    filter: Function as PropType<any>,
    limit: Number,
    dropdownOpened: { type: Boolean, default: undefined },
    defaultDropdownOpened: Boolean,
    onDropdownOpen: Function as PropType<() => void>,
    onDropdownClose: Function as PropType<() => void>,
    selectFirstOptionOnChange: Boolean,
    selectFirstOptionOnDropdownOpen: Boolean,
    onOptionSubmit: Function as PropType<(value: any) => void>,
    withScrollArea: { type: Boolean, default: true },
    maxDropdownHeight: [Number, String],
    comboboxProps: Object,
    hiddenInputProps: Object,
    renderOption: Function as PropType<any>,
    scrollAreaProps: Object,
    autoSelectOnBlur: Boolean,
    openOnFocus: { type: Boolean, default: true },
    clearSectionMode: {
      type: String as PropType<'both' | 'rightSection' | 'clear'>,
      default: undefined,
    },
    chevronColor: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'update:searchValue'],
  setup(props, { attrs, emit }) {
    const parsed = computed(() => getParsedComboboxData(props.data))
    const lockup = computed(() => getOptionsLockup(parsed.value))
    const retained: Record<string, ComboboxItem<any>> = {}
    const internal = ref(props.defaultValue)
    const controlled = () => props.modelValue !== undefined || props.value !== undefined
    const current = () =>
      props.modelValue !== undefined
        ? props.modelValue
        : props.value !== undefined
          ? props.value
          : internal.value
    const selected = computed(() =>
      current() != null
        ? (lockup.value[String(current())] ?? retained[String(current())])
        : undefined,
    )
    const internalSearch = ref(props.defaultSearchValue ?? selected.value?.label ?? '')
    const searchControlled = () => props.searchValue !== undefined
    const search = () => props.searchValue ?? internalSearch.value
    const setSearch = (value: string) => {
      if (!searchControlled()) internalSearch.value = value
      props.onSearchChange?.(value)
      emit('update:searchValue', value)
      combobox.resetSelectedOption()
    }
    const changeValue = (value: any, option: ComboboxItem<any> | null) => {
      if (!controlled()) internal.value = value
      props.onChange?.(value, option)
      emit('update:modelValue', value)
    }
    const combobox = useCombobox({
      opened: () => props.dropdownOpened,
      defaultOpened: props.defaultDropdownOpened,
      onDropdownOpen: () => {
        props.onDropdownOpen?.()
        nextTick(() =>
          props.selectFirstOptionOnDropdownOpen
            ? combobox.selectFirstOption()
            : combobox.updateSelectedOptionIndex('active', { scrollIntoView: true }),
        )
      },
      onDropdownClose: () => {
        props.onDropdownClose?.()
        setTimeout(combobox.resetSelectedOption)
      },
    })
    watch(
      [() => current(), lockup],
      () => {
        const value = current()
        if (value != null && lockup.value[String(value)])
          retained[String(value)] = lockup.value[String(value)]
        if (!searchControlled())
          internalSearch.value =
            value == null
              ? ''
              : ((lockup.value[String(value)] ?? retained[String(value)])?.label ?? '')
      },
      { immediate: true },
    )
    watch(
      () => search(),
      () => {
        if (props.selectFirstOptionOnChange) nextTick(combobox.selectFirstOption)
      },
    )
    const id = useId((attrs as any).id)
    const clear = (event?: MouseEvent) => {
      event?.stopPropagation()
      changeValue(null, null)
      setSearch('')
      props.onClear?.()
    }
    return () => {
      const disabled = !!(attrs as any).disabled
      const readOnly = !!(attrs as any).readOnly
      const clearable = props.clearable && current() != null && !disabled && !readOnly
      const forwarded = { ...attrs }
      delete forwarded.id
      delete forwarded.name
      delete forwarded.form
      delete forwarded.rightSection
      delete forwarded.clearButtonProps
      delete forwarded.clearSectionMode
      delete forwarded.chevronColor
      return [
        h(
          Combobox,
          {
            store: combobox,
            __staticSelector: 'Select',
            readOnly,
            size: (attrs as any).size ?? 'sm',
            onOptionSubmit: (value: string) => {
              props.onOptionSubmit?.(lockup.value[value]?.value)
              const option =
                props.allowDeselect && String(current()) === String(value)
                  ? null
                  : lockup.value[value]
              const next = option?.value ?? null
              if (next !== current()) changeValue(next, option ?? null)
              if (!searchControlled()) internalSearch.value = option?.label ?? ''
              combobox.closeDropdown()
            },
            ...props.comboboxProps,
          },
          () => [
            h(
              Combobox.Target,
              {
                targetType: props.searchable ? 'input' : 'button',
                withExpandedAttribute: true,
                autoComplete: (attrs as any).autoComplete,
              },
              () =>
                h(InputBase, {
                  ...forwarded,
                  id: id.value,
                  __defaultRightSection: h(Combobox.Chevron, {
                    size: (attrs as any).size ?? 'sm',
                    error: (attrs as any).error,
                    color: props.chevronColor,
                    unstyled: (attrs as any).unstyled,
                  }),
                  __clearSection: h(Combobox.ClearButton, {
                    ...(attrs as any).clearButtonProps,
                    onClick: clear,
                  }),
                  __clearable: clearable,
                  __clearSectionMode: props.clearSectionMode,
                  __staticSelector: 'Select',
                  component: 'input',
                  disabled,
                  readOnly: readOnly || !props.searchable,
                  pointer: !props.searchable,
                  value: search(),
                  rightSection: (attrs as any).rightSection,
                  rightSectionPointerEvents: (attrs as any).rightSectionPointerEvents || 'none',
                  onInput: (event: Event) => {
                    setSearch((event.currentTarget as HTMLInputElement).value)
                    combobox.openDropdown()
                  },
                  onFocus: (event: FocusEvent) => {
                    if (props.openOnFocus && props.searchable) combobox.openDropdown()
                    ;(attrs as any).onFocus?.(event)
                  },
                  onBlur: (event: FocusEvent) => {
                    if (props.autoSelectOnBlur) combobox.clickSelectedOption()
                    if (props.searchable) combobox.closeDropdown()
                    setSearch(selected.value?.label ?? '')
                    ;(attrs as any).onBlur?.(event)
                  },
                  onClick: (event: MouseEvent) => {
                    if (props.searchable) combobox.openDropdown()
                    else combobox.toggleDropdown()
                    ;(attrs as any).onClick?.(event)
                  },
                }),
            ),
            h(OptionsDropdown, {
              data: parsed.value as any,
              hidden: readOnly || disabled,
              filter: props.filter,
              search: search(),
              limit: props.limit,
              hiddenWhenEmpty: !props.nothingFoundMessage,
              withScrollArea: props.withScrollArea,
              maxDropdownHeight: props.maxDropdownHeight,
              filterOptions: !!props.searchable && selected.value?.label !== search(),
              value: current(),
              checkIconPosition: props.checkIconPosition,
              withCheckIcon: props.withCheckIcon,
              withAlignedLabels: props.withAlignedLabels,
              nothingFoundMessage: props.nothingFoundMessage,
              labelId: (attrs as any).label ? `${id.value}-label` : undefined,
              renderOption: props.renderOption,
              scrollAreaProps: props.scrollAreaProps,
            }),
          ],
        ),
        h(Combobox.HiddenInput, {
          value: current(),
          name: (attrs as any).name,
          form: (attrs as any).form,
          disabled,
          ...props.hiddenInputProps,
        }),
      ]
    }
  },
})
Object.assign(Select, { classes: { ...InputBase.classes, ...Combobox.classes } })
