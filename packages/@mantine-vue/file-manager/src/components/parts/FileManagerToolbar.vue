<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import {
  ActionIcon,
  CloseButton,
  Indicator,
  Menu,
  OverflowList,
  Popover,
  TextInput,
  Tooltip,
} from '@mantine-vue/core'
import { useDebouncedCallback } from '@mantine-vue/hooks'
import { countActiveFilters } from '../../core/sort-filter'
import {
  resolveMenuItems,
  useActionContext,
  useFileManagerContext,
} from '../../FileManager.context'
import type { ResolvedMenuAction } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileManagerIconName } from '../../icons/icon-paths'
import FileManagerActionIcon from './FileManagerActionIcon.vue'
import FileManagerActionMenu from './FileManagerActionMenu.vue'
import FileManagerBreadcrumbs from './FileManagerBreadcrumbs.vue'
import FileManagerFilters from './FileManagerFilters.vue'

defineOptions({ name: 'FileManagerToolbar' })

const ctx = useFileManagerContext()
const { controller, labels, config, ui, compact, getStyles, slots } = ctx

const context = useActionContext(ctx, 'toolbar', () => controller.selectedEntries.value)

const navigationActions = computed(() =>
  resolveMenuItems(
    compact.value ? ['back', 'up'] : ['back', 'forward', 'up', 'refresh'],
    context.value,
    config.value,
  ),
)

const toolbarActions = computed(() =>
  resolveMenuItems(config.value.toolbarActions, context.value, config.value),
)

const overflowActions = computed(() =>
  resolveMenuItems(
    ['refresh', 'selectAll', 'clearSelection', 'divider', ...config.value.toolbarActions],
    context.value,
    config.value,
  ),
)

const VIEW_ICONS: Record<string, FileManagerIconName> = {
  details: 'viewDetails',
  list: 'viewList',
  grid: 'viewGrid',
  gallery: 'viewGallery',
  tree: 'viewTree',
}

const viewOptions = computed(() =>
  config.value.views.map((view) => ({
    name: view.name,
    label: view.label ?? labels.value.views[view.name] ?? view.name,
    icon: view.icon ?? VIEW_ICONS[view.name] ?? 'viewList',
  })),
)

const activeView = computed(
  () =>
    viewOptions.value.find((view) => view.name === controller.view.value) ?? viewOptions.value[0],
)

const runAction = (item: ResolvedMenuAction) => {
  void item.action?.run(context.value)
}

/* Search */

const searchValue = ref(controller.searchQuery.value)

const searchDebounced = useDebouncedCallback((value: string) => {
  void controller.setSearchQuery(value)
}, 250)

// Navigating clears the query in the controller.
watch(controller.searchQuery, (value) => {
  searchValue.value = value
})

function onSearchInput(event: Event) {
  searchValue.value = (event.target as HTMLInputElement).value
  searchDebounced(searchValue.value)
}

function clearSearch() {
  searchValue.value = ''
  void controller.setSearchQuery('')
}

const filterCount = computed(() => countActiveFilters(controller.filters.value))

const sortFields = computed(() => config.value.sortFields)
const sortIsAscending = computed(() => controller.sort.value.direction === 'asc')

function setSortField(field: (typeof sortFields.value)[number]) {
  controller.setSort({ ...controller.sort.value, field })
}

function setSortDirection(direction: 'asc' | 'desc') {
  controller.setSort({ ...controller.sort.value, direction })
}

/** Arrow keys move between the buttons of the toolbar, as the toolbar pattern expects. */
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return
  }

  const toolbar = event.currentTarget as HTMLElement
  const target = event.target as HTMLElement

  if (target.tagName === 'INPUT') {
    return
  }

  const buttons = Array.from(toolbar.querySelectorAll<HTMLElement>('button:not(:disabled)'))
  const index = buttons.indexOf(target)
  const forward = (event.key === 'ArrowRight') !== (getComputedStyle(toolbar).direction === 'rtl')

  if (index !== -1 && buttons.length > 0) {
    event.preventDefault()
    buttons[(index + (forward ? 1 : -1) + buttons.length) % buttons.length].focus()
  }
}

/* The toolbar actions collapse into a menu as space runs out. */

const renderAction = (item: ResolvedMenuAction) =>
  item.action
    ? h('span', null, [
        h(
          Tooltip,
          { label: item.label },
          {
            default: () =>
              h(
                ActionIcon,
                {
                  variant: 'subtle',
                  color: item.action?.color ?? 'gray',
                  size: 'lg',
                  disabled: !item.enabled,
                  'aria-label': item.label,
                  'data-action': item.action?.id,
                  onClick: () => runAction(item),
                },
                () => h(FileManagerActionIcon, { icon: item.action?.icon }),
              ),
          },
        ),
      ])
    : h('span', { 'data-toolbar-divider': true, 'aria-hidden': true })

/** Wrapped in an element: `OverflowList` measures the indicator, and a menu has no single root. */
const renderOverflow = (items: ResolvedMenuAction[]) =>
  h('span', null, [
    h(Menu, { position: 'bottom-end', shadow: 'md', width: 'max-content' }, () => [
      h(Menu.Target, null, () =>
        h(
          ActionIcon,
          {
            variant: 'subtle',
            color: 'gray',
            size: 'lg',
            'aria-label': labels.value.moreActions,
          },
          () => h(FileManagerIcon, { name: 'dots', size: 18 }),
        ),
      ),
      h(Menu.Dropdown, null, () => h(FileManagerActionMenu, { items, context: context.value })),
    ]),
  ])

const toggleSidebar = () => {
  if (compact.value) {
    ui.sidebarOpened.value = true
  } else {
    ui.sidebarVisible.value = !ui.sidebarVisible.value
  }
}

const toggleDetails = () => {
  ui.detailsOpened.value = !ui.detailsOpened.value
}
</script>

<template>
  <div v-bind="getStyles('toolbar')">
    <div
      v-bind="getStyles('toolbarStart')"
      role="toolbar"
      :aria-label="labels.toolbar"
      @keydown="onKeydown"
    >
      <component :is="slots.toolbarStart" v-if="slots.toolbarStart" :controller="controller" />

      <Tooltip v-if="config.sections.sidebar" :label="labels.toggleSidebar">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          :aria-label="labels.toggleSidebar"
          data-action="toggleSidebar"
          @click="toggleSidebar"
        >
          <FileManagerActionIcon :icon="compact ? 'menu' : 'sidebar'" />
        </ActionIcon>
      </Tooltip>

      <Tooltip v-for="item in navigationActions" :key="item.key" :label="item.label">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          :disabled="!item.enabled"
          :aria-label="item.label"
          :data-action="item.action?.id"
          @click="runAction(item)"
        >
          <FileManagerActionIcon :icon="item.action?.icon" />
        </ActionIcon>
      </Tooltip>

      <template v-if="!compact">
        <span data-toolbar-divider aria-hidden="true" />
        <OverflowList
          v-bind="getStyles('toolbarActions')"
          :data="toolbarActions"
          :render-item="renderAction"
          :render-overflow="renderOverflow"
          :get-item-key="(item: ResolvedMenuAction) => item.key"
        />
      </template>

      <div v-bind="getStyles('toolbarEnd')">
        <TextInput
          v-if="config.sections.search && !compact"
          v-bind="getStyles('search')"
          :model-value="searchValue"
          :placeholder="labels.searchPlaceholder"
          :aria-label="labels.search"
          type="search"
          size="xs"
          data-fm-search
          @input="onSearchInput"
          @keydown.esc="clearSearch"
        >
          <template #leftSection>
            <FileManagerActionIcon icon="search" :size="14" />
          </template>
          <template v-if="searchValue" #rightSection>
            <CloseButton size="xs" :aria-label="labels.clearSearch" @click="clearSearch" />
          </template>
        </TextInput>

        <Indicator
          v-if="config.sections.filters"
          :disabled="filterCount === 0"
          :label="filterCount"
          :size="16"
          inline
        >
          <Popover
            v-model:opened="ui.filtersOpened.value"
            position="bottom-end"
            shadow="md"
            :width="300"
            trap-focus
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                :aria-label="labels.filters"
                data-action="filters"
                @click="ui.filtersOpened.value = !ui.filtersOpened.value"
              >
                <FileManagerActionIcon icon="filter" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <FileManagerFilters />
            </Popover.Dropdown>
          </Popover>
        </Indicator>

        <Menu
          v-if="config.sections.sort"
          position="bottom-end"
          shadow="md"
          width="max-content"
          :close-on-item-click="false"
        >
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              :aria-label="labels.sort"
              data-action="sort"
            >
              <FileManagerActionIcon icon="sort" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{{ labels.sortBy }}</Menu.Label>
            <Menu.Item
              v-for="field in sortFields"
              :key="field"
              role="menuitemradio"
              :aria-checked="controller.sort.value.field === field"
              :data-sort-field="field"
              @click="setSortField(field)"
            >
              <template #leftSection>
                <FileManagerIcon
                  :name="controller.sort.value.field === field ? 'check' : 'chevronRight'"
                  :size="14"
                  :style="{ opacity: controller.sort.value.field === field ? 1 : 0 }"
                />
              </template>
              {{ labels.sortFields[field] }}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              role="menuitemradio"
              :aria-checked="sortIsAscending"
              @click="setSortDirection('asc')"
            >
              <template #leftSection>
                <FileManagerIcon name="arrowUp" :size="14" />
              </template>
              {{ labels.sortAscending }}
            </Menu.Item>
            <Menu.Item
              role="menuitemradio"
              :aria-checked="!sortIsAscending"
              @click="setSortDirection('desc')"
            >
              <template #leftSection>
                <FileManagerIcon name="arrowDown" :size="14" />
              </template>
              {{ labels.sortDescending }}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Menu
          v-if="config.sections.viewSwitch && viewOptions.length > 1"
          position="bottom-end"
          shadow="md"
          width="max-content"
        >
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              :aria-label="`${labels.view}: ${activeView?.label}`"
              data-action="view"
            >
              <FileManagerActionIcon :icon="activeView?.icon" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              v-for="view in viewOptions"
              :key="view.name"
              role="menuitemradio"
              :aria-checked="view.name === controller.view.value"
              :data-view="view.name"
              @click="controller.view.value = view.name"
            >
              <template #leftSection>
                <FileManagerActionIcon :icon="view.icon" :size="16" />
              </template>
              {{ view.label }}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Tooltip v-if="config.sections.details" :label="labels.toggleDetails">
          <ActionIcon
            :variant="ui.detailsOpened.value ? 'light' : 'subtle'"
            :color="ui.detailsOpened.value ? undefined : 'gray'"
            size="lg"
            :aria-label="labels.toggleDetails"
            :aria-pressed="ui.detailsOpened.value"
            data-action="toggleDetails"
            @click="toggleDetails"
          >
            <FileManagerActionIcon icon="panelRight" />
          </ActionIcon>
        </Tooltip>

        <Menu v-if="compact" position="bottom-end" shadow="md" width="max-content">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              :aria-label="labels.moreActions"
              data-action="more"
            >
              <FileManagerIcon name="dots" :size="18" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <FileManagerActionMenu :items="overflowActions" :context="context" />
          </Menu.Dropdown>
        </Menu>

        <component :is="slots.toolbarEnd" v-if="slots.toolbarEnd" :controller="controller" />
      </div>
    </div>

    <TextInput
      v-if="config.sections.search && compact"
      :model-value="searchValue"
      :placeholder="labels.searchPlaceholder"
      :aria-label="labels.search"
      type="search"
      size="sm"
      data-fm-search
      @input="onSearchInput"
      @keydown.esc="clearSearch"
    >
      <template #leftSection>
        <FileManagerActionIcon icon="search" :size="16" />
      </template>
      <template v-if="searchValue" #rightSection>
        <CloseButton size="sm" :aria-label="labels.clearSearch" @click="clearSearch" />
      </template>
    </TextInput>

    <FileManagerBreadcrumbs v-if="config.sections.breadcrumbs" />
  </div>
</template>
