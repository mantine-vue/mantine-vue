<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import type { WhatsAppIconName } from '../../icons'
import type { WhatsAppMediaType } from '../../types'

const defaultProps = {
  withDownload: true,
  withPreview: true,
} as const

const MEDIA_ICONS: Record<WhatsAppMediaType, WhatsAppIconName> = {
  image: 'photo',
  video: 'video',
  audio: 'microphone',
  document: 'file',
  sticker: 'photo',
}

const varsResolver = createVarsResolver<any>((_, { maxWidth }) => ({
  mediaRoot: {
    '--wa-media-max-width':
      maxWidth === undefined
        ? undefined
        : typeof maxWidth === 'number'
          ? `${maxWidth}px`
          : maxWidth,
  },
}))

export { defaultProps, MEDIA_ICONS, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ActionIcon, Box, Text, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import { formatDuration } from '../../utils'
import type {
  WhatsAppMediaAttachmentEmits,
  WhatsAppMediaAttachmentOwnProps,
} from './WhatsAppMediaAttachment.types'
import classes from './WhatsAppMediaAttachment.module.css'

defineOptions({
  name: 'WhatsAppMediaAttachment',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppMediaAttachmentOwnProps>(), {
  direction: undefined,
  withDownload: undefined,
  withPreview: undefined,
  maxWidth: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppMediaAttachmentEmits>()

const attrs = useAttrs()
const props = useProps('WhatsAppMediaAttachment', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppMediaAttachment',
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
  varsResolver,
  rootSelector: 'mediaRoot',
})

const mediaType = computed(() => props.attachment.mediaType)
const url = computed(() => props.attachment.url)

/** Label used in place of a missing file name, so every control still has an accessible name. */
const typeLabel = computed(() => {
  switch (mediaType.value) {
    case 'image':
      return config.labels.messageTypeImage
    case 'video':
      return config.labels.messageTypeVideo
    case 'audio':
      return config.labels.messageTypeAudio
    case 'sticker':
      return config.labels.messageTypeSticker
    default:
      return config.labels.messageTypeDocument
  }
})

const fileName = computed(() => props.attachment.fileName || typeLabel.value)

const metaText = computed(() => {
  const parts = [
    config.fileSize(props.attachment.size),
    formatDuration(props.attachment.durationSeconds),
  ].filter(Boolean)

  return parts.join(' · ')
})

/**
 * Images and videos only get their rich renderer when there is something to render. A missing
 * `url` falls through to the document row, which still shows the file name and the download
 * action rather than an empty frame.
 */
const renderer = computed(() => {
  if (!props.withPreview || !url.value) {
    return 'document' as const
  }

  switch (mediaType.value) {
    case 'image':
    case 'sticker':
      return 'image' as const
    case 'video':
      return 'video' as const
    case 'audio':
      return 'audio' as const
    default:
      return 'document' as const
  }
})

const downloadDescription = computed(() => `${config.labels.download}: ${fileName.value}`)

function handleDownload() {
  emit('download', props.attachment)
}

function handlePreview() {
  emit('preview', props.attachment)
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('mediaRoot') }"
    :data-media-type="mediaType"
    :data-direction="props.direction"
  >
    <UnstyledButton
      v-if="renderer === 'image'"
      v-bind="getStyles('mediaImageControl')"
      type="button"
      :aria-label="`${config.labels.openInNewTab}: ${fileName}`"
      @click="handlePreview"
    >
      <img
        v-bind="getStyles('mediaImage')"
        :src="url"
        :alt="fileName"
        :width="props.attachment.width"
        :height="props.attachment.height"
        loading="lazy"
        decoding="async"
      />
    </UnstyledButton>

    <video
      v-else-if="renderer === 'video'"
      v-bind="getStyles('mediaVideo')"
      :src="url"
      :poster="props.attachment.thumbnailUrl"
      controls
      preload="metadata"
    />

    <audio
      v-else-if="renderer === 'audio'"
      v-bind="getStyles('mediaAudio')"
      :src="url"
      controls
      preload="metadata"
      :aria-label="config.labels.playAudio"
    />

    <Box v-else v-bind="getStyles('mediaDocument')">
      <Box v-bind="getStyles('mediaDocumentIcon')">
        <WhatsAppIcon :name="MEDIA_ICONS[mediaType]" size="24" />
      </Box>

      <Box v-bind="getStyles('mediaDocumentBody')">
        <Box v-bind="getStyles('mediaDocumentName')" :title="fileName">{{ fileName }}</Box>
        <Box v-if="metaText" v-bind="getStyles('mediaDocumentMeta')">{{ metaText }}</Box>
      </Box>

      <ActionIcon
        v-if="props.withDownload && url"
        v-bind="getStyles('mediaAction')"
        component="a"
        variant="subtle"
        color="gray"
        :href="url"
        :download="props.attachment.fileName ?? ''"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="downloadDescription"
        @click="handleDownload"
      >
        <WhatsAppIcon name="download" size="18" />
      </ActionIcon>

      <Text v-else-if="!url" v-bind="getStyles('mediaFallback')" component="span">
        {{ config.labels.mediaUnavailable }}
      </Text>
    </Box>
  </Box>
</template>
