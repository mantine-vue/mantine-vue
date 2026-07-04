import { computed, defineComponent, h, ref, type PropType, type VNodeChild } from 'vue'
import { AccordionChevron } from '../Accordion/AccordionChevron'
import { CheckboxIndicator } from '../Checkbox/CheckboxIndicator/CheckboxIndicator'
import { CheckIcon } from '../Checkbox/CheckIcon'
import { Combobox, useCombobox } from '../Combobox'
import { InputBase } from '../InputBase'
import { Pill } from '../Pill'
import { PillsInput } from '../PillsInput'
import type { TreeNodeData } from '../Tree'
import classes from './TreeSelect.module.css'

const LEVEL_OFFSET = 20
const BASE_PADDING = 8
const LINE_CONTENT_GAP = 5
const OPTION_GAP = 6

export type TreeSelectMode = 'single' | 'multiple' | 'checkbox'
export type TreeSelectValue<Mode extends TreeSelectMode> = Mode extends 'single'
  ? string | null
  : string[]
export type CheckedStrategy = 'all' | 'parent' | 'child'

export interface TreeSelectRenderNodePayload {
  node: TreeNodeData
  level: number
  expanded: boolean
  hasChildren: boolean
  selected: boolean
  checked: boolean
  indeterminate: boolean
}
export interface TreeSelectChevronAriaLabels {
  expand?: string
  collapse?: string
}
export interface TreeSelectProps<Mode extends TreeSelectMode = 'single'> {
  data: TreeNodeData[]
  mode?: Mode
  modelValue?: TreeSelectValue<Mode>
  value?: TreeSelectValue<Mode>
  defaultValue?: TreeSelectValue<Mode>
  onChange?: (value: TreeSelectValue<Mode>) => void
  checkStrictly?: boolean
  checkedStrategy?: CheckedStrategy
  defaultExpandedValues?: string[]
  defaultExpandAll?: boolean
  expandedValues?: string[]
  onExpandedChange?: (values: string[]) => void
  searchable?: boolean
  searchValue?: string
  defaultSearchValue?: string
  onSearchChange?: (value: string) => void
  [key: string]: any
}

interface FlatNode {
  node: TreeNodeData
  level: number
  parent: string | null
  hasChildren: boolean
  expanded: boolean
  isLastChild: boolean
  lineGuides: boolean[]
}

function flattenTo(
  acc: FlatNode[],
  data: TreeNodeData[],
  expandedSet: Set<string>,
  parent: string | null,
  level: number,
  parentGuides: boolean[],
): void {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const isLast = i === data.length - 1
    const hasLoadedChildren = Array.isArray(node.children)
    const hasAsyncChildren = !!node.hasChildren && !hasLoadedChildren
    const hasChildren = hasLoadedChildren || hasAsyncChildren
    const expanded = expandedSet.has(node.value)

    acc.push({
      node,
      level,
      parent,
      hasChildren,
      expanded,
      isLastChild: isLast,
      lineGuides: parentGuides,
    })

    if (expanded && hasLoadedChildren) {
      const childGuides = level >= 2 ? [...parentGuides, !isLast] : []
      flattenTo(acc, node.children!, expandedSet, node.value, level + 1, childGuides)
    }
  }
}

function flattenVisible(data: TreeNodeData[], expandedSet: Set<string>): FlatNode[] {
  const result: FlatNode[] = []
  flattenTo(result, data, expandedSet, null, 1, [])
  return result
}

function allValues(data: TreeNodeData[]): string[] {
  return data.flatMap((node) => [node.value, ...allValues(node.children ?? [])])
}

function leafValues(node: TreeNodeData): string[] {
  return node.children?.length ? node.children.flatMap(leafValues) : [node.value]
}

function filterData(
  data: TreeNodeData[],
  query: string,
  filter?: (query: string, node: TreeNodeData) => boolean,
): TreeNodeData[] {
  const q = query.trim().toLowerCase()
  return data.flatMap((node) => {
    const children = filterData(node.children ?? [], query, filter)
    const match = filter ? filter(query, node) : String(node.label).toLowerCase().includes(q)
    return match || children.length ? [{ ...node, children }] : []
  })
}

function buildLookup(data: TreeNodeData[]): Record<string, TreeNodeData> {
  const map: Record<string, TreeNodeData> = {}
  function walk(nodes: TreeNodeData[]) {
    for (const node of nodes) {
      map[node.value] = node
      if (node.children) walk(node.children)
    }
  }
  walk(data)
  return map
}

function displayChecked(values: string[], data: TreeNodeData[], strategy: CheckedStrategy) {
  if (strategy === 'all') return values
  const nodes = buildLookup(data)
  return values.filter((value) =>
    strategy === 'child'
      ? !nodes[value]?.children?.length
      : !!nodes[value]?.children?.length ||
        !Object.values(nodes).some(
          (node) =>
            node.children?.some((child) => child.value === value) && values.includes(node.value),
        ),
  )
}

export const TreeSelectOption = defineComponent({
  name: 'TreeSelectOption',
  inheritAttrs: false,
  props: {
    node: { type: Object as PropType<TreeNodeData>, required: true },
    level: { type: Number, required: true },
    hasChildren: { type: Boolean, default: false },
    expanded: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    showCheckbox: { type: Boolean, default: false },
    isLastChild: { type: Boolean, default: false },
    lineGuides: { type: Array as PropType<boolean[]>, default: () => [] },
    withLines: { type: Boolean, default: true },
    onToggleExpand: Function as PropType<(value: string) => void>,
    renderNode: Function as PropType<(payload: TreeSelectRenderNodePayload) => VNodeChild>,
    chevronAriaLabels: Object as PropType<TreeSelectChevronAriaLabels>,
  },
  setup(props, { attrs }) {
    return () => {
      const indentPx = (props.level - 1) * LEVEL_OFFSET

      const paddingInlineStart =
        BASE_PADDING +
        indentPx +
        (props.withLines && props.level > 1 ? LINE_CONTENT_GAP : 0) +
        (!props.hasChildren ? OPTION_GAP : 0)

      const isActive = props.selected || props.checked

      const ariaChecked = props.showCheckbox
        ? props.indeterminate && !props.checked
          ? 'mixed'
          : props.checked
        : undefined

      const payload: TreeSelectRenderNodePayload = {
        node: props.node,
        level: props.level,
        expanded: props.expanded,
        hasChildren: props.hasChildren,
        selected: props.selected,
        checked: props.checked,
        indeterminate: props.indeterminate,
      }

      // Line guide elements (match React's TreeSelectOption)
      const lineElements =
        props.withLines && props.level > 1
          ? [
              ...props.lineGuides.map((show, g) =>
                show
                  ? h('span', {
                      key: `g${g}`,
                      class: classes.guideLine,
                      style: {
                        insetInlineStart: `${BASE_PADDING + (g + 1) * LEVEL_OFFSET - LEVEL_OFFSET / 2}px`,
                      },
                    })
                  : null,
              ),
              h('span', {
                class: classes.branchVertical,
                'data-last': props.isLastChild || undefined,
                style: {
                  insetInlineStart: `${BASE_PADDING + (props.level - 1) * LEVEL_OFFSET - LEVEL_OFFSET / 2}px`,
                },
              }),
              h('span', {
                class: classes.branchHorizontal,
                style: {
                  insetInlineStart: `${BASE_PADDING + (props.level - 1) * LEVEL_OFFSET - LEVEL_OFFSET / 2}px`,
                  width: `${LEVEL_OFFSET / 2}px`,
                },
              }),
            ]
          : []

      const customContent = props.renderNode ? props.renderNode(payload) : null

      return h(
        Combobox.Option,
        {
          ...attrs,
          class: [classes.option, (attrs as any).class],
          value: props.node.value,
          disabled: props.node.nodeProps?.disabled,
          active: isActive,
          'aria-selected': isActive,
          'aria-level': props.level,
          'aria-expanded': props.hasChildren ? props.expanded : undefined,
          'aria-checked': ariaChecked,
          style: [{ paddingInlineStart: `${paddingInlineStart}px` }, (attrs as any).style],
        },
        () =>
          customContent
            ? [lineElements, customContent]
            : [
                ...lineElements,

                props.hasChildren
                  ? h(
                      'span',
                      {
                        class: classes.expandIcon,
                        'data-expanded': props.expanded || undefined,
                        role: 'button',
                        tabindex: -1,
                        'aria-label': props.expanded
                          ? (props.chevronAriaLabels?.collapse ?? 'Collapse')
                          : (props.chevronAriaLabels?.expand ?? 'Expand'),
                        onMousedown: (event: MouseEvent) => event.preventDefault(),
                        onClick: (event: MouseEvent) => {
                          event.preventDefault()
                          event.stopPropagation()
                          props.onToggleExpand?.(props.node.value)
                        },
                        onKeydown: (event: KeyboardEvent) => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            event.stopPropagation()
                            props.onToggleExpand?.(props.node.value)
                          }
                        },
                      },
                      h(AccordionChevron, { size: '80%' }),
                    )
                  : null,
                props.showCheckbox
                  ? h(CheckboxIndicator, {
                      checked: props.checked || props.indeterminate,
                      indeterminate: !props.checked && props.indeterminate,
                      size: '18px',
                    })
                  : null,
                // Label
                h('span', { class: classes.label }, String(props.node.label)),
                // Check icon for selected (non-checkbox) state
                !props.showCheckbox && isActive ? h(CheckIcon, { class: classes.checkIcon }) : null,
              ],
      )
    }
  },
})

export const TreeSelect = defineComponent({
  name: 'TreeSelect',
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<TreeNodeData[]>, required: true },
    mode: { type: String as PropType<TreeSelectMode>, default: 'single' },
    modelValue: { type: [String, Array] as PropType<any>, default: undefined },
    value: { type: [String, Array] as PropType<any>, default: undefined },
    defaultValue: { type: [String, Array] as PropType<any>, default: undefined },
    onChange: Function as PropType<(value: any) => void>,
    checkStrictly: Boolean,
    checkedStrategy: { type: String as PropType<CheckedStrategy>, default: 'child' },
    defaultExpandedValues: Array as PropType<string[]>,
    defaultExpandAll: Boolean,
    expandedValues: Array as PropType<string[]>,
    onExpandedChange: Function as PropType<(values: string[]) => void>,
    expandOnClick: Boolean,
    searchable: Boolean,
    searchValue: String,
    defaultSearchValue: String,
    onSearchChange: Function as PropType<(value: string) => void>,
    filter: Function as PropType<(query: string, node: TreeNodeData) => boolean>,
    nothingFoundMessage: { default: undefined },
    allowDeselect: { type: Boolean, default: true },
    clearable: Boolean,
    maxValues: { type: Number, default: Infinity },
    maxDisplayedValues: Number,
    maxDisplayedValuesContent: {
      type: [String, Number, Function] as PropType<any>,
      default: undefined,
    },
    onRemove: Function as PropType<(value: string) => void>,
    onClear: Function as PropType<() => void>,
    renderNode: Function as PropType<any>,
    withLines: { type: Boolean, default: true },
    hiddenInputProps: Object,
    hiddenInputValuesDivider: { type: String, default: ',' },
    maxDropdownHeight: { type: [Number, String], default: 220 },
    scrollAreaProps: Object,
    dropdownOpened: { type: Boolean, default: undefined },
    defaultDropdownOpened: Boolean,
    onDropdownOpen: Function as PropType<() => void>,
    onDropdownClose: Function as PropType<() => void>,
    comboboxProps: Object,
    clearSearchOnChange: { type: Boolean, default: true },
    openOnFocus: { type: Boolean, default: true },
    chevronAriaLabels: Object as PropType<TreeSelectChevronAriaLabels>,
  },
  emits: ['update:modelValue', 'update:searchValue'],
  setup(props, { attrs, emit }) {
    const isMulti = () => props.mode !== 'single'

    const initial = props.defaultValue !== undefined ? props.defaultValue : isMulti() ? [] : null
    const internal = ref<any>(initial)
    const current = () => props.modelValue ?? props.value ?? internal.value
    const setValue = (value: any) => {
      if (props.modelValue === undefined && props.value === undefined) internal.value = value
      props.onChange?.(value)
      emit('update:modelValue', value)
    }

    const initialExpanded = props.defaultExpandAll
      ? allValues(props.data)
      : (props.defaultExpandedValues ?? [])
    const expandedInternal = ref<string[]>(initialExpanded)
    const expanded = () => props.expandedValues ?? expandedInternal.value
    const setExpanded = (values: string[]) => {
      if (props.expandedValues === undefined) expandedInternal.value = values
      props.onExpandedChange?.(values)
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
      props.onSearchChange?.(value)
      emit('update:searchValue', value)
      combobox.resetSelectedOption()
    }

    const combobox = useCombobox({
      opened: () => props.dropdownOpened,
      defaultOpened: props.defaultDropdownOpened,
      onDropdownOpen: props.onDropdownOpen,
      onDropdownClose: () => {
        props.onDropdownClose?.()
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
      props.onRemove?.(value)
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

    return () => {
      const disabled = !!(attrs as any).disabled
      const readOnly = !!(attrs as any).readOnly
      const multiValues = selectedArray()
      const hasValue = isMulti() ? multiValues.length > 0 : current() != null
      const canClear = props.clearable && hasValue && !disabled && !readOnly

      const clear = (event: MouseEvent) => {
        event.stopPropagation()
        setValue(isMulti() ? [] : null)
        setSearch('')
        props.onClear?.()
      }

      const rightSection = canClear
        ? h(Combobox.ClearButton, { ...(attrs as any).clearButtonProps, onClick: clear })
        : ((attrs as any).rightSection ??
          h(Combobox.Chevron, { size: (attrs as any).size ?? 'sm', error: (attrs as any).error }))

      const forwarded: any = { ...attrs }
      ;['name', 'form', 'rightSection', 'clearButtonProps', 'placeholder'].forEach(
        (key) => delete forwarded[key],
      )

      const field = (multi: boolean) =>
        h(PillsInput.Field, {
          value: search(),
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
            if (
              event.key === 'Backspace' &&
              multi &&
              !search() &&
              multiValues.length &&
              !readOnly
            ) {
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
        : h(InputBase, {
            ...forwarded,
            __staticSelector: 'TreeSelect',
            component: 'input',
            disabled,
            readonly: !props.searchable || readOnly,
            pointer: !props.searchable,
            value: search(),
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
          })

      const treeOptions = flat.value.map((flatNode) => {
        const {
          node,
          level,
          hasChildren,
          expanded: nodeExpanded,
          isLastChild,
          lineGuides,
        } = flatNode
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
          renderNode: props.renderNode,
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
          : props.nothingFoundMessage != null
            ? h(Combobox.Empty, null, () => props.nothingFoundMessage)
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
  },
})

Object.assign(TreeSelect, { classes: { ...InputBase.classes, ...Combobox.classes, ...classes } })
