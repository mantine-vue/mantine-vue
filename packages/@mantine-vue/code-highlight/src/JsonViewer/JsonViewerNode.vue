<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tooltip, UnstyledButton } from '@mantine-vue/core'
import { useClipboard } from '@mantine-vue/hooks'
import {
  formatValue,
  getArrayChunks,
  getChunkSegment,
  getEntries,
  getTypeLabel,
  getValueType,
  isExpandableValue,
  resolveDisplayValue,
  safeStringify,
  serializePath,
  type JsonViewerArrayChunk,
} from './json-viewer-utils'

defineOptions({ name: 'JsonViewerNode' })
const props = defineProps<{
  value: any
  path: string[]
  nodeKey?: string
  level: number
  ancestors: object[]
  expandedPaths: string[]
  togglePath: (path: string) => void
  getStyles: any
  maxDisplayLength: number
  withTypes: boolean
  withSize: boolean
  withCopy: boolean
  withQuotes: boolean
  withKeyQuotes: boolean
  collapseStringsAfterLength: number | false
  sortKeys: boolean | ((a: string, b: string) => number)
  groupArraysAfterLength: number | false
  copyLabel: string
  copiedLabel: string
  onValueSelect?: (path: string[], value: any) => void
  highlightItems?: Record<string, 'added' | 'removed'>
  allExpanded: boolean
  withChevrons: boolean
  isRoot?: boolean
  chunk?: JsonViewerArrayChunk
  chunkEntries?: [string, any][]
}>()

const { copy: copyToClipboard, copied } = useClipboard({ timeout: 1000 })
const stringExpanded = ref(false)
const resolved = computed(() =>
  props.chunk ? props.chunkEntries : resolveDisplayValue(props.value),
)
const circular = computed(
  () =>
    !props.chunk && isExpandableValue(resolved.value) && props.ancestors.includes(resolved.value),
)
const expandable = computed(
  () => props.chunk || (!circular.value && isExpandableValue(resolved.value)),
)
const array = computed(() => props.chunk || Array.isArray(resolved.value))
const pathString = computed(() => serializePath(props.path))
const entries = computed<[string, any][]>(() => {
  if (props.chunk) return props.chunkEntries ?? []
  if (!expandable.value) return []
  const result = getEntries(resolved.value)
  if (!array.value && props.sortKeys) {
    const compare =
      typeof props.sortKeys === 'function'
        ? props.sortKeys
        : (a: string, b: string) => a.localeCompare(b)
    result.sort((a, b) => compare(a[0], b[0]))
  }
  return result
})
const empty = computed(() => expandable.value && entries.value.length === 0)
const expanded = computed(
  () =>
    !empty.value &&
    (props.isRoot || props.allExpanded || props.expandedPaths.includes(pathString.value)),
)
const canCollapse = computed(() => !empty.value && !props.isRoot && !props.allExpanded)
const chunks = computed(() =>
  !props.chunk && array.value
    ? getArrayChunks(entries.value.length, props.groupArraysAfterLength)
    : null,
)
const shownEntries = computed(() =>
  chunks.value ? entries.value : entries.value.slice(0, props.maxDisplayLength),
)
const primitiveType = computed(() => (circular.value ? 'circular' : getValueType(resolved.value)))
const shouldCollapseString = computed(
  () =>
    typeof resolved.value === 'string' &&
    props.collapseStringsAfterLength !== false &&
    resolved.value.length > props.collapseStringsAfterLength,
)
const formatted = computed(() =>
  circular.value
    ? { display: '[Circular]', collapsed: false }
    : formatValue(
        resolved.value,
        props.withQuotes,
        stringExpanded.value ? false : props.collapseStringsAfterLength,
      ),
)
const openBracket = computed(() => (array.value ? '[' : '{'))
const closeBracket = computed(() => (array.value ? ']' : '}'))
const childAncestors = computed(() =>
  props.chunk ? props.ancestors : [...props.ancestors, resolved.value],
)
function toggle() {
  if (canCollapse.value) props.togglePath(pathString.value)
}
function copy(event: Event) {
  event.stopPropagation()
  copyToClipboard(safeStringify(resolved.value))
}
function select(event?: Event) {
  event?.stopPropagation()
  props.onValueSelect?.(props.path, resolved.value)
}
function stopCopyKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') event.stopPropagation()
}
function focusSibling(row: HTMLElement, direction: number) {
  const root = row.closest('[data-jv-root]')
  const rows = Array.from(root?.querySelectorAll<HTMLElement>('[data-jv-node]') ?? [])
  const index = rows.indexOf(row)
  rows[index + direction]?.focus()
}
function onKeydown(event: KeyboardEvent) {
  const row = event.currentTarget as HTMLElement
  if (
    (event.ctrlKey || event.metaKey) &&
    event.code === 'KeyC' &&
    !window.getSelection()?.toString()
  ) {
    event.preventDefault()
    row.querySelector<HTMLElement>('[data-jv-copy]')?.click()
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    if (event.target !== row) return
    event.preventDefault()
    if (expandable.value) toggle()
    else select()
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    focusSibling(row, event.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (expanded.value)
      row.parentElement
        ?.querySelector<HTMLElement>(':scope > [role="group"] [data-jv-node]')
        ?.focus()
    else toggle()
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (expanded.value && canCollapse.value) toggle()
    else
      row.parentElement?.parentElement
        ?.closest('[data-jv-node-wrapper]')
        ?.querySelector<HTMLElement>(':scope > [data-jv-node]')
        ?.focus()
  }
}
</script>

<template>
  <div
    v-if="expandable"
    v-bind="props.getStyles('node')"
    data-jv-node-wrapper
    :data-type="array ? 'array' : 'object'"
    :data-highlight="props.highlightItems?.[pathString]"
  >
    <div
      v-bind="props.getStyles('row')"
      role="treeitem"
      :aria-expanded="empty ? undefined : expanded"
      :aria-level="props.level"
      data-jv-node
      data-jv-row
      data-hoverable
      :data-root="props.isRoot || undefined"
      :tabindex="props.isRoot ? 0 : -1"
      @click.stop="toggle"
      @keydown="onKeydown"
    >
      <span
        v-if="canCollapse && props.withChevrons"
        v-bind="props.getStyles('toggle')"
        :data-expanded="expanded || undefined"
      >
        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
          <path
            d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
          />
        </svg>
      </span>
      <span
        v-if="props.nodeKey !== undefined || props.chunk"
        v-bind="props.getStyles('key')"
        data-key
        >{{
          props.chunk
            ? getChunkSegment(props.chunk)
            : props.withKeyQuotes
              ? JSON.stringify(props.nodeKey)
              : props.nodeKey
        }}<template v-if="!props.chunk">: </template></span
      >
      <span v-bind="props.getStyles('bracket')">{{ openBracket }}</span>
      <span v-if="!empty && !expanded" v-bind="props.getStyles('ellipsis')">...</span>
      <span v-if="empty || !expanded" v-bind="props.getStyles('bracket')">{{ closeBracket }}</span>
      <span
        v-if="props.withTypes"
        v-bind="props.getStyles('type')"
        :data-value-type="array ? 'array' : 'object'"
        >{{ array ? 'array' : 'object' }}</span
      >
      <span v-if="props.withSize" v-bind="props.getStyles('size')"
        >{{ entries.length }} {{ array ? 'items' : 'keys' }}</span
      >
      <Tooltip
        v-if="props.withCopy && !props.chunk"
        :label="copied ? props.copiedLabel : props.copyLabel"
        position="top"
        fz="xs"
      >
        <UnstyledButton
          tabindex="-1"
          data-jv-copy
          v-bind="props.getStyles('copyButton')"
          :aria-label="copied ? props.copiedLabel : props.copyLabel"
          @click="copy"
          @keydown="stopCopyKeydown"
        >
          <svg v-if="copied" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
            />
          </svg>
          <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
            />
            <path
              d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
            />
          </svg>
        </UnstyledButton>
      </Tooltip>
    </div>
    <template v-if="expanded">
      <div role="group" :style="{ paddingLeft: 'var(--jv-indent)' }">
        <JsonViewerNode
          v-for="chunkItem in chunks"
          :key="chunkItem.start"
          v-bind="props"
          :path="[...props.path, getChunkSegment(chunkItem)]"
          :level="props.level + 1"
          :ancestors="childAncestors"
          :chunk="chunkItem"
          :chunk-entries="entries.slice(chunkItem.start, chunkItem.end + 1)"
          :is-root="false"
        />
        <JsonViewerNode
          v-for="[key, item] in chunks ? [] : shownEntries"
          :key="key"
          v-bind="props"
          :value="item"
          :path="props.chunk ? [...props.path.slice(0, -1), key] : [...props.path, key]"
          :node-key="array ? undefined : key"
          :level="props.level + 1"
          :ancestors="childAncestors"
          :chunk="undefined"
          :chunk-entries="undefined"
          :is-root="false"
        />
        <div
          v-if="!chunks && entries.length > props.maxDisplayLength"
          v-bind="props.getStyles('row')"
          data-jv-row
        >
          <span v-bind="props.getStyles('size')"
            >... {{ entries.length - props.maxDisplayLength }} more
            {{ array ? 'items' : 'keys' }}</span
          >
        </div>
      </div>
      <div v-bind="props.getStyles('row')" data-jv-row aria-hidden="true">
        <span v-bind="props.getStyles('bracket')">{{ closeBracket }}</span>
      </div>
    </template>
  </div>
  <div
    v-else
    v-bind="props.getStyles('node')"
    data-jv-node-wrapper
    :data-type="primitiveType"
    :data-highlight="props.highlightItems?.[pathString]"
  >
    <div
      v-bind="props.getStyles('row')"
      role="treeitem"
      :aria-level="props.level"
      data-jv-node
      data-jv-row
      data-hoverable
      :data-root="props.isRoot || undefined"
      :tabindex="props.isRoot ? 0 : -1"
      @click="select"
      @keydown="onKeydown"
    >
      <span v-if="props.nodeKey !== undefined" v-bind="props.getStyles('key')"
        >{{ props.withKeyQuotes ? JSON.stringify(props.nodeKey) : props.nodeKey }}:
      </span>
      <span
        v-bind="props.getStyles('value')"
        :data-value-type="primitiveType"
        :data-wrap="primitiveType === 'string' && formatted.display.length > 20 ? true : undefined"
        >{{ formatted.display }}</span
      >
      <UnstyledButton
        v-if="shouldCollapseString"
        v-bind="props.getStyles('ellipsis')"
        :aria-expanded="stringExpanded"
        data-clickable
        @click.stop="stringExpanded = !stringExpanded"
      >
        {{ stringExpanded ? 'show less' : 'show more' }}
      </UnstyledButton>
      <span
        v-if="props.withTypes"
        v-bind="props.getStyles('type')"
        :data-value-type="primitiveType"
        >{{ circular ? 'circular' : getTypeLabel(resolved) }}</span
      >
      <Tooltip
        v-if="props.withCopy"
        :label="copied ? props.copiedLabel : props.copyLabel"
        position="top"
        fz="xs"
      >
        <UnstyledButton
          tabindex="-1"
          data-jv-copy
          v-bind="props.getStyles('copyButton')"
          :aria-label="copied ? props.copiedLabel : props.copyLabel"
          @click="copy"
          @keydown="stopCopyKeydown"
        >
          <svg v-if="copied" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
            />
          </svg>
          <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
            />
            <path
              d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
            />
          </svg>
        </UnstyledButton>
      </Tooltip>
    </div>
  </div>
</template>
