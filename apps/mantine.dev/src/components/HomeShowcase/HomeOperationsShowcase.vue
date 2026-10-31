<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import {
  Badge,
  Button,
  Group,
  Paper,
  SegmentedControl,
  Text,
  ThemeIcon,
  Timeline,
} from '@mantine-vue/core'
import { createMemoryAdapter, FileManager } from '@mantine-vue/file-manager'
import {
  PhBell,
  PhCheck,
  PhCloudArrowUp,
  PhGitPullRequest,
  PhRocketLaunch,
  PhUsers,
} from '@phosphor-icons/vue'
import { createDemoFiles } from '@/demos/file-manager/_data'
import { useMediaQuery } from '@mantine-vue/hooks'

const fileAdapter = createMemoryAdapter({ files: createDemoFiles(), latency: [40, 120] })
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
const isMobile = useMediaQuery('(max-width: 67.5em)')
</script>

<template>
  <div class="operationsGrid">
    <FileManager
      :adapter="fileAdapter"
      class="fileManager"
      :view="isMobile ? 'details' : 'grid'"
      item-size="sm"
      radius="lg"
      :compact-breakpoint="640"
      :restrictions="{ maxFileSize: 25 * 1024 * 1024, maxFiles: 20 }"
      :confirm="{ delete: true, emptyTrash: true, trash: false }"
      conflict-strategy="rename"
    />

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

.sideHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--home-border);
}

/* .fileManager {
  height: 600px;
} */

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
  .operationsSide {
    grid-template-columns: 1fr;
  }

  .fileManager {
    height: 540px;
  }
}
</style>
