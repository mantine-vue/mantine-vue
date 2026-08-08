<script setup lang="ts">
import { computed, h, ref, useAttrs, useSlots, type VNodeChild } from 'vue'
import { Combobox, useCombobox } from '../Combobox'
import { InputBase } from '../InputBase'
import { Pill } from '../Pill'
import { PillsInput } from '../PillsInput'
import TreeSelectOption from './TreeSelectOption.vue'
import {
  allValues,
  buildLookup,
  displayChecked,
  filterData,
  flattenVisible,
  leafValues,
} from './tree-select-utils'
import type { TreeSelectProps, TreeSelectSlots } from './TreeSelect.types'
import classes from './TreeSelect.module.css'

defineOptions({
  name: 'TreeSelect',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeSelectProps<any>>(), {
  mode: 'single',
  modelValue: undefined,
  defaultValue: undefined,
  checkStrictly: false,
  checkedStrategy: 'child',
  defaultExpandAll: false,
  expandedValues: undefined,
  expandOnClick: false,
  searchable: false,
  searchValue: undefined,
  nothingFoundMessage: undefined,
  allowDeselect: true,
  clearable: false,
  maxValues: Infinity,
  maxDisplayedValues: undefined,
  maxDisplayedValuesContent: undefined,
  withLines: true,
  hiddenInputValuesDivider: ',',
  maxDropdownHeight: 220,
  dropdownOpened: undefined,
  defaultDropdownOpened: false,
  clearSearchOnChange: true,
  openOnFocus: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'update:searchValue': [value: string]
  change: [value: any]
  'expanded-change': [values: string[]]
  remove: [value: string]
  clear: []
  'dropdown-open': []
  'dropdown-close': []
}>()

defineSlots<TreeSelectSlots>()

const slots = useSlots()
const attrs = useAttrs()

const isMulti = () => props.mode !== 'single'

const initial = props.defaultValue !== undefined ? props.defaultValue : isMulti() ? [] : null
const internal = ref<any>(initial)
const current = () => (props.modelValue !== undefined ? props.modelValue : internal.value)
const setValue = (value: any) => {
  if (props.modelValue === undefined) internal.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

const initialExpanded = props.defaultExpandAll
  ? allValues(props.data)
  : (props.defaultExpandedValues ?? [])
const expandedInternal = ref<string[]>(initialExpanded)
const expanded = () => props.expandedValues ?? expandedInternal.value
const setExpanded = (values: string[]) => {
  if (props.expandedValues === undefined) expandedInternal.value = values
  emit('expanded-change', values)
}
const toggleExpand = (value: string) =>
  setExpanded(
    expanded().includes(value)
      ? expanded().filter((item) => item !== value)
      : [...expanded(), value],
  )

const nodes = computed(() => buildLookup(props.data))

const initialLabel = !isMulti() && current() ? String(nodes.value[current()]?.label ?? '') : ''
const internalSearch = ref(props.defaultSearchValue ?? initialLabel)
const search = () => props.searchValue ?? internalSearch.value
const setSearch = (value: string) => {
  if (props.searchValue === undefined) internalSearch.value = value
  emit('update:searchValue', value)
  combobox.resetSelectedOption()
}

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  defaultOpened: props.defaultDropdownOpened,
  onDropdownOpen: () => emit('dropdown-open'),
  onDropdownClose: () => {
    emit('dropdown-close')
    combobox.resetSelectedOption()
  },
})

const filtered = computed(() => {
  if (!props.searchable || !search()) return props.data

  if (props.mode === 'single' && current()) {
    const node = nodes.value[current() as string]
    if (node && search() === String(node.label)) return props.data
  }
  return filterData(props.data, search(), props.filter)
})

const renderExpandedSet = computed(() => {
  if (props.searchable && search() && filtered.value !== props.data) {
    return new Set<string>(allValues(filtered.value))
  }
  return new Set<string>(expanded())
})
const flat = computed(() => flattenVisible(filtered.value, renderExpandedSet.value))

const selectedArray = () => (Array.isArray(current()) ? (current() as string[]) : [])
const remove = (value: string) => {
  setValue(selectedArray().filter((item) => item !== value))
  emit('remove', value)
}

const submit = (value: string) => {
  const node = nodes.value[value]
  if (!node) return
  const hasChildren = !!(Array.isArray(node.children) && node.children.length > 0)

  if (props.mode === 'single') {
    // With expandOnClick: parent clicks only expand, not select
    if (props.expandOnClick && hasChildren) {
      toggleExpand(value)
      return
    }
    const next = props.allowDeselect && current() === value ? null : value
    setValue(next)
    if (props.clearSearchOnChange) {
      setSearch(next ? String(node.label) : '')
    }
    combobox.closeDropdown()
    return
  }

  if (props.mode === 'multiple') {
    // With expandOnClick: parent clicks only expand, not select
    if (props.expandOnClick && hasChildren) {
      toggleExpand(value)
      return
    }
    const vals = selectedArray()
    if (vals.includes(value)) {
      remove(value)
    } else if (vals.length < props.maxValues) {
      setValue([...vals, value])
    }
    return
  }

  // checkbox mode
  const vals = selectedArray()
  const affected = props.checkStrictly ? [value] : [value, ...allValues(node.children ?? [])]
  // Determine whether we are checking or unchecking by matching the visual
  // checked state shown to the user. With checkedStrategy:'child', vals
  // contains only leaf values, so the parent node value itself is never in
  // vals — using affected.every() would always return true (always "checking").
  const leaves = leafValues(node)
  const isCurrentlyChecked = props.checkStrictly
    ? vals.includes(value)
    : leaves.every((leaf) => vals.includes(leaf)) || vals.includes(value)
  const checking = !isCurrentlyChecked
  let next = checking
    ? [...new Set([...vals, ...affected])]
    : vals.filter((item) => !affected.includes(item))

  if (!props.checkStrictly) {
    // Propagate parent checked state based on children
    const allNodes = allValues(props.data)
      .map((v) => nodes.value[v])
      .filter(Boolean)
    for (const parentNode of allNodes.reverse()) {
      if (!parentNode.children?.length) continue
      const descendants = allValues(parentNode.children)
      if (descendants.every((item) => next.includes(item))) {
        next = [...new Set([...next, parentNode.value])]
      } else {
        next = next.filter((item) => item !== parentNode.value)
      }
    }
  }

  if (next.length <= props.maxValues || !checking) {
    setValue(displayChecked(next, props.data, props.checkedStrategy))
  }

  if (hasChildren && props.expandOnClick) {
    if (!expanded().includes(value)) {
      toggleExpand(value)
    }
  }
}

/**
 * The entire render is a VNode tree rather than markup.
 *
 * `Combobox.Target` clones its child to inject the target ref and the combobox
 * handlers, and that child is either a `PillsInput` carrying the value pills or a plain
 * `InputBase`, chosen at render time. Expressing that as a template would put a
 * conditional wrapper between the two and break the clone, so the tree is built with
 * `h()` and rendered through `<component :is>`.
 */
const renderRoot = (): VNodeChild => {
  const disabled = !!(attrs as any).disabled
  const readOnly = !!(attrs as any).readOnly
  const multiValues = selectedArray()
  const hasValue = isMulti() ? multiValues.length > 0 : current() != null
  const canClear = props.clearable && hasValue && !disabled && !readOnly
  const nothingFoundSlot = slots.nothingFoundMessage ?? slots.nothingFound
  const nothingFound =
    (nothingFoundSlot ? nothingFoundSlot() : undefined) ?? props.nothingFoundMessage
  const renderNode =
    (slots.renderNode ? (payload: any) => slots.renderNode!(payload) : undefined) ??
    props.renderNode

  const clear = (event: MouseEvent) => {
    event.stopPropagation()
    setValue(isMulti() ? [] : null)
    setSearch('')
    emit('clear')
  }

  const rightSection = canClear
    ? h(Combobox.ClearButton, { ...(attrs as any).clearButtonProps, onClick: clear })
    : (attrs as any).rightSection !== undefined || slots.rightSection
      ? (attrs as any).rightSection
      : h(Combobox.Chevron, {
          size: (attrs as any).size ?? 'sm',
          error: (attrs as any).error,
        })

  const forwarded: any = { ...attrs }
  ;['name', 'form', 'rightSection', 'clearButtonProps', 'placeholder'].forEach(
    (key) => delete forwarded[key],
  )

  const field = (multi: boolean) =>
    h(PillsInput.Field, {
      modelValue: search(),
      readonly: !props.searchable || readOnly,
      disabled,
      placeholder: !hasValue ? (attrs as any).placeholder : undefined,
      onInput: (event: Event) => {
        setSearch((event.target as HTMLInputElement).value)
        combobox.openDropdown()
      },
      onFocus: () => props.openOnFocus && props.searchable && combobox.openDropdown(),
      onClick: () => (props.searchable ? combobox.openDropdown() : combobox.toggleDropdown()),
      onBlur: () => combobox.closeDropdown(),
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === 'Backspace' && multi && !search() && multiValues.length && !readOnly) {
          remove(multiValues[multiValues.length - 1])
        }
      },
    })

  const input = isMulti()
    ? h(
        PillsInput,
        {
          ...forwarded,
          __staticSelector: 'TreeSelect',
          disabled,
          rightSection,
          rightSectionPointerEvents: canClear ? 'all' : 'none',
        },
        () =>
          h(Pill.Group, null, () => {
            const displayed =
              props.maxDisplayedValues == null
                ? multiValues
                : multiValues.slice(0, props.maxDisplayedValues)
            const overflow = multiValues.length - displayed.length
            return [
              ...displayed.map((value) =>
                h(
                  Pill,
                  {
                    key: value,
                    withRemoveButton: !readOnly && !nodes.value[value]?.nodeProps?.disabled,
                    disabled,
                    onRemove: () => remove(value),
                  },
                  () => String(nodes.value[value]?.label ?? value),
                ),
              ),
              overflow > 0
                ? h(Pill, { key: 'overflow' }, () =>
                    typeof props.maxDisplayedValuesContent === 'function'
                      ? props.maxDisplayedValuesContent(overflow)
                      : (props.maxDisplayedValuesContent ?? `+${overflow} more`),
                  )
                : null,
              field(true),
            ]
          }),
      )
    : h(
        InputBase,
        {
          ...forwarded,
          __staticSelector: 'TreeSelect',
          component: 'input',
          disabled,
          readonly: !props.searchable || readOnly,
          pointer: !props.searchable,
          modelValue: search(),
          placeholder: (attrs as any).placeholder,
          rightSection,
          rightSectionPointerEvents: canClear ? 'all' : 'none',
          onInput: (event: Event) => {
            setSearch((event.target as HTMLInputElement).value)
            combobox.openDropdown()
          },
          onFocus: () => props.openOnFocus && props.searchable && combobox.openDropdown(),
          onClick: () => (props.searchable ? combobox.openDropdown() : combobox.toggleDropdown()),
          onBlur: () => {
            combobox.closeDropdown()
            setSearch(current() ? String(nodes.value[current()]?.label ?? '') : '')
          },
        },
        slots,
      )

  const treeOptions = flat.value.map((flatNode) => {
    const { node, level, hasChildren, expanded: nodeExpanded, isLastChild, lineGuides } = flatNode
    const vals = selectedArray()
    const leaves = leafValues(node)

    const checked =
      props.mode === 'checkbox'
        ? props.checkStrictly
          ? vals.includes(node.value)
          : leaves.every((item) => vals.includes(item)) || vals.includes(node.value)
        : false

    const indeterminate =
      props.mode === 'checkbox' && !checked && leaves.some((item) => vals.includes(item))

    const selected =
      props.mode === 'single'
        ? current() === node.value
        : props.mode === 'multiple'
          ? vals.includes(node.value)
          : false

    return h(TreeSelectOption, {
      key: node.value,
      node,
      level,
      hasChildren,
      expanded: nodeExpanded,
      selected,
      checked,
      indeterminate,
      showCheckbox: props.mode === 'checkbox',
      isLastChild,
      lineGuides,
      withLines: props.withLines,
      onToggleExpand: toggleExpand,
      renderNode,
      chevronAriaLabels: props.chevronAriaLabels,
    })
  })

  const optionsContent =
    flat.value.length > 0
      ? h(
          'div',
          {
            ...props.scrollAreaProps,
            class: [classes.optionsWrapper, props.scrollAreaProps?.class],
            style: [
              {
                maxHeight:
                  typeof props.maxDropdownHeight === 'number'
                    ? `${props.maxDropdownHeight}px`
                    : props.maxDropdownHeight,
                overflowY: 'auto',
              },
              props.scrollAreaProps?.style,
            ],
          },
          treeOptions,
        )
      : nothingFound != null
        ? h(Combobox.Empty, null, () => nothingFound)
        : null

  const control = h(
    Combobox,
    {
      store: combobox,
      readOnly,
      size: (attrs as any).size ?? 'sm',
      __staticSelector: 'TreeSelect',
      ...props.comboboxProps,
      onOptionSubmit: submit,
    },
    () => [
      h(Combobox.Target, { targetType: 'input', withExpandedAttribute: true }, () => input),
      h(Combobox.Dropdown, { hidden: disabled || readOnly }, () =>
        h(Combobox.Options, null, () => optionsContent),
      ),
    ],
  )

  return [
    control,
    h(Combobox.HiddenInput, {
      value: current(),
      valuesDivider: props.hiddenInputValuesDivider,
      name: (attrs as any).name,
      form: (attrs as any).form,
      disabled,
      ...props.hiddenInputProps,
    }),
  ]
}
</script>

<template>
  <component :is="renderRoot" />
</template>
