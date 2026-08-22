<script lang="ts">
import type { WhatsAppIconName } from '../../icons'
import type { WhatsAppMediaType } from '../../types'

const defaultProps = {
  withRemove: true,
} as const

const UPLOAD_ICONS: Record<WhatsAppMediaType, WhatsAppIconName> = {
  image: 'photo',
  video: 'video',
  audio: 'microphone',
  document: 'file',
  sticker: 'photo',
}

export { defaultProps, UPLOAD_ICONS }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ActionIcon, Box, Progress, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type {
  WhatsAppAttachmentPreviewEmits,
  WhatsAppAttachmentPreviewOwnProps,
} from './WhatsAppAttachmentPreview.types'
import classes from './WhatsAppAttachmentPreview.module.css'

defineOptions({
  name: 'WhatsAppAttachmentPreview',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppAttachmentPreviewOwnProps>(), {
  withRemove: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppAttachmentPreviewEmits>()

const attrs = useAttrs()
const props = useProps('WhatsAppAttachmentPreview', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppAttachmentPreview',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'attachmentPreviewRoot',
})

const upload = computed(() => props.upload)
const isUploading = computed(
  () => upload.value.status === 'uploading' || upload.value.status === 'pending',
)
const isFailed = computed(() => upload.value.status === 'failed')

const thumbnail = computed(() =>
  upload.value.mediaType === 'image' || upload.value.mediaType === 'sticker'
    ? (upload.value.previewUrl ??
      upload.value.attachment?.thumbnailUrl ??
      upload.value.attachment?.url)
    : undefined,
)

const metaText = computed(() => {
  if (isUploading.value) {
    return upload.value.progress === undefined
      ? config.labels.uploading
      : `${config.labels.uploading} ${Math.round(upload.value.progress)}%`
  }

  return config.fileSize(upload.value.size)
})

/**
 * Use an indeterminate bar until the consumer reports progress.
 */
const progressValue = computed(() => upload.value.progress ?? 100)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('attachmentPreviewRoot') }"
    :data-status="upload.status"
    :data-media-type="upload.mediaType"
  >
    <Box v-bind="getStyles('attachmentPreviewThumb')">
      <img
        v-if="thumbnail"
        v-bind="getStyles('attachmentPreviewThumbImage')"
        :src="thumbnail"
        :alt="upload.fileName"
      />
      <WhatsAppIcon v-else :name="UPLOAD_ICONS[upload.mediaType]" size="20" />
    </Box>

    <Box v-bind="getStyles('attachmentPreviewBody')">
      <Box v-bind="getStyles('attachmentPreviewName')" :title="upload.fileName">
        {{ upload.fileName }}
      </Box>

      <Box v-if="isFailed" v-bind="getStyles('attachmentPreviewError')" role="alert">
        {{ upload.error || config.labels.uploadFailed }}
      </Box>

      <Box v-else v-bind="getStyles('attachmentPreviewMeta')">{{ metaText }}</Box>

      <Progress
        v-if="isUploading"
        v-bind="getStyles('attachmentPreviewProgress')"
        size="xs"
        :value="progressValue"
        :animated="upload.progress === undefined"
        :aria-label="config.labels.uploading"
      />
    </Box>

    <Box v-bind="getStyles('attachmentPreviewActions')">
      <ActionIcon
        v-if="isFailed"
        variant="subtle"
        color="red"
        size="sm"
        :aria-label="`${config.labels.retryUpload}: ${upload.fileName}`"
        @click="emit('retry', upload)"
      >
        <WhatsAppIcon name="refresh" size="16" />
      </ActionIcon>

      <ActionIcon
        v-if="isUploading"
        variant="subtle"
        color="gray"
        size="sm"
        :aria-label="`${config.labels.cancelUpload}: ${upload.fileName}`"
        @click="emit('cancel', upload)"
      >
        <WhatsAppIcon name="close" size="16" />
      </ActionIcon>

      <ActionIcon
        v-else-if="props.withRemove"
        variant="subtle"
        color="gray"
        size="sm"
        :aria-label="`${config.labels.removeAttachment}: ${upload.fileName}`"
        @click="emit('remove', upload)"
      >
        <WhatsAppIcon name="close" size="16" />
      </ActionIcon>
    </Box>
  </Box>
</template>
