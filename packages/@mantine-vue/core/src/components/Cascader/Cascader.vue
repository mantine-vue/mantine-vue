<script setup lang="ts">
import { computed, h, ref, watch, useAttrs, useSlots, type VNodeChild } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { resolveNode } from '../../core'
import { CheckIcon } from '../Checkbox'
import { AccordionChevron } from '../Accordion'
import { Combobox, useCombobox } from '../Combobox'
import { InputBase } from '../InputBase'
import { ScrollArea } from '../ScrollArea'
import { UnstyledButton } from '../UnstyledButton'
import {
  cascaderOptionHasChildren,
  flattenCascaderPaths,
  getCascaderColumns,
  getCascaderPathOptions,
} from './cascader-utils'
import { call, findEnabledIndex, optionLabelToString, pathsEqual } from './cascader-helpers'
import type { CascaderOption, CascaderProps, CascaderSlots } from './Cascader.types'
import classes from './Cascader.module.css'

defineOptions({
  name: 'Cascader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CascaderProps>(), {
  closeOnSelect: undefined,
  dropdownOpened: undefined,
  separator: undefined,
  nothingFoundMessage: undefined,
  changeOnSelect: false,
  allowDeselect: true,
  withCheckIcon: true,
  checkIconPosition: 'right',
  withColumns: true,
  expandTrigger: 'click',
  searchable: false,
  columnWidth: 200,
  maxDisplayedLevels: 3,
  previousLevelsControlLabel: 'Show previous levels',
  nextLevelsControlLabel: 'Show next levels',
  maxDropdownHeight: 260,
  clearable: false,
  clearSectionMode: 'both',
  defaultDropdownOpened: false,
  openOnFocus: true,
  readOnly: false,
  disabled: false,
  size: 'sm',
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[] | null]
  'update:searchValue': [value: string]
  change: [value: string[] | null, options: CascaderOption[]]
  'search-change': [value: string]
  clear: []
  'dropdown-open': []
  'dropdown-close': []
}>()

defineSlots<CascaderSlots>()

const slots = useSlots()
const attrs = useAttrs()

const id = useId((attrs as any).id)
const internalValue = ref<string[] | null>(props.defaultValue ?? null)
const currentValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internalValue.value,
)
const pathOptions = computed(() => getCascaderPathOptions(props.data, currentValue.value))
const separatorString = computed(() =>
  typeof props.separator === 'string' || typeof props.separator === 'number'
    ? String(props.separator)
    : '/',
)
const separatorContent = () => resolveNode(props.separator, slots.separator) ?? '/'
const nothingFoundContent = () =>
  resolveNode(props.nothingFoundMessage, slots.nothingFoundMessage ?? slots.nothingFound)
const displayString = computed(() => {
  if (!currentValue.value || pathOptions.value.length === 0) return ''
  const formatted = props.formatValue?.({
    value: currentValue.value,
    options: pathOptions.value,
  })
  if (typeof formatted === 'string' || typeof formatted === 'number') return String(formatted)
  return pathOptions.value.map(optionLabelToString).join(` ${separatorString.value} `)
})

const internalSearch = ref(
  props.defaultSearchValue ??
    (props.searchable && props.defaultValue
      ? getCascaderPathOptions(props.data, props.defaultValue)
          .map(optionLabelToString)
          .join(` ${separatorString.value} `)
      : ''),
)
const search = computed(() => props.searchValue ?? internalSearch.value)
const activePath = ref<string[]>(currentValue.value ? [...currentValue.value] : [])
const keyboardNav = ref(false)
const windowOffset = ref(0)
const canInteract = computed(() => !props.readOnly && !props.disabled)
const shouldCloseOnSelect = computed(() => props.closeOnSelect ?? !props.allowDeselect)

const setSearch = (value: string) => {
  if (props.searchValue === undefined) internalSearch.value = value
  emit('search-change', value)
  emit('update:searchValue', value)
}

const setValue = (value: string[] | null) => {
  if (props.modelValue === undefined) internalValue.value = value
  const selectedOptions = getCascaderPathOptions(props.data, value)
  emit('update:modelValue', value)
  emit('change', value, selectedOptions)
}

const resetActivePath = () => {
  activePath.value = currentValue.value ? [...currentValue.value] : []
}

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  defaultOpened: props.defaultDropdownOpened,
  onDropdownOpen: () => {
    emit('dropdown-open')
    resetActivePath()
  },
  onDropdownClose: () => {
    emit('dropdown-close')
    if (props.searchable) setSearch(currentValue.value ? displayString.value : '')
  },
})

watch(
  currentValue,
  (value) => {
    if (props.searchable) setSearch(value ? displayString.value : '')
  },
  { deep: true },
)
watch(activePath, () => (windowOffset.value = 0), { deep: true })

const selectPath = (path: string[]) => {
  setValue(props.allowDeselect && pathsEqual(currentValue.value, path) ? null : path)
}

const expandOption = (level: number, option: CascaderOption) => {
  const optionPath = [...activePath.value.slice(0, level), option.value]
  if (cascaderOptionHasChildren(option)) {
    const first = findEnabledIndex(option.children!, -1, 1)
    activePath.value = first >= 0 ? [...optionPath, option.children![first].value] : optionPath
  } else {
    activePath.value = optionPath
  }
}

const finishSelection = () => {
  if (shouldCloseOnSelect.value) combobox.closeDropdown('mouse')
}

const handleOptionClick = (level: number, option: CascaderOption) => {
  if (option.disabled) return
  keyboardNav.value = false
  const path = [...activePath.value.slice(0, level), option.value]
  if (cascaderOptionHasChildren(option)) {
    if (props.changeOnSelect) {
      selectPath(path)
      finishSelection()
    }
    expandOption(level, option)
  } else {
    selectPath(path)
    finishSelection()
  }
}

const handleOptionMouseEnter = (level: number, option: CascaderOption) => {
  if (option.disabled) return
  keyboardNav.value = false
  if (props.expandTrigger !== 'hover') return
  if (cascaderOptionHasChildren(option)) expandOption(level, option)
  else activePath.value = [...activePath.value.slice(0, level), option.value]
}

const flatPaths = computed(() => flattenCascaderPaths(props.data))
const isSearching = computed(
  () => props.searchable && search.value.trim().length > 0 && search.value !== displayString.value,
)
const showFlatList = computed(() => isSearching.value || !props.withColumns)
const flatListItems = computed(() => {
  const base = flatPaths.value.filter((path) => props.changeOnSelect || path.leaf)
  if (!isSearching.value) return base
  return base.filter((path) =>
    props.filter
      ? props.filter(search.value, path.options)
      : path.options
          .map(optionLabelToString)
          .join(` ${separatorString.value} `)
          .toLowerCase()
          .includes(search.value.trim().toLowerCase()),
  )
})

const renderSearchLabel = (options: CascaderOption[]) => {
  if (props.renderSearchOption) return props.renderSearchOption(search.value, options)
  if (slots.renderSearchOption) {
    return slots.renderSearchOption({ query: search.value, options })
  }

  return options.flatMap((option, index) => [
    index ? h('span', { 'data-cascader-separator': true }, [' ', separatorContent(), ' ']) : null,
    option.label ?? option.value,
  ])
}

const renderFlatList = () =>
  h(
    Combobox.Options,
    {
      'aria-label': typeof (attrs as any).label === 'string' ? (attrs as any).label : undefined,
    },
    () => [
      h(
        ScrollArea.Autosize,
        {
          mah: props.maxDropdownHeight,
          type: 'scroll',
          scrollbarSize: 'var(--combobox-padding)',
          offsetScrollbars: 'y',
          ...props.scrollAreaProps,
        },
        () =>
          flatListItems.value.map((item, index) => {
            const selected = pathsEqual(currentValue.value, item.path)
            return h(
              Combobox.Option,
              {
                value: index,
                active: selected,
                disabled: item.disabled,
              },
              () =>
                h('span', { class: classes.flatOption }, [
                  selected && props.withCheckIcon && props.checkIconPosition === 'left'
                    ? h(CheckIcon, { class: classes.columnOptionCheck })
                    : null,
                  h('span', { class: classes.columnOptionLabel }, [
                    renderSearchLabel(item.options),
                  ]),
                  selected && props.withCheckIcon && props.checkIconPosition !== 'left'
                    ? h(CheckIcon, { class: classes.columnOptionCheck })
                    : null,
                ]),
            )
          }),
      ),
      flatListItems.value.length === 0 &&
      (props.nothingFoundMessage !== undefined || slots.nothingFoundMessage || slots.nothingFound)
        ? h(Combobox.Empty, {}, nothingFoundContent)
        : null,
    ],
  )

const optionId = (level: number, value: string) =>
  id.value ? `${id.value}-cascader-list-${level}-${value}` : undefined

const renderColumns = () => {
  const allColumns = getCascaderColumns(props.data, activePath.value)
  const totalColumns = allColumns.length
  const maxLevels = props.maxDisplayedLevels > 0 ? props.maxDisplayedLevels : totalColumns
  const maxOffset = Math.max(0, totalColumns - maxLevels)
  const clampedOffset = Math.min(windowOffset.value, maxOffset)
  const windowStart = Math.max(0, maxOffset - clampedOffset)
  const windowEnd = Math.min(totalColumns, windowStart + maxLevels)
  const visibleColumns = allColumns.slice(windowStart, windowEnd)
  const hiddenBefore = windowStart
  const hiddenAfter = totalColumns - windowEnd
  const focusedLevel = activePath.value.length - 1

  const overflowControl = (position: 'start' | 'end') =>
    h(
      UnstyledButton,
      {
        class: classes.columnsOverflow,
        'data-position': position,
        tabindex: -1,
        'aria-label':
          position === 'start' ? props.previousLevelsControlLabel : props.nextLevelsControlLabel,
        title:
          position === 'start' ? props.previousLevelsControlLabel : props.nextLevelsControlLabel,
        onMousedown: (event: MouseEvent) => event.preventDefault(),
        onClick: () => {
          windowOffset.value =
            position === 'start'
              ? Math.min(maxOffset, windowOffset.value + 1)
              : Math.max(0, windowOffset.value - 1)
        },
      },
      () => h(AccordionChevron),
    )

  return h(
    'div',
    {
      class: classes.columnsList,
      role: 'presentation',
      onMouseleave: () => {
        if (props.expandTrigger === 'hover') resetActivePath()
      },
      onMousemove: () => (keyboardNav.value = false),
    },
    [
      hiddenBefore > 0 ? overflowControl('start') : null,
      ...visibleColumns.map((options, index) => {
        const level = windowStart + index
        const isLast = index === visibleColumns.length - 1 && hiddenAfter === 0
        return h(
          'div',
          {
            class: classes.column,
            'data-last': isLast || undefined,
            style: {
              width:
                typeof props.columnWidth === 'number'
                  ? `${props.columnWidth}px`
                  : props.columnWidth,
              minWidth:
                typeof props.columnWidth === 'number'
                  ? `${props.columnWidth}px`
                  : props.columnWidth,
            },
          },
          [
            h(
              ScrollArea.Autosize,
              {
                class: classes.columnScroll,
                mah: props.maxDropdownHeight,
                type: 'scroll',
                scrollbarSize: 'var(--combobox-padding)',
                role: 'listbox',
                ...props.scrollAreaProps,
              },
              () =>
                options.length
                  ? options.map((option) => {
                      const active = activePath.value[level] === option.value
                      const current = active && level === focusedLevel && keyboardNav.value
                      const inPath = active && level < focusedLevel
                      const selected =
                        !!currentValue.value &&
                        currentValue.value.length === level + 1 &&
                        currentValue.value[level] === option.value
                      return h(
                        UnstyledButton,
                        {
                          id: optionId(level, option.value),
                          class: classes.columnOption,
                          role: 'option',
                          tabindex: -1,
                          'aria-selected': current || undefined,
                          'aria-disabled': option.disabled || undefined,
                          'data-active': current || undefined,
                          'data-in-path': inPath || undefined,
                          'data-selected': selected || undefined,
                          'data-disabled': option.disabled || undefined,
                          onMousedown: (event: MouseEvent) => event.preventDefault(),
                          onClick: () => handleOptionClick(level, option),
                          onMouseenter: () => handleOptionMouseEnter(level, option),
                        },
                        () => [
                          selected && props.withCheckIcon && props.checkIconPosition === 'left'
                            ? h(CheckIcon, { class: classes.columnOptionCheck })
                            : null,
                          h('span', { class: classes.columnOptionLabel }, [
                            props.renderOption
                              ? props.renderOption(option, level)
                              : (slots.renderOption?.({ option, level }) ??
                                option.label ??
                                option.value),
                          ]),
                          selected && props.withCheckIcon && props.checkIconPosition !== 'left'
                            ? h(CheckIcon, { class: classes.columnOptionCheck })
                            : null,
                          cascaderOptionHasChildren(option)
                            ? h('span', { class: classes.columnOptionIcon }, h(AccordionChevron))
                            : null,
                        ],
                      )
                    })
                  : h('div', { class: classes.columnEmpty }, [nothingFoundContent()] as any),
            ),
          ],
        )
      }),
      hiddenAfter > 0 ? overflowControl('end') : null,
    ],
  )
}

const handleColumnsKeyDown = (event: KeyboardEvent) => {
  keyboardNav.value = true
  const columns = getCascaderColumns(props.data, activePath.value)
  const focusedLevel = Math.max(0, activePath.value.length - 1)
  const currentColumn = columns[focusedLevel] ?? columns[0] ?? []
  const focusedIndex = currentColumn.findIndex(
    (item) => item.value === activePath.value[focusedLevel],
  )
  const focusedOption = focusedIndex >= 0 ? currentColumn[focusedIndex] : undefined

  if (event.key === 'ArrowDown') {
    const next = findEnabledIndex(currentColumn, focusedIndex, 1)
    if (next >= 0)
      activePath.value = [...activePath.value.slice(0, focusedLevel), currentColumn[next].value]
    return true
  }
  if (event.key === 'ArrowUp') {
    const previous = findEnabledIndex(
      currentColumn,
      focusedIndex < 0 ? currentColumn.length : focusedIndex,
      -1,
    )
    if (previous >= 0)
      activePath.value = [...activePath.value.slice(0, focusedLevel), currentColumn[previous].value]
    return true
  }
  if (event.key === 'ArrowRight') {
    if (focusedOption && cascaderOptionHasChildren(focusedOption))
      expandOption(focusedLevel, focusedOption)
    return true
  }
  if (event.key === 'ArrowLeft') {
    if (activePath.value.length > 1) activePath.value = activePath.value.slice(0, -1)
    return true
  }
  if (event.key === 'Enter' && focusedOption) {
    const path = [...activePath.value.slice(0, focusedLevel), focusedOption.value]
    if (cascaderOptionHasChildren(focusedOption)) {
      if (props.changeOnSelect) {
        selectPath(path)
        finishSelection()
      }
      expandOption(focusedLevel, focusedOption)
    } else {
      selectPath(path)
      finishSelection()
    }
    return true
  }
  return false
}

const handleKeydown = (event: KeyboardEvent) => {
  call((attrs as any).onKeydown, event)
  if (event.defaultPrevented) return
  if (event.key === 'Escape') {
    combobox.closeDropdown('keyboard')
    return
  }
  if (showFlatList.value || !canInteract.value) return

  if (!combobox.dropdownOpened) {
    const opens =
      ['ArrowDown', 'ArrowUp', 'ArrowRight', 'Enter'].includes(event.key) ||
      (!props.searchable && event.key === ' ')
    if (opens) {
      event.preventDefault()
      keyboardNav.value = true
      combobox.openDropdown('keyboard')
      if (!currentValue.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        const rootIndex =
          event.key === 'ArrowDown'
            ? findEnabledIndex(props.data, -1, 1)
            : findEnabledIndex(props.data, props.data.length, -1)
        if (rootIndex >= 0) activePath.value = [props.data[rootIndex].value]
      }
    }
    return
  }

  if (handleColumnsKeyDown(event)) event.preventDefault()
  else if (!props.searchable && event.key === ' ') event.preventDefault()
}

/**
 * The entire render is a VNode tree rather than markup.
 *
 * `Combobox.Target` clones its child to inject the target ref and the combobox handlers,
 * and the dropdown switches between a flat search list and the cascading columns at
 * render time. Expressing either as a template would put a conditional wrapper between
 * the target and its child and break the clone, so the tree is built with `h()` and
 * rendered through `<component :is>`.
 */
const renderRoot = (): VNodeChild => {
  const inputAttrs: Record<string, unknown> = { ...attrs }
  delete inputAttrs.name
  delete inputAttrs.onKeydown
  delete inputAttrs.onFocus
  delete inputAttrs.onBlur
  delete inputAttrs.onClick
  delete inputAttrs.onInput

  const clearButton = h(Combobox.ClearButton, {
    ...props.clearButtonProps,
    onMousedown: (event: MouseEvent) => event.preventDefault(),
    onClick: () => {
      emit('clear')
      setValue(null)
      activePath.value = []
      setSearch('')
      combobox.focusTarget()
    },
  })
  const hasValue = !!currentValue.value?.length
  const canClear = props.clearable && hasValue && !props.disabled && !props.readOnly
  const listId = id.value ? `${id.value}-cascader-list` : undefined
  const focusedLevel = activePath.value.length - 1
  const activeDescendant =
    keyboardNav.value && focusedLevel >= 0
      ? optionId(focusedLevel, activePath.value[focusedLevel])
      : undefined

  return h('div', { style: { display: 'contents' } }, [
    h(
      Combobox,
      {
        store: combobox,
        __staticSelector: 'Cascader',
        classNames: props.classNames,
        styles: props.styles,
        unstyled: props.unstyled,
        readOnly: props.readOnly,
        size: String(props.size),
        width: showFlatList.value ? 'target' : 'max-content',
        position: 'bottom-start',
        ...props.comboboxProps,
        onOptionSubmit: (raw: string) => {
          const item = flatListItems.value[Number(raw)]
          if (!item || item.disabled) return
          selectPath(item.path)
          activePath.value = [...item.path]
          finishSelection()
        },
      },
      {
        default: () => [
          h(
            Combobox.Target,
            {
              targetType: props.searchable ? 'input' : 'button',
              withKeyboardNavigation: showFlatList.value,
            },
            () =>
              h(
                InputBase,
                {
                  ...inputAttrs,
                  id: id.value,
                  __staticSelector: 'Cascader',
                  size: props.size as any,
                  classNames: props.classNames as any,
                  styles: props.styles as any,
                  unstyled: props.unstyled,
                  disabled: props.disabled,
                  readonly: props.readOnly || !props.searchable,
                  pointer: !props.searchable,
                  modelValue: props.searchable ? search.value : displayString.value,
                  'aria-controls': listId,
                  'aria-activedescendant': activeDescendant,
                  __defaultRightSection: h(Combobox.Chevron, {
                    size: String(props.size),
                    color: props.chevronColor,
                  }),
                  __clearSection: clearButton,
                  __clearable: canClear,
                  __clearSectionMode: props.clearSectionMode,
                  rightSectionPointerEvents: (attrs as any).rightSectionPointerEvents || 'none',
                  onInput: (event: Event) => {
                    setSearch((event.target as HTMLInputElement).value)
                    if (canInteract.value) combobox.openDropdown('keyboard')
                  },
                  onFocus: (event: FocusEvent) => {
                    if (props.openOnFocus && props.searchable && canInteract.value)
                      combobox.openDropdown('keyboard')
                    call((attrs as any).onFocus, event)
                  },
                  onBlur: (event: FocusEvent) => {
                    combobox.closeDropdown('unknown')
                    call((attrs as any).onBlur, event)
                  },
                  onClick: (event: MouseEvent) => {
                    if (canInteract.value) {
                      keyboardNav.value = false
                      if (props.searchable) combobox.openDropdown('mouse')
                      else combobox.toggleDropdown('mouse')
                    }
                    call((attrs as any).onClick, event)
                  },
                  onKeydown: handleKeydown,
                },
                {
                  label: slots.label,
                  description: slots.description,
                  error: slots.error,
                  leftSection: slots.leftSection,
                  rightSection: slots.rightSection,
                },
              ),
          ),
          h(
            Combobox.Dropdown,
            {
              hidden: props.readOnly || props.disabled,
              style: showFlatList.value ? undefined : { padding: 0 },
            },
            () => (showFlatList.value ? renderFlatList() : renderColumns()),
          ),
        ],
      },
    ),
    h(Combobox.HiddenInput, {
      name: (attrs as any).name,
      form: (attrs as any).form,
      disabled: props.disabled,
      value: currentValue.value,
      ...props.hiddenInputProps,
    }),
  ])
}
</script>

<template>
  <component :is="renderRoot" />
</template>
