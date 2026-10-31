<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import {
  ActionIcon,
  Box,
  Button,
  Center,
  EmptyState,
  Group,
  Image,
  Loader,
  Modal,
  Text,
  Tooltip,
} from '@mantine-vue/core'
import { hasPermission } from '../../core/capabilities'
import { isAbortError, toFileErrorInfo } from '../../core/errors'
import { getFileCategory, isSafePreviewUrl } from '../../core/file-types'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileEntry, FilePreviewSource } from '../../types'

defineOptions({ name: 'FileManagerPreview' })

const { controller, labels, config, ui, compact, getStyles } = useFileManagerContext()

/** Largest text rendered in the preview, so that a huge log cannot freeze the page. */
const MAX_TEXT_BYTES = 2 * 1024 * 1024

const entry = controller.previewEntry
const source = shallowRef<FilePreviewSource | null>(null)
const url = shallowRef<string | null>(null)
const text = shallowRef<string | null>(null)
const failed = shallowRef(false)
const loading = shallowRef(false)

let objectUrl: string | null = null
let loadController: AbortController | null = null

function reset() {
  loadController?.abort()
  loadController = null

  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }

  source.value = null
  url.value = null
  text.value = null
  failed.value = false
  loading.value = false
}

const category = computed(() => (entry.value ? getFileCategory(entry.value) : 'other'))
const isTextual = computed(() => category.value === 'text' || category.value === 'code')

/** Renderable through the fixed types below. Anything else falls back to a download prompt. */
const BLOB_TYPES: Partial<Record<string, string>> = { pdf: 'application/pdf' }

const PREVIEWABLE = ['image', 'video', 'audio', 'pdf', 'text', 'code']

async function load(target: FileEntry) {
  const getPreview = controller.adapter.value.getPreview

  // Without a renderer the content would be fetched only to show the fallback.
  if (!getPreview || (!customRenderer.value && !PREVIEWABLE.includes(category.value))) {
    return
  }

  const controllerForLoad = new AbortController()

  loadController = controllerForLoad
  loading.value = true

  try {
    const result = await getPreview.call(controller.adapter.value, {
      id: target.id,
      signal: controllerForLoad.signal,
    })

    if (controllerForLoad.signal.aborted) {
      return
    }

    source.value = result

    if (result.text !== undefined) {
      text.value = result.text.slice(0, MAX_TEXT_BYTES)
    } else if (result.blob) {
      if (isTextual.value) {
        text.value = await result.blob.slice(0, MAX_TEXT_BYTES).text()
      } else {
        // The type comes from the entry category and not from the content, so a file posing as
        // a PDF can never make the browser run it as a document.
        const blob = BLOB_TYPES[category.value]
          ? new Blob([result.blob], { type: BLOB_TYPES[category.value] })
          : result.blob

        objectUrl = URL.createObjectURL(blob)
        url.value = objectUrl
      }
    } else if (result.url && isSafePreviewUrl(result.url)) {
      if (isTextual.value) {
        const response = await fetch(result.url, { signal: controllerForLoad.signal })

        text.value = (await response.text()).slice(0, MAX_TEXT_BYTES)
      } else {
        url.value = result.url
      }
    } else {
      failed.value = true
    }
  } catch (cause) {
    if (!isAbortError(cause)) {
      // A backend that holds no preview for a file is not a failure.
      failed.value = toFileErrorInfo(cause).code !== 'not-found'
    }
  } finally {
    if (loadController === controllerForLoad) {
      loading.value = false
    }
  }
}

watch(entry, (value) => {
  reset()

  if (value) {
    void load(value)
  }
})

onBeforeUnmount(reset)

const customRenderer = computed(() =>
  entry.value
    ? config.value.previewRenderers.find((renderer) => renderer.test(entry.value!))
    : undefined,
)

const canRender = computed(
  () =>
    !!customRenderer.value ||
    (text.value !== null && isTextual.value) ||
    (url.value !== null && ['image', 'video', 'audio', 'pdf'].includes(category.value)),
)

const position = computed(
  () => controller.previewableEntries.value.findIndex((item) => item.id === entry.value?.id) + 1,
)
const count = computed(() => controller.previewableEntries.value.length)
const canStep = computed(() => count.value > 1)

const canDownload = computed(
  () =>
    !!entry.value &&
    controller.capabilities.value.download &&
    hasPermission(entry.value, 'download'),
)

const download = () => entry.value && controller.download([entry.value])

function closePreview() {
  controller.closePreview()
  ui.focusContent()
}

function onKeydown(event: KeyboardEvent) {
  if ((event.target as HTMLElement).closest('video, audio')) {
    return
  }

  if (event.key === 'ArrowRight') {
    controller.stepPreview(1)
  } else if (event.key === 'ArrowLeft') {
    controller.stepPreview(-1)
  }
}
</script>

<template>
  <Modal
    v-bind="getStyles('portal')"
    :return-focus="false"
    :opened="!!entry"
    size="80%"
    :full-screen="compact"
    :aria-label="entry ? labels.previewTitle(entry.name) : undefined"
    data-fm-dialog="preview"
    @close="closePreview"
  >
    <template #title>
      <Group gap="xs" wrap="nowrap">
        <Text size="sm" fw="600" truncate>{{ entry?.name }}</Text>
        <Text v-if="canStep && entry" size="xs" c="dimmed" style="white-space: nowrap">
          {{ labels.previewPosition(position, count) }}
        </Text>
      </Group>
    </template>

    <Box v-if="entry" v-bind="getStyles('previewBody')" tabindex="-1" @keydown="onKeydown">
      <Center v-if="loading && !customRenderer" h="100%">
        <Loader :aria-label="labels.loading" />
      </Center>

      <component
        :is="customRenderer.component"
        v-else-if="customRenderer && entry"
        :entry="entry"
        :source="source"
        :url="url"
      />

      <Image
        v-else-if="url && category === 'image'"
        :src="url"
        :alt="entry?.name"
        fit="contain"
        h="100%"
      />

      <video
        v-else-if="url && category === 'video'"
        :src="url"
        controls
        preload="metadata"
        :aria-label="entry?.name"
      />

      <audio
        v-else-if="url && category === 'audio'"
        :src="url"
        controls
        preload="metadata"
        :aria-label="entry?.name"
      />

      <object
        v-else-if="url && category === 'pdf'"
        :data="url"
        type="application/pdf"
        :aria-label="entry ? labels.previewFrame(entry.name) : undefined"
      >
        <Text size="sm">{{ labels.previewUnavailableDescription }}</Text>
      </object>

      <pre v-else-if="text !== null && canRender" v-bind="getStyles('previewText')" tabindex="0">{{
        text
      }}</pre>

      <Center v-else h="100%">
        <EmptyState>
          <template #icon>
            <FileManagerIcon :name="failed ? 'alert' : 'file'" :size="24" />
          </template>
          <template #title>
            {{ failed ? labels.previewError : labels.previewUnavailable }}
          </template>
          <template #description>{{ labels.previewUnavailableDescription }}</template>
        </EmptyState>
      </Center>
    </Box>

    <Group justify="space-between" mt="sm">
      <Group gap="xs">
        <Tooltip :label="labels.previousFile">
          <ActionIcon
            variant="default"
            size="lg"
            :disabled="!canStep"
            :aria-label="labels.previousFile"
            data-action="previousFile"
            @click="controller.stepPreview(-1)"
          >
            <FileManagerIcon name="chevronLeft" :size="18" />
          </ActionIcon>
        </Tooltip>
        <Tooltip :label="labels.nextFile">
          <ActionIcon
            variant="default"
            size="lg"
            :disabled="!canStep"
            :aria-label="labels.nextFile"
            data-action="nextFile"
            @click="controller.stepPreview(1)"
          >
            <FileManagerIcon name="chevronRight" :size="18" />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Button
        v-if="canDownload"
        size="sm"
        variant="default"
        data-action="previewDownload"
        @click="download"
      >
        <template #leftSection><FileManagerIcon name="download" :size="16" /></template>
        {{ labels.download }}
      </Button>
    </Group>
  </Modal>
</template>
