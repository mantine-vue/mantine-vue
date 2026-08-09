<script lang="ts">
import { h, type VNodeChild } from 'vue'
import type { Primitive } from '../../../core'
import { CheckIcon } from '../../Checkbox'
import { ComboboxGroup, ComboboxOption } from '../Combobox'
import type { ComboboxParsedItem } from '../Combobox.types'
import { isOptionsGroup } from '../data-utils'
import type { OptionsDropdownProps } from './OptionsDropdown.types'
import classes from '../Combobox.module.css'

/** Single mode compares by value, multiple mode by membership. */
const checked = (value: Primitive | Primitive[] | null | undefined, option: Primitive) =>
  Array.isArray(value) ? value.includes(option) : value === option

/**
 * Renders one parsed item, recursing into groups.
 *
 * Kept as a plain function rather than a component: it walks an arbitrarily nested
 * structure and has to be able to return either a group or an option.
 */
function renderItem(item: ComboboxParsedItem<Primitive>, props: OptionsDropdownProps): VNodeChild {
  if (isOptionsGroup(item)) {
    return h(ComboboxGroup, { label: item.group }, () =>
      item.items.map((child) => renderItem(child, props)),
    )
  }

  const isChecked = checked(props.value, item.value)

  // `withAlignedLabels` keeps the icon's space so the labels of unchecked options do not
  // shift relative to the checked ones.
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
    ComboboxOption,
    {
      key: String(item.value),
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

export { checked, renderItem }
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ScrollAreaAutosize } from '../../ScrollArea'
import { ComboboxDropdown, ComboboxEmpty, ComboboxOptions } from '../Combobox'
import { useComboboxContext } from '../Combobox.context'
import { defaultOptionsFilter, isEmptyComboboxData, validateOptions } from '../data-utils'
import type { OptionsDropdownSlots } from './OptionsDropdown.types'

defineOptions({
  name: 'OptionsDropdown',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<OptionsDropdownProps>(), {
  withScrollArea: true,
  hidden: false,
  hiddenWhenEmpty: false,
  filterOptions: true,
  withCheckIcon: false,
  withAlignedLabels: false,
  value: null,
  checkIconPosition: 'left',
  nothingFoundMessage: undefined,
  unstyled: false,
})

defineSlots<OptionsDropdownSlots>()

const slots = useSlots()
const ctx = useComboboxContext()

/** The slot takes precedence over the prop. */
const renderOption = computed(
  () =>
    (slots.renderOption ? (input: any) => slots.renderOption!(input) : undefined) ??
    props.renderOption,
)

const nothingFound = computed(() => {
  const nothingFoundSlot = slots.nothingFoundMessage ?? slots.nothingFound
  return (nothingFoundSlot ? nothingFoundSlot() : undefined) ?? props.nothingFoundMessage
})

/**
 * `search` being a string is what enables filtering at all – `Select` passes it only
 * while the dropdown is searchable. `filterOptions` then decides whether the search is
 * actually applied or the consumer has already filtered the data.
 */
const data = computed(() => {
  validateOptions(props.data)

  return typeof props.search === 'string'
    ? (props.filter || defaultOptionsFilter)({
        options: props.data,
        search: props.filterOptions ? props.search : '',
        limit: props.limit ?? Infinity,
      })
    : props.data
})

const empty = computed(() => isEmptyComboboxData(data.value))

const dropdownHidden = computed(() => props.hidden || (props.hiddenWhenEmpty && empty.value))

const scrollAreaBindings = computed<Record<string, any>>(() => ({
  mah:
    (props.floatingHeight ?? ctx.floatingHeight) === 'viewport'
      ? 'var(--combobox-floating-options-max-height)'
      : (props.maxDropdownHeight ?? 220),
  type: 'scroll',
  scrollbarSize: 'var(--combobox-padding)',
  offsetScrollbars: 'y',
  ...props.scrollAreaProps,
}))

/** Rendered through `<component :is>`: groups nest arbitrarily deep. */
const renderOptions = (): VNodeChild =>
  data.value.map((item) => renderItem(item, { ...props, renderOption: renderOption.value } as any))

/** `nothingFound` is renderable content, which cannot be interpolated as text. */
const renderNothingFound = () => nothingFound.value as VNodeChild
</script>

<template>
  <ComboboxDropdown :hidden="dropdownHidden" data-composed="">
    <ComboboxOptions :labelled-by="props.labelId" :aria-label="props.ariaLabel">
      <ScrollAreaAutosize v-if="props.withScrollArea" v-bind="scrollAreaBindings">
        <component :is="renderOptions" />
      </ScrollAreaAutosize>
      <component :is="renderOptions" v-else />

      <ComboboxEmpty v-if="empty && nothingFound != null">
        <component :is="renderNothingFound" />
      </ComboboxEmpty>
    </ComboboxOptions>
  </ComboboxDropdown>
</template>
