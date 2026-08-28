<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  Paper,
  Progress,
  SegmentedControl,
  Text,
  ThemeIcon,
  Timeline,
} from '@mantine-vue/core'
import {
  PhBell,
  PhCheck,
  PhCloudArrowUp,
  PhCode,
  PhDotsThree,
  PhFileImage,
  PhFilePdf,
  PhFolder,
  PhFolderOpen,
  PhGitPullRequest,
  PhRocketLaunch,
  PhUsers,
} from '@phosphor-icons/vue'

const fileView = ref('List')
const selectedFiles = ref<string[]>([])
const notificationFilter = ref('All')
const notificationsCenter = ref([
  {
    id: 1,
    title: 'Release 3.2 is ready',
    detail: 'CI completed all checks',
    time: '4m',
    unread: true,
    icon: markRaw(PhRocketLaunch),
    color: 'blue',
  },
  {
    id: 2,
    title: 'Maya mentioned you',
    detail: 'In Dashboard polish',
    time: '18m',
    unread: true,
    icon: markRaw(PhUsers),
    color: 'violet',
  },
  {
    id: 3,
    title: 'Pull request approved',
    detail: '#184 by Noah Lee',
    time: '1h',
    unread: false,
    icon: markRaw(PhGitPullRequest),
    color: 'teal',
  },
])

const files = [
  {
    id: 'brand',
    name: 'Brand assets',
    type: 'Folder',
    size: '24 items',
    modified: 'Just now',
    icon: PhFolder,
    color: 'blue',
  },
  {
    id: 'research',
    name: 'Research notes.pdf',
    type: 'PDF',
    size: '4.2 MB',
    modified: '12 min ago',
    icon: PhFilePdf,
    color: 'red',
  },
  {
    id: 'prototype',
    name: 'Portal prototype.vue',
    type: 'Vue',
    size: '86 KB',
    modified: '1 hour ago',
    icon: PhCode,
    color: 'teal',
  },
  {
    id: 'preview',
    name: 'Launch preview.png',
    type: 'Image',
    size: '2.8 MB',
    modified: 'Yesterday',
    icon: PhFileImage,
    color: 'violet',
  },
]

const visibleNotifications = computed(() =>
  notificationFilter.value === 'Unread'
    ? notificationsCenter.value.filter((notification) => notification.unread)
    : notificationsCenter.value,
)

function markAllRead() {
  notificationsCenter.value.forEach((notification) => {
    notification.unread = false
  })
}

function toggleFile(id: string, checked: boolean) {
  selectedFiles.value = checked
    ? [...new Set([...selectedFiles.value, id])]
    : selectedFiles.value.filter((fileId) => fileId !== id)
}
</script>

<template>
  <div class="operationsGrid">
    <Paper class="fileManager" radius="lg">
      <header class="operationsHeader">
        <div>
          <Group :gap="8"
            ><ThemeIcon variant="light"><PhFolderOpen :size="17" /></ThemeIcon
            ><Text fw="750">File manager</Text></Group
          >
          <Text c="dimmed" size="xs" mt="4">Northstar Studio / Product launch</Text>
        </div>
        <Group :gap="8">
          <SegmentedControl
            v-model="fileView"
            :data="[
              { value: 'List', label: 'List' },
              { value: 'Grid', label: 'Grid' },
            ]"
            size="xs"
          />
          <Button size="sm"
            ><template #leftSection><PhCloudArrowUp :size="15" /></template>Upload</Button
          >
        </Group>
      </header>

      <div class="storageBar">
        <Group justify="space-between" mb="6"
          ><Text size="xs" fw="650">18.6 GB of 50 GB used</Text
          ><Text size="xs" c="dimmed">37%</Text></Group
        >
        <Progress :value="37" size="xs" radius="xl" />
      </div>

      <div class="fileTable" :data-view="fileView.toLowerCase()">
        <div class="fileTableHead">
          <span>Name</span><span>Type</span><span>Size</span><span>Modified</span><span />
        </div>
        <div
          v-for="file in files"
          :key="file.id"
          class="fileRow"
          :class="{ selected: selectedFiles.includes(file.id) }"
        >
          <div class="fileName">
            <Checkbox
              :model-value="selectedFiles.includes(file.id)"
              :aria-label="`Select ${file.name}`"
              @update:model-value="toggleFile(file.id, $event)"
            />
            <ThemeIcon :color="file.color" variant="light" radius="md"
              ><component :is="file.icon" :size="17"
            /></ThemeIcon>
            <Text fw="650" size="sm">{{ file.name }}</Text>
          </div>
          <Text size="xs" c="dimmed">{{ file.type }}</Text>
          <Text size="xs" c="dimmed">{{ file.size }}</Text>
          <Text size="xs" c="dimmed">{{ file.modified }}</Text>
          <Menu position="bottom-end">
            <Menu.Target
              ><ActionIcon variant="subtle" color="gray" aria-label="File actions"
                ><PhDotsThree :size="18" /></ActionIcon
            ></Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Preview</Menu.Item><Menu.Item>Download</Menu.Item
              ><Menu.Item>Share</Menu.Item> <Menu.Divider /><Menu.Item color="red"
                >Move to trash</Menu.Item
              >
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </Paper>

    <div class="operationsSide">
      <Paper class="notificationCenter" radius="lg">
        <header class="sideHeader">
          <Group :gap="9"
            ><ThemeIcon variant="light"><PhBell :size="17" /></ThemeIcon>
            <div>
              <Text fw="750" size="sm">Notifications center</Text
              ><Text c="dimmed" size="xs"
                >{{ notificationsCenter.filter((item) => item.unread).length }} unread</Text
              >
            </div></Group
          >
          <Button variant="subtle" size="compact-xs" @click="markAllRead">Mark all read</Button>
        </header>
        <div class="notificationFilters">
          <SegmentedControl
            v-model="notificationFilter"
            :data="['All', 'Unread']"
            size="xs"
            full-width
          />
        </div>
        <div class="notificationList">
          <button
            v-for="item in visibleNotifications"
            :key="item.id"
            type="button"
            class="notificationItem"
            :class="{ unread: item.unread }"
            @click="item.unread = false"
          >
            <ThemeIcon :color="item.color" variant="light" radius="xl"
              ><component :is="item.icon" :size="16"
            /></ThemeIcon>
            <span
              ><strong>{{ item.title }}</strong
              ><small>{{ item.detail }} · {{ item.time }}</small></span
            >
            <i v-if="item.unread" />
          </button>
          <Text v-if="visibleNotifications.length === 0" c="dimmed" size="sm" ta="center" py="xl"
            >You’re all caught up</Text
          >
        </div>
      </Paper>

      <Paper class="activityCard" radius="lg">
        <Group justify="space-between" mb="lg"
          ><div>
            <Text fw="750" size="sm">Activity feed</Text
            ><Text c="dimmed" size="xs">Today in Northstar</Text>
          </div>
          <Badge variant="light">Live</Badge></Group
        >
        <Timeline :active="2" :bullet-size="24" :line-width="2">
          <Timeline.Item title="Deployment completed">
            <template #bullet><PhRocketLaunch :size="13" /></template>
            <Text c="dimmed" size="xs">Production is running version 3.2.0</Text>
            <Text size="10px" c="dimmed" mt="4">8 minutes ago</Text>
          </Timeline.Item>
          <Timeline.Item title="Design assets uploaded">
            <template #bullet><PhCloudArrowUp :size="13" /></template>
            <Text c="dimmed" size="xs">Maya added 12 files to Brand assets</Text>
            <Text size="10px" c="dimmed" mt="4">32 minutes ago</Text>
          </Timeline.Item>
          <Timeline.Item title="Review approved" line-variant="dashed">
            <template #bullet><PhCheck :size="13" /></template>
            <Text c="dimmed" size="xs">Noah approved the release checklist</Text>
          </Timeline.Item>
        </Timeline>
      </Paper>
    </div>
  </div>
</template>

<style scoped>
.operationsGrid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(310px, 0.75fr);
  align-items: start;
  gap: 20px;
}

.fileManager,
.notificationCenter,
.activityCard {
  overflow: hidden;
  border: 1px solid var(--home-border);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 18px 55px alpha(var(--mantine-color-black), 0.06);
}

.operationsHeader,
.sideHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--home-border);
}

.storageBar {
  padding: 16px 20px;
  border-bottom: 1px solid var(--home-border);
  background: var(--home-subtle);
}

.fileTableHead,
.fileRow {
  display: grid;
  grid-template-columns: minmax(230px, 1fr) 70px 70px 95px 28px;
  align-items: center;
  gap: 12px;
  min-width: 590px;
  padding: 11px 16px;
}

.fileTable {
  overflow-x: auto;
}

.fileTableHead {
  color: var(--mantine-color-dimmed);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.fileRow {
  border-top: 1px solid var(--home-border);
}

.fileRow:hover,
.fileRow.selected {
  background: var(--home-subtle);
}

.fileTable[data-view='grid'] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
}

.fileTable[data-view='grid'] .fileTableHead {
  display: none;
}

.fileTable[data-view='grid'] .fileRow {
  grid-template-columns: minmax(0, 1fr) 28px;
  min-width: 0;
  min-height: 82px;
  border: 1px solid var(--home-border);
  border-radius: var(--mantine-radius-md);
}

.fileTable[data-view='grid'] .fileRow > :nth-child(2),
.fileTable[data-view='grid'] .fileRow > :nth-child(3),
.fileTable[data-view='grid'] .fileRow > :nth-child(4) {
  display: none;
}

.fileName {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.fileName :deep(.mantine-Text-root) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operationsSide {
  display: grid;
  gap: 20px;
}

.notificationFilters {
  padding: 10px 14px;
  border-bottom: 1px solid var(--home-border);
}

.notificationItem {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 12px 15px;
  border: 0;
  border-bottom: 1px solid var(--home-border);
  background: transparent;
  color: var(--mantine-color-text);
  text-align: left;
  cursor: pointer;
}

.notificationItem:hover,
.notificationItem.unread {
  background: var(--home-subtle);
}

.notificationItem span,
.notificationItem strong,
.notificationItem small {
  display: block;
  min-width: 0;
}

.notificationItem span {
  flex: 1;
}

.notificationItem strong {
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notificationItem small {
  margin-top: 3px;
  color: var(--mantine-color-dimmed);
  font-size: 9px;
}

.notificationItem i {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--mantine-primary-color-filled);
}

.activityCard {
  padding: 18px 20px;
}

@media (max-width: 920px) {
  .operationsGrid {
    grid-template-columns: 1fr;
  }

  .operationsSide {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .operationsHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .operationsSide {
    grid-template-columns: 1fr;
  }

  .fileTable[data-view='grid'] {
    grid-template-columns: 1fr;
  }
}
</style>
