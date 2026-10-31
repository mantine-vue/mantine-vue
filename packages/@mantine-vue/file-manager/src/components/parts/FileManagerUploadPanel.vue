<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Text,
  Tooltip,
} from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileUploadItem } from '../../types'

defineOptions({ name: 'FileManagerUploadPanel' })

const { controller, labels, config, ui, getStyles } = useFileManagerContext()
const { uploads } = controller

const items = uploads.items
const visible = computed(() => ui.uploadsOpened.value && items.value.length > 0)
const done = computed(() => uploads.finished.value.length)

// A new upload brings the panel back after it was closed.
watch(
  () => uploads.active.value.length,
  (count) => {
    if (count > 0) {
      ui.uploadsOpened.value = true
    }
  },
)

const STATUS_COLORS: Partial<Record<FileUploadItem['status'], string>> = {
  success: 'teal',
  error: 'red',
  rejected: 'red',
  canceled: 'gray',
  skipped: 'gray',
}

const canCancel = (item: FileUploadItem) => item.status === 'queued' || item.status === 'uploading'
const canRetry = (item: FileUploadItem) => item.status === 'error' || item.status === 'canceled'
const close = () => {
  ui.uploadsOpened.value = false
}
</script>

<template>
  <Paper
    v-if="visible"
    v-bind="getStyles('uploadPanel')"
    shadow="md"
    with-border
    role="region"
    :aria-label="labels.uploads"
  >
    <Group justify="space-between" wrap="nowrap" gap="xs">
      <Text size="sm" fw="600">
        {{ labels.uploads }}
        <Text span size="xs" c="dimmed">{{ labels.uploadsSummary(done, items.length) }}</Text>
      </Text>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        :disabled="uploads.uploading.value"
        :aria-label="labels.closeUploads"
        data-action="closeUploads"
        @click="close"
      >
        <FileManagerIcon name="x" :size="14" />
      </ActionIcon>
    </Group>

    <Progress
      size="xs"
      :value="uploads.progress.value"
      :aria-label="labels.uploads"
      :animated="uploads.uploading.value"
    />

    <ScrollArea.Autosize mah="200">
      <ul data-fm-upload-list>
        <li
          v-for="item in items"
          v-bind="getStyles('uploadItem')"
          :key="item.id"
          :data-status="item.status"
        >
          <div data-fm-upload-info>
            <Text size="xs" truncate :title="item.relativePath ?? item.name">{{ item.name }}</Text>
            <Text size="xs" :c="STATUS_COLORS[item.status] ?? 'dimmed'" truncate>
              {{ item.error?.message ?? labels.uploadStatus[item.status] }}
              <template v-if="item.status === 'uploading'">
                · {{ Math.round(item.progress) }}% ·
                {{ config.formatters.size(item.size) }}
              </template>
            </Text>
            <Progress
              v-if="item.status === 'uploading'"
              size="2"
              :value="item.progress"
              :aria-label="item.name"
            />
          </div>

          <Tooltip v-if="canRetry(item)" :label="labels.retryUpload">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              :aria-label="`${labels.retryUpload}: ${item.name}`"
              data-action="retryUpload"
              @click="uploads.retry(item.id)"
            >
              <FileManagerIcon name="refresh" :size="14" />
            </ActionIcon>
          </Tooltip>

          <Tooltip :label="canCancel(item) ? labels.cancelUpload : labels.removeUpload">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              :aria-label="`${canCancel(item) ? labels.cancelUpload : labels.removeUpload}: ${item.name}`"
              :data-action="canCancel(item) ? 'cancelUpload' : 'removeUpload'"
              @click="canCancel(item) ? uploads.cancel(item.id) : uploads.remove(item.id)"
            >
              <FileManagerIcon name="x" :size="14" />
            </ActionIcon>
          </Tooltip>
        </li>
      </ul>
    </ScrollArea.Autosize>

    <Group gap="xs" justify="flex-end">
      <Button
        v-if="uploads.failed.value.length > 0"
        size="compact-xs"
        variant="subtle"
        @click="uploads.retryFailed()"
      >
        {{ labels.retryFailedUploads }}
      </Button>
      <Button
        v-if="uploads.uploading.value"
        size="compact-xs"
        variant="subtle"
        color="gray"
        @click="uploads.cancelAll()"
      >
        {{ labels.cancelAllUploads }}
      </Button>
      <Button
        v-else
        size="compact-xs"
        variant="subtle"
        color="gray"
        @click="uploads.clearFinished()"
      >
        {{ labels.clearFinishedUploads }}
      </Button>
    </Group>
  </Paper>
</template>
