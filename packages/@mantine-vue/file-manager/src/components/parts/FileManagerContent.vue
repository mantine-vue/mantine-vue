<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, watch } from 'vue'
import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  EmptyState,
  Loader,
  Pagination,
  Skeleton,
  Stack,
  Table,
  useDirection,
  VisuallyHidden,
} from '@mantine-vue/core'
import { useLongPress, useResizeObserver } from '@mantine-vue/hooks'
import { findEntryElement } from '../../composables/use-file-manager-ui'
import { useVirtualRows } from '../../composables/use-virtual-rows'
import { hasPermission } from '../../core/capabilities'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileEntry, FileSortField } from '../../types'
import FileManagerActionIcon from './FileManagerActionIcon.vue'
import FileManagerItem from './FileManagerItem.vue'
import FileManagerThumbnail from './FileManagerThumbnail.vue'

defineOptions({ name: 'FileManagerContent' })

const { controller, labels, config, ui, compact, getStyles, slots } = useFileManagerContext()
const { dir } = useDirection()

const GRID_GAP = 8

const view = computed(
  () =>
    config.value.views.find((item) => item.name === controller.view.value) ?? config.value.views[0],
)
const isTable = computed(() => view.value.name === 'details' && !view.value.component)
const isTree = computed(() => view.value.name === 'tree' && !controller.isSearching.value)
const isCard = computed(() => view.value.layout === 'grid')

const { ref: scroller, rect } = useResizeObserver<HTMLElement>()

const setScroller = (node: unknown) => {
  const element = ((node as any)?.$el ?? node) as HTMLElement | null

  scroller.value = element
  ui.contentElement.value = element
}

const columns = computed(() => {
  if (!isCard.value || rect.value.width === 0) {
    return 1
  }

  const min = view.value.minItemWidth ?? 160

  return Math.max(1, Math.floor((rect.value.width + GRID_GAP) / (min + GRID_GAP)))
})

const entries = computed(() => controller.pageEntries.value)
const rowCount = computed(() => Math.ceil(entries.value.length / columns.value))

const virtualized = computed(() => {
  const setting = config.value.virtualize

  return setting === 'auto' ? entries.value.length > config.value.virtualizeThreshold : setting
})

const { range, totalHeight, offsetTop, offsetBottom, scrollToRow } = useVirtualRows({
  container: scroller,
  count: () => rowCount.value,
  rowHeight: () => view.value.rowHeight,
  enabled: () => virtualized.value,
})

const rows = computed(() => {
  const result: { index: number; entries: FileEntry[] }[] = []

  for (let index = range.value.start; index < range.value.end; index += 1) {
    result.push({
      index,
      entries: entries.value.slice(index * columns.value, (index + 1) * columns.value),
    })
  }

  return result
})

/** Rows that exist, including the ones of pages that are not loaded yet. */
const totalRows = computed(() =>
  controller.isSearching.value || Object.keys(controller.filters.value).length > 0
    ? rowCount.value
    : Math.ceil(Math.max(controller.total.value ?? 0, entries.value.length) / columns.value),
)

const entryOrder = computed(() => new Map(entries.value.map((entry, index) => [entry.id, index])))

/** The tab stop of the list: the active entry, otherwise the first one. */
const tabStopId = computed(() => {
  const active = controller.activeId.value

  return active !== null && entryOrder.value.has(active) ? active : entries.value[0]?.id
})

const gridColumns = computed(() =>
  isCard.value
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`,
        gap: `${GRID_GAP}px`,
      }
    : undefined,
)

const sortState = (field: FileSortField) =>
  controller.sort.value.field === field
    ? controller.sort.value.direction === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none'

const COLUMNS: { field: FileSortField; label: () => string }[] = [
  { field: 'name', label: () => labels.value.name },
  { field: 'size', label: () => labels.value.size },
  { field: 'type', label: () => labels.value.type },
  { field: 'modifiedAt', label: () => labels.value.modified },
]

const visibleColumns = computed(() =>
  compact.value ? COLUMNS.filter((column) => column.field === 'name') : COLUMNS,
)

const allSelected = computed(
  () =>
    entries.value.length > 0 &&
    entries.value.every((entry) => controller.selection.value.has(entry.id)),
)
const someSelected = computed(() => controller.selectedEntries.value.length > 0)

const isVirtualLocation = computed(() => controller.location.value.type !== 'folder')

const getEntryType = (entry: FileEntry) =>
  entry.kind === 'folder'
    ? labels.value.folderKind
    : labels.value.fileTypeName(entry.name.includes('.') ? entry.name.split('.').pop()! : '')

function getEntry(element: Element | null) {
  const id = element?.closest<HTMLElement>('[data-entry-id]')?.dataset.entryId

  return id === undefined
    ? null
    : (controller.visibleEntries.value.find((entry) => entry.id === id) ?? null)
}

/* Pointer */

/** Whether the last press came from a touch screen, where one tap opens an entry. */
let touchInput = false

/** A long press selects, and the tap that follows must not act again. */
let suppressClick = false

const onPointerDown = (event: PointerEvent) => {
  touchInput = event.pointerType === 'touch'
}

function onClick(event: MouseEvent) {
  const target = event.target as HTMLElement

  if (suppressClick) {
    suppressClick = false
    return
  }

  if (target.closest('[data-fm-checkbox]')) {
    return
  }

  const entry = getEntry(target)

  if (!entry) {
    controller.clearSelection()
    return
  }

  if (target.closest('[data-fm-expander]')) {
    controller.toggleExpanded(entry)
    return
  }

  if (target.closest('[data-fm-more]')) {
    openItemMenu(entry, target.closest('[data-fm-more]')!.getBoundingClientRect())
    return
  }

  if (ui.selectionMode.value) {
    controller.select(entry.id, 'toggle')

    if (controller.selection.value.size === 0) {
      ui.selectionMode.value = false
    }

    return
  }

  if (event.shiftKey) {
    controller.select(entry.id, 'range')
  } else if (event.ctrlKey || event.metaKey) {
    controller.select(entry.id, 'toggle')
  } else if (touchInput || config.value.openOnSingleClick) {
    controller.activeId.value = entry.id
    controller.open(entry)
  } else {
    controller.select(entry.id)
  }
}

function onDoubleClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const entry = getEntry(target)

  if (entry && !target.closest('[data-fm-more], [data-fm-checkbox], [data-fm-expander]')) {
    controller.open(entry)
  }
}

function openItemMenu(entry: FileEntry, rect: Pick<DOMRect, 'left' | 'bottom'>) {
  if (!controller.isSelected(entry.id)) {
    controller.select(entry.id)
  }

  ui.openContextMenu({
    x: rect.left,
    y: rect.bottom,
    entries: controller.selectedEntries.value,
    scope: 'item',
  })
}

function onContextMenu(event: MouseEvent) {
  const entry = getEntry(event.target as Element)

  event.preventDefault()

  if (entry) {
    openItemMenu(entry, { left: event.clientX, bottom: event.clientY })
  } else {
    controller.clearSelection()
    ui.openContextMenu({ x: event.clientX, y: event.clientY, entries: [], scope: 'background' })
  }
}

const longPress = useLongPress(
  (event) => {
    const entry = getEntry(event.target as Element)

    if (entry) {
      suppressClick = true
      ui.selectionMode.value = true
      controller.select(entry.id, 'add')
    }
  },
  { events: ['touch'], threshold: 450, cancelOnMove: 10 },
)

/* Keyboard */

let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => clearTimeout(typeaheadTimer))

function focusEntry(id: string) {
  const index = entryOrder.value.get(id)

  if (index !== undefined) {
    scrollToRow(Math.floor(index / columns.value))
  }

  void nextTick(() => {
    findEntryElement(scroller.value, id)?.focus()
  })
}

function moveTo(index: number, event: KeyboardEvent) {
  const entry = entries.value[Math.min(Math.max(index, 0), entries.value.length - 1)]

  if (!entry) {
    return
  }

  if (event.shiftKey) {
    controller.select(entry.id, 'range')
  } else if (event.ctrlKey || event.metaKey) {
    controller.activeId.value = entry.id
  } else {
    controller.select(entry.id)
  }

  focusEntry(entry.id)
}

function findByPrefix(prefix: string, from: number) {
  const list = entries.value
  const lower = prefix.toLowerCase()

  for (let offset = 0; offset < list.length; offset += 1) {
    const entry = list[(from + offset) % list.length]

    if (entry.name.toLowerCase().startsWith(lower)) {
      return entry
    }
  }

  return undefined
}

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement

  if (target.closest('input, button, a') && !target.hasAttribute('data-entry-id')) {
    return
  }

  const activeIndex = entryOrder.value.get(tabStopId.value ?? '') ?? 0
  const current = entries.value[activeIndex]
  const inline = dir.value === 'rtl' ? -1 : 1
  const pageRows = Math.max(
    1,
    Math.floor((scroller.value?.clientHeight ?? 0) / view.value.rowHeight),
  )

  const steps: Record<string, number | undefined> = {
    ArrowDown: columns.value,
    ArrowUp: -columns.value,
    PageDown: pageRows * columns.value,
    PageUp: -pageRows * columns.value,
  }

  if (isCard.value) {
    steps.ArrowRight = inline
    steps.ArrowLeft = -inline
  }

  if (event.altKey) {
    return
  }

  const step = steps[event.key]

  if (step !== undefined) {
    event.preventDefault()
    moveTo(activeIndex + step, event)
    return
  }

  if (isTree.value && current?.kind === 'folder') {
    const expanded = controller.treeExpanded.value.has(current.id)
    const opens = event.key === (inline === 1 ? 'ArrowRight' : 'ArrowLeft')
    const closes = event.key === (inline === 1 ? 'ArrowLeft' : 'ArrowRight')

    if ((opens && !expanded) || (closes && expanded)) {
      event.preventDefault()
      controller.toggleExpanded(current)
      return
    }
  }

  switch (event.key) {
    case 'Home':
      event.preventDefault()
      moveTo(0, event)
      return
    case 'End':
      event.preventDefault()
      moveTo(entries.value.length - 1, event)
      return
    case 'Enter':
      if (current) {
        event.preventDefault()
        controller.open(current)
      }
      return
    case ' ':
      if (current) {
        event.preventDefault()
        controller.select(current.id, 'toggle')
      }
      return
    case 'Backspace':
      event.preventDefault()
      controller.goUp()
      return
    case 'Escape':
      if (controller.selection.value.size > 0) {
        event.preventDefault()
        controller.clearSelection()
      }
      ui.selectionMode.value = false
      return
    case 'ContextMenu':
    case 'F10':
      if (event.key === 'F10' && !event.shiftKey) {
        return
      }

      event.preventDefault()

      if (current) {
        openItemMenu(
          current,
          findEntryElement(scroller.value, current.id)?.getBoundingClientRect() ?? {
            left: 0,
            bottom: 0,
          },
        )
      }
      return
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
    clearTimeout(typeaheadTimer)
    typeahead += event.key
    typeaheadTimer = setTimeout(() => {
      typeahead = ''
    }, 600)

    // A repeated letter cycles through the entries that start with it.
    const repeated = typeahead.split('').every((letter) => letter === typeahead[0])
    const match = findByPrefix(
      repeated ? typeahead[0] : typeahead,
      activeIndex + (repeated ? 1 : 0),
    )

    if (match) {
      controller.select(match.id)
      focusEntry(match.id)
    }
  }
}

/* Drag and drop */

const canDrag = computed(
  () =>
    config.value.draggable &&
    !compact.value &&
    (controller.capabilities.value.move || controller.capabilities.value.copy) &&
    !controller.inTrash.value,
)

function onDragStart(event: DragEvent) {
  const entry = getEntry(event.target as Element)

  if (!entry || !canDrag.value) {
    event.preventDefault()
    return
  }

  if (!controller.isSelected(entry.id)) {
    controller.select(entry.id)
  }

  ui.startDrag(
    event,
    controller.selectedEntries.value.filter(
      (item) => hasPermission(item, 'move') || hasPermission(item, 'copy'),
    ),
  )
}

function onDragOver(event: DragEvent) {
  const entry = getEntry(event.target as Element)

  if (entry?.kind === 'folder') {
    ui.onFolderDragOver(event, entry.id, entry)
  } else {
    // Files dropped between rows land in the current folder, through the dropzone.
    ui.dropTarget.value = null
  }
}

function onDrop(event: DragEvent) {
  const entry = getEntry(event.target as Element)

  if (entry?.kind === 'folder') {
    ui.onFolderDrop(event, entry.id)
  }
}

const dropKey = computed(() => ui.dropTarget.value)

/* Paging */

// New pages load before the end is reached, so scrolling does not stop at a spinner.
watch(
  () => range.value.end,
  (end) => {
    if (
      controller.pagination.value === 'infinite' &&
      controller.hasMore.value &&
      end >= rowCount.value - 2
    ) {
      void controller.loadMore()
    }
  },
)

watch(
  controller.location,
  () => {
    if (scroller.value) {
      scroller.value.scrollTop = 0
    }
  },
  { flush: 'post' },
)

const emptyState = computed(() => {
  if (controller.isSearching.value) {
    return {
      icon: 'search',
      title: labels.value.emptySearch,
      description: labels.value.emptySearchDescription,
    } as const
  }

  if (Object.keys(controller.filters.value).length > 0) {
    return {
      icon: 'filter',
      title: labels.value.emptyFilters,
      description: labels.value.emptyFiltersDescription,
    } as const
  }

  switch (controller.location.value.type) {
    case 'favorites':
      return { icon: 'star', title: labels.value.emptyFavorites } as const
    case 'recent':
      return { icon: 'clock', title: labels.value.emptyRecent } as const
    case 'trash':
      return { icon: 'trash', title: labels.value.emptyTrashState } as const
    default:
      return {
        icon: 'folder',
        title: labels.value.emptyFolder,
        description: controller.canWriteHere.value
          ? labels.value.emptyFolderDescription
          : undefined,
      } as const
  }
})

const retry = () => controller.load({ force: true })
const goHome = () => controller.openFolder(null)
const onSort = (field: FileSortField) => controller.toggleSort(field)

function toggleAll() {
  if (allSelected.value) {
    controller.clearSelection()
  } else {
    controller.selectAll()
  }
}
</script>

<template>
  <div v-bind="getStyles('main')">
    <template v-if="controller.error.value">
      <component :is="slots.error" v-if="slots.error" :controller="controller" :retry="retry" />
      <Center v-else v-bind="getStyles('state')" role="alert">
        <EmptyState>
          <template #icon><FileManagerIcon name="alert" :size="24" /></template>
          <template #title>{{ labels.loadError }}</template>
          <template #description>
            {{ controller.error.value.message || labels.errors[controller.error.value.code] }}
          </template>
          <EmptyState.Actions>
            <Button size="xs" data-action="retry" @click="retry">{{ labels.retry }}</Button>
            <Button size="xs" variant="default" data-action="goHome" @click="goHome">
              {{ labels.goHome }}
            </Button>
          </EmptyState.Actions>
        </EmptyState>
      </Center>
    </template>

    <template v-else-if="controller.loading.value && entries.length === 0">
      <component :is="slots.loading" v-if="slots.loading" />
      <Stack
        v-else
        v-bind="getStyles('state')"
        gap="xs"
        aria-busy="true"
        :aria-label="labels.loading"
      >
        <Skeleton v-for="index in 8" :key="index" :height="view.rowHeight > 60 ? 80 : 32" />
      </Stack>
    </template>

    <div
      v-else
      :ref="setScroller"
      v-bind="{ ...getStyles('scroller'), ...longPress }"
      :data-view="view.name"
      :data-sticky-offset="isTable ? view.rowHeight : undefined"
      :tabindex="entries.length === 0 ? 0 : -1"
      @pointerdown="onPointerDown"
      @click="onClick"
      @dblclick="onDoubleClick"
      @contextmenu="onContextMenu"
      @keydown="onKeydown"
      @dragstart="onDragStart"
      @dragover="onDragOver"
      @drop="onDrop"
      @dragend="ui.endDrag"
    >
      <template v-if="entries.length === 0">
        <component :is="slots.empty" v-if="slots.empty" :controller="controller" />
        <Center v-else v-bind="getStyles('state')">
          <EmptyState>
            <template #icon><FileManagerActionIcon :icon="emptyState.icon" :size="24" /></template>
            <template #title>{{ emptyState.title }}</template>
            <template v-if="emptyState.description" #description>
              {{ emptyState.description }}
            </template>
          </EmptyState>
        </Center>
      </template>

      <Table
        v-else-if="isTable"
        v-bind="getStyles('table')"
        role="grid"
        layout="fixed"
        highlight-on-hover
        sticky-header
        :aria-label="labels.content"
        aria-multiselectable="true"
        :aria-rowcount="totalRows + 1"
      >
        <Table.Thead>
          <Table.Tr role="row">
            <Table.Th role="columnheader" data-fm-select-column>
              <Checkbox
                size="xs"
                tabindex="-1"
                :aria-label="labels.selectAll"
                :checked="allSelected"
                :indeterminate="someSelected && !allSelected"
                @update:checked="toggleAll"
              />
            </Table.Th>
            <Table.Th
              v-for="column in visibleColumns"
              :key="column.field"
              role="columnheader"
              :aria-sort="sortState(column.field)"
              :data-column="column.field"
            >
              <button type="button" :data-sort="column.field" @click.stop="onSort(column.field)">
                {{ column.label() }}
                <FileManagerIcon
                  v-if="sortState(column.field) !== 'none'"
                  :name="sortState(column.field) === 'ascending' ? 'arrowUp' : 'arrowDown'"
                  :size="12"
                />
              </button>
            </Table.Th>
            <Table.Th role="columnheader" data-fm-more-column>
              <VisuallyHidden>{{ labels.moreActions }}</VisuallyHidden>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <tr v-if="offsetTop > 0" aria-hidden="true" :style="{ height: `${offsetTop}px` }" />
          <Table.Tr
            v-for="row in rows"
            :key="row.entries[0].id"
            role="row"
            :aria-rowindex="row.index + 2"
            :aria-selected="controller.isSelected(row.entries[0].id)"
            :tabindex="row.entries[0].id === tabStopId ? 0 : -1"
            :aria-label="row.entries[0].name"
            :data-entry-id="row.entries[0].id"
            :data-selected="controller.isSelected(row.entries[0].id) || undefined"
            :data-cut="controller.isCut(row.entries[0].id) || undefined"
            :data-drop-target="dropKey === row.entries[0].id || undefined"
            :data-kind="row.entries[0].kind"
            :draggable="canDrag"
            :style="{ height: `${view.rowHeight}px` }"
          >
            <Table.Td role="gridcell" data-fm-checkbox data-visible>
              <Checkbox
                size="xs"
                tabindex="-1"
                :aria-label="labels.selectItem(row.entries[0].name)"
                :checked="controller.isSelected(row.entries[0].id)"
                @update:checked="controller.select(row.entries[0].id, 'toggle')"
              />
            </Table.Td>
            <Table.Td role="gridcell">
              <div data-fm-name-cell>
                <FileManagerThumbnail :entry="row.entries[0]" />
                <span v-bind="getStyles('itemName')" :title="row.entries[0].name">
                  {{ row.entries[0].name }}
                </span>
                <FileManagerIcon
                  v-if="row.entries[0].starred"
                  name="star"
                  :size="12"
                  data-fm-star
                />
              </div>
              <span
                v-if="row.entries[0].path && (controller.isSearching.value || isVirtualLocation)"
                v-bind="getStyles('itemMeta')"
              >
                {{ row.entries[0].originalPath ?? row.entries[0].path }}
              </span>
            </Table.Td>
            <template v-if="!compact">
              <Table.Td role="gridcell" data-column="size">
                {{
                  row.entries[0].kind === 'file' ? config.formatters.size(row.entries[0].size) : ''
                }}
              </Table.Td>
              <Table.Td role="gridcell" data-column="type">{{
                getEntryType(row.entries[0])
              }}</Table.Td>
              <Table.Td role="gridcell" data-column="modifiedAt">
                {{ config.formatters.date(row.entries[0].modifiedAt) }}
              </Table.Td>
            </template>
            <Table.Td role="gridcell" data-fm-more-column>
              <ActionIcon
                v-bind="getStyles('itemControl')"
                data-fm-more
                variant="subtle"
                color="gray"
                size="sm"
                tabindex="-1"
                :aria-label="labels.itemActions(row.entries[0].name)"
              >
                <FileManagerIcon name="dots" :size="14" />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
          <tr v-if="offsetBottom > 0" aria-hidden="true" :style="{ height: `${offsetBottom}px` }" />
        </Table.Tbody>
      </Table>

      <div
        v-else
        :role="isTree ? 'treegrid' : 'grid'"
        :aria-label="labels.content"
        aria-multiselectable="true"
        :aria-rowcount="totalRows"
        :aria-colcount="columns"
        :style="{ minHeight: `${totalHeight}px`, paddingTop: `${offsetTop}px` }"
      >
        <div
          v-for="row in rows"
          :key="row.index"
          v-bind="getStyles('row')"
          role="row"
          :aria-rowindex="row.index + 1"
          :aria-level="
            isTree ? (controller.entryDepths.value.get(row.entries[0].id) ?? 0) + 1 : undefined
          "
          :aria-expanded="
            isTree && row.entries[0].kind === 'folder'
              ? controller.treeExpanded.value.has(row.entries[0].id)
              : undefined
          "
          :style="{ height: `${view.rowHeight}px`, ...gridColumns }"
        >
          <template v-for="entry in row.entries" :key="entry.id">
            <div
              v-if="view.component"
              :data-entry-id="entry.id"
              role="gridcell"
              :tabindex="entry.id === tabStopId ? 0 : -1"
              :aria-selected="controller.isSelected(entry.id)"
              :aria-label="entry.name"
              :draggable="canDrag"
            >
              <component
                :is="view.component"
                :entry="entry"
                :selected="controller.isSelected(entry.id)"
                :active="entry.id === tabStopId"
                :cut="controller.isCut(entry.id)"
                :depth="0"
              />
            </div>
            <FileManagerItem
              v-else
              :entry="entry"
              :view="view.name"
              :card="isCard"
              :selected="controller.isSelected(entry.id)"
              :active="entry.id === tabStopId"
              :cut="controller.isCut(entry.id)"
              :depth="controller.entryDepths.value.get(entry.id) ?? 0"
              :drop-target="dropKey === entry.id"
              :draggable="canDrag"
            />
          </template>
        </div>
      </div>

      <Center v-if="controller.pagination.value === 'infinite' && controller.hasMore.value" py="sm">
        <Loader v-if="controller.loadingMore.value" size="sm" :aria-label="labels.loadingMore" />
        <Button
          v-else
          size="xs"
          variant="default"
          data-action="loadMore"
          @click.stop="controller.loadMore()"
        >
          {{ labels.loadMore }}
        </Button>
      </Center>
    </div>

    <div
      v-if="controller.pagination.value === 'pages' && controller.pageCount.value > 1"
      v-bind="getStyles('pagination')"
    >
      <Pagination
        size="sm"
        :total="controller.pageCount.value"
        :value="controller.page.value"
        :aria-label="labels.pagination"
        @change="controller.setPage"
      />
    </div>
  </div>
</template>
