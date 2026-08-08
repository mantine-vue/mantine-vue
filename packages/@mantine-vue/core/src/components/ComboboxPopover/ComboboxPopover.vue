<script setup lang="ts">
import { computed, h, useAttrs, useSlots, type VNodeChild } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { hasNode, resolveNode, type Primitive } from '../../core'
import {
  Combobox,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxHiddenInput,
  ComboboxOptions,
  ComboboxSearch,
  OptionsDropdown,
  defaultOptionsFilter,
  getOptionsLockup,
  getParsedComboboxData,
  isEmptyComboboxData,
  useCombobox,
  type ComboboxItem,
  type ComboboxLikeRenderOptionInput,
  type ComboboxParsedItem,
  type OptionsFilter,
} from '../Combobox'
import { ScrollAreaAutosize } from '../ScrollArea'
import { renderPopoverOption, type RenderOptionOptions } from './render-popover-option'
import type { ComboboxPopoverProps, ComboboxPopoverSlots } from './ComboboxPopover.types'

defineOptions({
  name: 'ComboboxPopover',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxPopoverProps<boolean, any>>(), {
  multiple: undefined,
  modelValue: undefined,
  defaultValue: undefined,
  dropdownOpened: undefined,
  defaultDropdownOpened: undefined,
  withScrollArea: undefined,
  selectFirstOptionOnDropdownOpen: undefined,
  withAlignedLabels: undefined,
  nothingFoundMessage: undefined,
  searchable: undefined,
  searchValue: undefined,
  withCheckIcon: true,
  allowDeselect: true,
  checkIconPosition: 'left',
  hiddenInputValuesDivider: ',',
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
  'dropdown-open': []
  'dropdown-close': []
  'option-submit': [value: any]
  'search-change': [value: string]
}>()

defineSlots<ComboboxPopoverSlots>()

const slots = useSlots()
const attrs = useAttrs()

const parsedData = computed(() => getParsedComboboxData(props.data))
const optionsLockup = computed(() => getOptionsLockup(parsedData.value))

const [currentValue, setValue] = useUncontrolled<any>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: props.multiple ? [] : null,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const [searchValue, setSearchValue] = useUncontrolled<string>({
  value: () => props.searchValue,
  defaultValue: props.defaultSearchValue,
  finalValue: '',
  onChange: (val) => emit('search-change', val),
})

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  defaultOpened: props.defaultDropdownOpened,
  onDropdownOpen: () => {
    emit('dropdown-open')

    // The search field lives inside the dropdown, so it can only be focused once open.
    if (props.searchable) {
      combobox.focusSearchInput()
    }

    if (props.selectFirstOptionOnDropdownOpen) {
      combobox.selectFirstOption()
    }
  },
  onDropdownClose: () => {
    emit('dropdown-close')
    combobox.resetSelectedOption()

    // Focus was inside the dropdown, so it has to be handed back to the target.
    if (props.searchable) {
      combobox.focusTarget()
    }
  },
})

function handleSearchChange(val: string) {
  setSearchValue(val)
  combobox.resetSelectedOption()
}

function handleOptionSubmit(val: string) {
  emit('option-submit', val)
  const option = optionsLockup.value[val]

  if (props.multiple) {
    const current = Array.isArray(currentValue.value) ? currentValue.value : []

    // Submitting an already selected option removes it, so the dropdown doubles as a
    // toggle list and stays open.
    if (current.includes(option.value)) {
      setValue(current.filter((v: any) => v !== option.value))
    } else {
      setValue([...current, option.value])
    }

    combobox.updateSelectedOptionIndex('selected')
  } else {
    const nextValue =
      props.allowDeselect && String(option.value) === String(currentValue.value)
        ? null
        : option.value
    setValue(nextValue)
    combobox.closeDropdown()
  }

  if (props.searchable) {
    handleSearchChange('')
  }
}

/** The prop wins over the slots, and `renderOption` wins over its `option` alias. */
const resolvedRenderOption = computed(
  () =>
    (props.renderOption as
      | ((input: ComboboxLikeRenderOptionInput<ComboboxItem>) => VNodeChild)
      | undefined) ??
    ((slots.renderOption ?? slots.option)
      ? (input: ComboboxLikeRenderOptionInput<ComboboxItem>) =>
          (slots.renderOption ?? slots.option)!(input)
      : undefined),
)

const nothingFound = computed<VNodeChild>(() =>
  resolveNode(props.nothingFoundMessage, slots.nothingFoundMessage ?? slots.nothingFound),
)

/**
 * Held in a computed rather than cast inline: a union assertion in a template is parsed
 * as a Vue 2 filter and rejected by `vue/no-deprecated-filter`.
 */
const optionsFilter = computed(() => props.filter as OptionsFilter<Primitive> | undefined)

const comboboxBindings = computed(() => ({
  store: combobox,
  __staticSelector: 'ComboboxPopover',
  classNames: props.classNames,
  styles: props.styles,
  unstyled: props.unstyled,
  onOptionSubmit: handleOptionSubmit,
  ...props.comboboxProps,
  ...attrs,
}))

/**
 * Rendered through `<component :is>`: the searchable dropdown composes the search field,
 * the scroll area and an arbitrarily nested option tree, which is not expressible as
 * markup.
 */
const renderSearchableDropdown = (): VNodeChild => {
  const filteredData = (props.filter || defaultOptionsFilter)({
    options: parsedData.value as ComboboxParsedItem<Primitive>[],
    search: searchValue.value,
    limit: props.limit ?? Infinity,
  })
  const isEmpty = isEmptyComboboxData(filteredData)

  const optionOpts: RenderOptionOptions = {
    value: currentValue.value,
    withCheckIcon: props.withCheckIcon,
    withAlignedLabels: props.withAlignedLabels,
    checkIconPosition: props.checkIconPosition,
    unstyled: props.unstyled,
    renderOption: resolvedRenderOption.value,
  }

  const options = filteredData.map((item, index) => renderPopoverOption(item, optionOpts, index))

  return h(ComboboxDropdown, { 'data-composed': true }, () => [
    h(ComboboxSearch, {
      value: searchValue.value,
      placeholder: 'Search...',
      onInput: (event: Event) => {
        handleSearchChange((event.target as HTMLInputElement).value)
      },
    }),
    h(ComboboxOptions, null, () => [
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
            } as Record<string, any>,
            () => options,
          ),
      isEmpty && hasNode(nothingFound.value)
        ? h(ComboboxEmpty, null, () => nothingFound.value)
        : null,
    ]),
  ])
}
</script>

<template>
  <Combobox v-bind="comboboxBindings">
    <slot />

    <component :is="renderSearchableDropdown" v-if="props.searchable" />
    <!--
      The non-searchable dropdown reuses the shared `OptionsDropdown`. Filtering is off:
      without a search field there is nothing to filter by.
    -->
    <OptionsDropdown
      v-else
      :data="parsedData as any"
      :filter="optionsFilter"
      :search="undefined"
      :limit="props.limit"
      :hidden-when-empty="!hasNode(nothingFound)"
      :with-scroll-area="props.withScrollArea"
      :max-dropdown-height="props.maxDropdownHeight"
      :filter-options="false"
      :value="currentValue"
      :check-icon-position="props.checkIconPosition"
      :with-check-icon="props.withCheckIcon"
      :with-aligned-labels="props.withAlignedLabels"
      :nothing-found-message="nothingFound"
      :unstyled="props.unstyled"
      :render-option="resolvedRenderOption as any"
      :scroll-area-props="props.scrollAreaProps"
    />
  </Combobox>

  <ComboboxHiddenInput
    v-bind="props.hiddenInputProps"
    :name="props.name"
    :value="currentValue"
    :form="props.form"
    :values-divider="props.hiddenInputValuesDivider"
  />
</template>
