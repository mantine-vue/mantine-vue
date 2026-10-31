<script setup lang="ts">
import { computed } from 'vue'
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'
import type { FileCategory, FileFilters } from '../../types'

defineOptions({ name: 'FileManagerFilters' })

const { controller, labels } = useFileManagerContext()

const BYTES_PER_MB = 1024 * 1024

const CATEGORIES: FileCategory[] = [
  'folder',
  'image',
  'video',
  'audio',
  'pdf',
  'document',
  'spreadsheet',
  'presentation',
  'archive',
  'code',
  'text',
  'other',
]

const filters = computed(() => controller.filters.value)
const favoritesAvailable = computed(() => controller.capabilities.value.favorites)

const update = (changes: Partial<FileFilters>) =>
  controller.setFilters({ ...filters.value, ...changes })

function toggleCategory(category: FileCategory, checked: boolean) {
  const current = filters.value.categories ?? []

  update({
    categories: checked ? [...current, category] : current.filter((item) => item !== category),
  })
}

const toMb = (bytes: number | undefined) =>
  bytes === undefined ? '' : Number((bytes / BYTES_PER_MB).toFixed(2))

const toBytes = (value: unknown) =>
  value === '' || value === undefined ? undefined : Number(value) * BYTES_PER_MB

const toDateInput = (value: FileFilters['modifiedAfter']) =>
  value === undefined ? '' : new Date(value).toISOString().slice(0, 10)

/** `date` inputs yield a day. The upper bound includes that whole day. */
const toBound = (value: string, endOfDay: boolean) =>
  value ? `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}` : undefined
</script>

<template>
  <Stack gap="sm" data-fm-filters>
    <div>
      <Text size="sm" :fw="500" mb="xs">{{ labels.fileType }}</Text>
      <SimpleGrid :cols="2" spacing="xs" vertical-spacing="xs">
        <Checkbox
          v-for="category in CATEGORIES"
          :key="category"
          size="xs"
          :label="labels.categories[category]"
          :checked="filters.categories?.includes(category) ?? false"
          :data-category="category"
          @update:checked="toggleCategory(category, $event)"
        />
      </SimpleGrid>
    </div>

    <SimpleGrid :cols="2" spacing="xs">
      <NumberInput
        size="xs"
        :min="0"
        :label="`${labels.minSize} (${labels.sizeUnit})`"
        :model-value="toMb(filters.minSize)"
        @update:model-value="update({ minSize: toBytes($event) })"
      />
      <NumberInput
        size="xs"
        :min="0"
        :label="`${labels.maxSize} (${labels.sizeUnit})`"
        :model-value="toMb(filters.maxSize)"
        @update:model-value="update({ maxSize: toBytes($event) })"
      />
      <TextInput
        size="xs"
        type="date"
        :label="labels.modifiedAfter"
        :model-value="toDateInput(filters.modifiedAfter)"
        @update:model-value="update({ modifiedAfter: toBound($event, false) })"
      />
      <TextInput
        size="xs"
        type="date"
        :label="labels.modifiedBefore"
        :model-value="toDateInput(filters.modifiedBefore)"
        @update:model-value="update({ modifiedBefore: toBound($event, true) })"
      />
    </SimpleGrid>

    <Switch
      v-if="favoritesAvailable"
      size="xs"
      :label="labels.starredOnly"
      :checked="filters.starredOnly ?? false"
      @update:checked="update({ starredOnly: $event })"
    />

    <Group justify="flex-end">
      <Button
        size="xs"
        variant="subtle"
        data-action="clearFilters"
        @click="controller.clearFilters()"
      >
        {{ labels.clearFilters }}
      </Button>
    </Group>
  </Stack>
</template>
