import { defineComponent, h, ref } from 'vue'
import { Group, Paper, SimpleGrid, Stack, Text } from '@mantine-vue/core'
import {
  WhatsAppAttachmentPreview,
  WhatsAppComposer,
  WhatsAppMediaAttachment,
} from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppRejectedFile, WhatsAppUpload } from '@mantine-vue/whatsapp-inbox'
import type { MantineDemo } from '@/demo'
import { openWindowCapabilities } from './_data'
import { useInboxDemoState } from './_shared'

const uploadsCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { getMediaTypeFromMime } from '@mantine-vue/whatsapp-inbox'
import type { WhatsAppAttachmentsAddPayload, WhatsAppUpload } from '@mantine-vue/whatsapp-inbox'

const uploads = ref<WhatsAppUpload[]>([])

// The composer validates and previews the files. Uploading them is your job.
async function handleAttachmentsAdd({ files }: WhatsAppAttachmentsAddPayload) {
  for (const file of files) {
    const id = crypto.randomUUID()

    uploads.value = [...uploads.value, {
      id,
      fileName: file.name,
      mediaType: getMediaTypeFromMime(file.type),
      size: file.size,
      status: 'uploading',
      progress: 0,
      previewUrl: URL.createObjectURL(file),
    }]

    try {
      const attachment = await api.upload(file, (progress) => patch(id, { progress }))
      patch(id, { status: 'uploaded', attachment })
    } catch (error) {
      patch(id, { status: 'failed', error: (error as Error).message })
    }
  }
}
</script>

<template>
  <WhatsAppComposer
    conversation-id="conversation-1"
    :capabilities="capabilities"
    :uploads="uploads"
    @attachments-add="handleAttachmentsAdd"
    @attachment-remove="remove"
    @attachment-retry="retry"
    @attachment-cancel="cancel"
    @attachments-reject="(rejected) => notify(rejected[0].message)"
  />
</template>
`

const Uploads = defineComponent({
  name: 'WhatsAppMediaUploadsDemo',
  setup() {
    const state = useInboxDemoState({ conversationId: 'amina' })
    const rejected = ref<WhatsAppRejectedFile[]>([])

    return () =>
      h(Stack, { gap: 'sm' }, () => [
        h(
          Text,
          { size: 'xs', c: 'dimmed' },
          () =>
            'Attach a file to watch the upload states. Images up to 5 MB and one document up to 100 MB are accepted here.',
        ),
        h(Paper, { withBorder: true, radius: 'md' }, () =>
          h(WhatsAppComposer, {
            conversationId: 'amina',
            capabilities: openWindowCapabilities,
            uploads: state.uploads.value,
            modelValue: state.draft.value,
            'onUpdate:modelValue': (value: string) => {
              state.draft.value = value
            },
            onAttachmentsAdd: state.handleAttachmentsAdd,
            onAttachmentRemove: state.handleAttachmentRemove,
            onAttachmentsReject: (files: WhatsAppRejectedFile[]) => {
              rejected.value = files
            },
            onSend: state.handleSend,
          }),
        ),
        rejected.value.length > 0 &&
          h(
            Text,
            { size: 'xs', c: 'red' },
            () => `attachmentsReject: ${rejected.value.map((item) => item.message).join(', ')}`,
          ),
      ])
  },
})

export const uploads: MantineDemo = {
  type: 'code',
  component: Uploads,
  code: uploadsCode,
  maxWidth: '100%',
}

const uploadStatesCode = `
<template>
  <!-- Every upload state the consumer can report -->
  <WhatsAppAttachmentPreview :upload="{ status: 'uploading', progress: 40, /* … */ }" />
  <WhatsAppAttachmentPreview :upload="{ status: 'uploaded', /* … */ }" />
  <WhatsAppAttachmentPreview
    :upload="{ status: 'failed', error: 'Storage unavailable', /* … */ }"
    @retry="retryUpload"
  />
</template>
`

const uploadFixtures: WhatsAppUpload[] = [
  {
    id: 'u1',
    fileName: 'contract.pdf',
    mediaType: 'document',
    status: 'uploading',
    progress: 40,
    size: 2_400_000,
  },
  {
    id: 'u2',
    fileName: 'photo.png',
    mediaType: 'image',
    status: 'uploading',
    size: 820_000,
  },
  {
    id: 'u3',
    fileName: 'receipt.pdf',
    mediaType: 'document',
    status: 'uploaded',
    size: 184_320,
    attachment: { mediaType: 'document', fileName: 'receipt.pdf' },
  },
  {
    id: 'u4',
    fileName: 'video.mp4',
    mediaType: 'video',
    status: 'failed',
    size: 48_000_000,
    error: 'Storage unavailable',
  },
]

const UploadStates = defineComponent({
  name: 'WhatsAppUploadStatesDemo',
  setup: () => () =>
    h(SimpleGrid, { cols: { base: 1, sm: 2 }, spacing: 'sm' }, () =>
      uploadFixtures.map((upload) => h(WhatsAppAttachmentPreview, { key: upload.id, upload })),
    ),
})

export const uploadStates: MantineDemo = {
  type: 'code',
  component: UploadStates,
  code: uploadStatesCode,
  maxWidth: '100%',
}

const attachmentsCode = `
<script setup lang="ts">
import { WhatsAppMediaAttachment } from '@mantine-vue/whatsapp-inbox'
</script>

<template>
  <!-- Received media. A missing url degrades to a document row with the file name -->
  <WhatsAppMediaAttachment :attachment="{ mediaType: 'image', url: '/photo.png' }" />
  <WhatsAppMediaAttachment :attachment="{ mediaType: 'audio', url: '/voice.ogg' }" />
  <WhatsAppMediaAttachment
    :attachment="{ mediaType: 'document', fileName: 'invoice.pdf', size: 184320, url: '/a.pdf' }"
    @download="track"
  />
</template>
`

const Attachments = defineComponent({
  name: 'WhatsAppMediaAttachmentDemo',
  setup: () => () =>
    h(Stack, { gap: 'md' }, () => [
      h(Group, { align: 'flex-start', gap: 'md', wrap: 'wrap' }, () => [
        h(WhatsAppMediaAttachment, {
          maxWidth: 240,
          attachment: {
            mediaType: 'image',
            fileName: 'photo.png',
            width: 240,
            height: 135,
            url: 'https://placehold.co/480x270/128C7E/FFFFFF/png?text=Photo',
          },
        }),
        h(WhatsAppMediaAttachment, {
          maxWidth: 260,
          attachment: {
            mediaType: 'document',
            fileName: 'invoice-4821.pdf',
            mimeType: 'application/pdf',
            size: 184_320,
            url: 'https://mantine-vue.dev/invoice.pdf',
          },
        }),
      ]),
      h(WhatsAppMediaAttachment, {
        maxWidth: 320,
        attachment: { mediaType: 'audio', fileName: 'voice-note.ogg', durationSeconds: 34 },
      }),
      h(
        Text,
        { size: 'xs', c: 'dimmed' },
        () =>
          'The audio attachment has no url, so it falls back to a document row rather than an empty player.',
      ),
    ]),
})

export const attachments: MantineDemo = {
  type: 'code',
  component: Attachments,
  code: attachmentsCode,
  maxWidth: '100%',
}
