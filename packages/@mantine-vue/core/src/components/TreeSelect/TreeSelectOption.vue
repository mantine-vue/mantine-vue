<script lang="ts">
import type { TreeNodeData } from '../Tree'
import type { TreeSelectChevronAriaLabels, TreeSelectRenderNodePayload } from './TreeSelect.types'

/** Props of `TreeSelectOption`. This component is internal to `TreeSelect`. */
export interface TreeSelectOptionProps {
  /** Data of the node this row renders. */
  node: TreeNodeData

  /** Depth of the node, starting at 1. */
  level: number

  /** Whether the node has children. */
  hasChildren?: boolean

  /** Expanded state of the node. */
  expanded?: boolean

  /** Selected state, used in `single` and `multiple` mode. */
  selected?: boolean

  /** Checked state, used in `checkbox` mode. */
  checked?: boolean

  /** Whether some but not all descendants are checked. */
  indeterminate?: boolean

  /** If set, a checkbox indicator is rendered. */
  showCheckbox?: boolean

  /** Whether this node is the last child of its parent, which shortens the branch line. */
  isLastChild?: boolean

  /** Which ancestor levels still have a following sibling and so need a guide line. */
  lineGuides?: boolean[]

  /** If set, the connector lines are rendered. */
  withLines?: boolean

  /** Called with the node value when the chevron is activated. */
  onToggleExpand?: (value: string) => void

  /** Custom markup for the row. */
  renderNode?: (payload: TreeSelectRenderNodePayload) => import('vue').VNodeChild

  /** Labels for the expand and collapse actions of the chevron. */
  chevronAriaLabels?: TreeSelectChevronAriaLabels
}
</script>

<script setup lang="ts">
import { computed, h, useAttrs, type VNodeChild } from 'vue'
import { AccordionChevron } from '../Accordion'
import { CheckIcon, CheckboxIndicator } from '../Checkbox'
import { ComboboxOption } from '../Combobox'
import { BASE_PADDING, LEVEL_OFFSET, LINE_CONTENT_GAP, OPTION_GAP } from './tree-select-utils'
import classes from './TreeSelect.module.css'

defineOptions({
  name: 'TreeSelectOption',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeSelectOptionProps>(), {
  hasChildren: false,
  expanded: false,
  selected: false,
  checked: false,
  indeterminate: false,
  showCheckbox: false,
  isLastChild: false,
  lineGuides: () => [],
  withLines: true,
})

const attrs = useAttrs()

/** Indent grows one `LEVEL_OFFSET` per level. */
const indentPx = computed(() => (props.level - 1) * LEVEL_OFFSET)

/**
 * A nested row leaves room for the connector lines, and a leaf leaves room where a
 * parent would draw its chevron, so labels line up down a branch.
 */
const paddingInlineStart = computed(
  () =>
    BASE_PADDING +
    indentPx.value +
    (props.withLines && props.level > 1 ? LINE_CONTENT_GAP : 0) +
    (!props.hasChildren ? OPTION_GAP : 0),
)

const isActive = computed(() => props.selected || props.checked)

/** `mixed` is the ARIA value for a partially checked parent. */
const ariaChecked = computed(() =>
  props.showCheckbox
    ? props.indeterminate && !props.checked
      ? 'mixed'
      : props.checked
    : undefined,
)

function expand(event?: Event) {
  // The chevron sits inside the option, whose click would submit the value.
  event?.preventDefault()
  event?.stopPropagation()

  if (props.hasChildren) {
    props.onToggleExpand?.(props.node.value)
  }
}

function onChevronKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    expand(event)
  }
}

const payload = computed<TreeSelectRenderNodePayload>(() => ({
  node: props.node,
  level: props.level,
  expanded: props.expanded,
  hasChildren: props.hasChildren,
  selected: props.selected,
  checked: props.checked,
  indeterminate: props.indeterminate,
  expand,
}))

const customContent = computed(() => (props.renderNode ? props.renderNode(payload.value) : null))

/**
 * The connector lines are absolutely positioned spans rather than borders: a border on
 * the row itself could not skip the levels whose ancestor has no following sibling.
 */
const lineElements = computed<VNodeChild>(() =>
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
          // The last child stops the vertical line halfway, at its own elbow.
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
    : [],
)

/** Rendered through `<component :is>`: both are VNode trees, not markup. */
const renderLines = (): VNodeChild => lineElements.value
const renderCustom = (): VNodeChild => customContent.value
</script>

<template>
  <ComboboxOption
    v-bind="attrs"
    :class="[classes.option, (attrs as any).class]"
    :value="props.node.value"
    :disabled="props.node.nodeProps?.disabled"
    :active="isActive"
    :aria-selected="isActive"
    :aria-level="props.level"
    :aria-expanded="props.hasChildren ? props.expanded : undefined"
    :aria-checked="ariaChecked"
    :style="[{ paddingInlineStart: `${paddingInlineStart}px` }, (attrs as any).style]"
  >
    <component :is="renderLines" />

    <component :is="renderCustom" v-if="customContent" />
    <template v-else>
      <span
        v-if="props.hasChildren"
        :class="classes.expandIcon"
        :data-expanded="props.expanded || undefined"
        role="button"
        :tabindex="-1"
        :aria-label="
          props.expanded
            ? (props.chevronAriaLabels?.collapse ?? 'Collapse')
            : (props.chevronAriaLabels?.expand ?? 'Expand')
        "
        @mousedown="(event: MouseEvent) => event.preventDefault()"
        @click="expand"
        @keydown="onChevronKeydown"
      >
        <AccordionChevron size="80%" />
      </span>

      <CheckboxIndicator
        v-if="props.showCheckbox"
        :checked="props.checked || props.indeterminate"
        :indeterminate="!props.checked && props.indeterminate"
        size="18px"
      />

      <span :class="classes.label">{{ String(props.node.label) }}</span>

      <!-- Selected rows outside checkbox mode get a check icon instead of a box. -->
      <CheckIcon v-if="!props.showCheckbox && isActive" :class="classes.checkIcon" />
    </template>
  </ComboboxOption>
</template>
