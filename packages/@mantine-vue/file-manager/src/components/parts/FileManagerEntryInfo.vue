<script setup lang="ts">
import { computed } from 'vue'
import { DataList, Stack, Text } from '@mantine-vue/core'
import { hasPermission } from '../../core/capabilities'
import { getFileExtension } from '../../core/paths'
import { useFileManagerContext } from '../../FileManager.context'
import type { FileEntry, FileEntryPermissions } from '../../types'
import FileManagerThumbnail from './FileManagerThumbnail.vue'

defineOptions({ name: 'FileManagerEntryInfo' })

const props = defineProps<{
  /** Entry to describe. */
  entry: FileEntry
}>()

const { labels, config, slots } = useFileManagerContext()

const PERMISSIONS: (keyof FileEntryPermissions)[] = [
  'write',
  'rename',
  'delete',
  'move',
  'copy',
  'download',
]

const isReadOnly = computed(() =>
  PERMISSIONS.every((permission) => !hasPermission(props.entry, permission)),
)
const isRestricted = computed(() =>
  PERMISSIONS.some((permission) => !hasPermission(props.entry, permission)),
)

const rows = computed(() => {
  const { entry } = props
  const { formatters } = config.value
  const text = labels.value

  const list: [label: string, value: string | undefined][] = [
    [
      text.type,
      entry.kind === 'folder'
        ? text.folderKind
        : (entry.mimeType ?? text.fileTypeName(getFileExtension(entry.name))),
    ],
    [text.size, entry.kind === 'file' ? formatters.size(entry.size) : undefined],
    [text.contents, entry.childCount !== undefined ? text.itemsCount(entry.childCount) : undefined],
    [text.location, entry.path],
    [text.originalLocation, entry.originalPath],
    [text.deletedAt, entry.trashedAt ? formatters.date(entry.trashedAt) : undefined],
    [text.modified, formatters.date(entry.modifiedAt)],
    [text.created, formatters.date(entry.createdAt)],
    [text.owner, entry.owner],
    [
      text.permissions,
      isReadOnly.value ? text.readOnly : isRestricted.value ? undefined : text.fullAccess,
    ],
  ]

  return [
    ...list,
    ...Object.entries(entry.metadata ?? {}).map(
      ([key, value]) =>
        [key, value === null || value === undefined ? undefined : String(value)] as [
          string,
          string | undefined,
        ],
    ),
  ].filter(([, value]) => !!value)
})
</script>

<template>
  <Stack gap="sm">
    <FileManagerThumbnail :entry="props.entry" :size="48" with-thumbnail data-fm-info-thumbnail />
    <Text size="sm" fw="600" style="overflow-wrap: anywhere">{{ props.entry.name }}</Text>
    <DataList size="xs" orientation="vertical" gap="xs">
      <DataList.Item v-for="[label, value] in rows" :key="label">
        <DataList.ItemLabel>{{ label }}</DataList.ItemLabel>
        <DataList.ItemValue style="overflow-wrap: anywhere">{{ value }}</DataList.ItemValue>
      </DataList.Item>
    </DataList>
    <component :is="slots.details" v-if="slots.details" :entry="props.entry" />
  </Stack>
</template>
